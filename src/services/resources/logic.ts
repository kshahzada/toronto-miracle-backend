import { find, read } from "../../integrations/airtable";
import jwt from 'jsonwebtoken';
import { IErrorResponse } from "../../types/errors";
import { ILogicResponse, ICookie } from "../../types/types";
import { resourceNotFoundError, serverError, authenticationFailedError } from "../../errors";

const { accessTokenSecret, local } = process.env;
const TOKEN_EXPIRY_TIME = 8*60*60; // 8hr in seconds

export const getLoggedInLogic = async (userId: string) : Promise<ILogicResponse | IErrorResponse> => {
    const rawUser: any = await read("contacts", userId); // TODO :- need to actually define the type here
    const user = {
        id: userId,
        email: rawUser.Email,
        firstName: rawUser["First Name"],
        lastName: rawUser["Last Name"],
        phoneNumber: rawUser["Phone Number"],
        isCaptain: rawUser.isCaptain,
        neighbourhoods: rawUser.neighbourhood
    };

    const response: ILogicResponse = {
        responseBody: user,
        statusCode: 200,
    };
    return response;
};

export const getTokenLogic = async (email: string, phoneNumber: string, hostname: string): Promise<ILogicResponse | IErrorResponse> => {
    // check if valid user
    const matchingUsers: any = await find("contacts", `email=\'${email}\'`, ["Email", "Phone Number", "First Name", "Last Name", "isCaptain", "neighbourhood"]); // TODO -: this is bad, we should be loading it into a type
    console.log({matchingUsers})
    // if more than one user, send server error
    if(matchingUsers.length > 1){
        return serverError("Multiple users found");
    }

    // if no user is found, send auth error
    if(matchingUsers.length !== 1){
        return authenticationFailedError();
    }
    console.log(matchingUsers[0])

    const matchedUser = {
        id: matchingUsers[0].id,
        email: matchingUsers[0].Email,
        firstName: matchingUsers[0]["First Name"],
        lastName: matchingUsers[0]["Last Name"],
        phoneNumber: matchingUsers[0]["Phone Number"],
        isCaptain: matchingUsers[0].isCaptain,
        neighbourhoods: matchingUsers[0].neighbourhood
    };

    // if real user doesn't have a matching phone number, send auth error (STRIPS JUST NUMBERS FROM PHONE NUMBERS STRING)
    if(matchedUser.phoneNumber.replace(/\D/g,'') !== phoneNumber.replace(/\D/g,'')  || matchedUser.isCaptain !== true){
        return authenticationFailedError();
    }

    // generate access token
    const accessToken = jwt.sign({ userId: matchedUser.id, neighbourhoods: matchedUser.neighbourhoods, team: [], role: "captain" }, accessTokenSecret, {expiresIn: TOKEN_EXPIRY_TIME});

    // if real user - send success + set auth cookie
    const cookies: ICookie[] = [
        {
            name: "id_token",
            val: accessToken,
            options: {
                maxAge: TOKEN_EXPIRY_TIME * 1000, // convert to ms
                httpOnly: true,
                ...(local ? {} : { domain: "torontomiracle.org" }), // conditionally set domain if you are not developping locally
                sameSite: "lax"
            }
        },
    ];


    const response: ILogicResponse = {
        responseBody: matchedUser,
        cookies,
        statusCode: 200,
    };
    return response;
};

export const healthCheckLogic = async (): Promise<ILogicResponse> => {
    const response: ILogicResponse = {
        responseBody: { message: "v1 - Alive!" },
        statusCode: 200,
    };
    return response;
};

export const captainVolunteersLogic = async (captain_id: string): Promise<ILogicResponse> => {
    // empty filterByFormula for now, replace with captain_id once ready
    const volunteers = await find("Contacts", "", ["First Name", "Last Name", "Email", "Phone Number"] , [], "Volunteers");
    if (volunteers === undefined){
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: volunteers },
        statusCode: 200,
    };
    return response;
};

export const neighbourhoodVolunteersLogic = async (neighbourhood: string): Promise<ILogicResponse> => {
    // empty filterByFormula for now, replace with captain_id once ready
    const volunteers = await find("Contacts", `FIND('${neighbourhood}', neighbourhood)>0`, ["First Name", "Last Name", "Email", "Phone Number", "Vehicle Access", "Waiver"] , [], "Volunteers");
    if (volunteers === undefined){
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: volunteers },
        statusCode: 200,
    };
    return response;
};