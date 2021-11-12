import { find, read, update } from "../../integrations/airtable";
import jwt from 'jsonwebtoken';
import { IErrorResponse } from "../../types/errors";
import { ILogicResponse, ICookie, IUpdateFields, ICaptain } from "../../types/types";
import { resourceNotFoundError, serverError, authenticationFailedError } from "../../errors";
import { findCaptainByEmail, getCaptain } from "../../models/captain";
import { findDonorsByTeam } from "../../models/donor";
import { findFoodDrivesByTeam } from "../../models/foodDrives";

const { accessTokenSecret, local } = process.env;
const TOKEN_EXPIRY_TIME = 8 * 60 * 60; // 8hr in seconds
const DEFAULT_AREA_CODE = "1";

export const getLoggedInLogic = async (userId: string): Promise<ILogicResponse | IErrorResponse> => {
    const captain: ICaptain | undefined = await getCaptain(userId);

    if (captain === undefined){
        return authenticationFailedError();
    }

    const response: ILogicResponse = {
        responseBody: captain,
        statusCode: 200,
    };
    return response;
};

export const logoutLogic = async (): Promise<ILogicResponse | IErrorResponse> => {
    const cookies: ICookie[] = [
        {
            name: "id_token",
            val: null,
            options: {}
        },
    ];

    const response: ILogicResponse = {
        cookies,
        statusCode: 200,
    };
    return response;
}

export const getTokenLogic = async (email: string, phoneNumber: string, hostname: string): Promise<ILogicResponse | IErrorResponse> => {
    // check if valid user
    const matchingUser: ICaptain | undefined = await findCaptainByEmail(email);

    // if no user is found, send auth error
    if (matchingUser === undefined) {
        return authenticationFailedError();
    }

    // if real user doesn't have a matching phone number, send auth error
    if (matchingUser.phoneNumber !== phoneNumber) {
        return authenticationFailedError();
    }

    // generate access token
    const accessToken = jwt.sign({
        userId: matchingUser.userId,
        neighbourhoods: matchingUser.neighbourhoods,
        team: matchingUser.team,
        role: "captain",
    }, accessTokenSecret, { expiresIn: TOKEN_EXPIRY_TIME });

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
        responseBody: matchingUser,
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

export const neighbourhoodVolunteersLogic = async (neighbourhood: string): Promise<ILogicResponse> => {
    const volunteers = await find("Contacts", `FIND('${neighbourhood}', neighbourhood)>0`, ["First Name", "Last Name", "Email", "Phone Number", "Vehicle Access", "Waiver", "captainsNotes"], [], "Volunteers");
    if (volunteers === undefined) {
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: volunteers },
        statusCode: 200,
    };
    return response;
};

export const neighbourhoodDonorsLogic = async (neighbourhood: string): Promise<ILogicResponse> => {
    const donors = await find("Donations", `AND(FIND('${neighbourhood}', neighbourhood_id)>0, food_drive="It'll just be me")`, ["address", "postal code", "pickup notes"], [], "");
    if (donors === undefined) {
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: donors },
        statusCode: 200,
    };
    return response;
};


export const teamFoodDrivesLogic = async (team: string): Promise<ILogicResponse> => {
    const foodDrives = await findFoodDrivesByTeam(team);
    const response: ILogicResponse = {
        responseBody: { message: foodDrives },
        statusCode: 200,
    };
    return response;
};

export const teamDonorsLogic = async (team: string): Promise<ILogicResponse> => {
    const donors = await findDonorsByTeam(team);
    const response: ILogicResponse = {
        responseBody: { message: donors },
        statusCode: 200,
    };
    return response;
};

export const neighbourhoodDrivesLogic = async (neighbourhood: string): Promise<ILogicResponse> => {
    const drives = await find("Donations", `AND(FIND('${neighbourhood}', neighbourhood_id)>0, food_drive="I'll be running a larger food drive")`, ["email", "first name", "address", "postal code", "pickup notes"], [], "");
    if (drives === undefined) {
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: drives },
        statusCode: 200,
    };
    return response;
};

export const updateVolunteerNotesLogic = async (captainNeighborhood: string[], userId: string, fields: IUpdateFields): Promise<ILogicResponse> => {
    const vol: any = await read("contacts", userId);

    // if captain requesting the change isn't the vol's assigned neighboorhood captain, then send auth eror
    if (!(vol.neighbourhood[0] === captainNeighborhood)) {
        return authenticationFailedError();
    }

    const updatedVol = await update("Contacts", [
        {
            "id": userId,
            "fields": fields
        }
    ]);
    if (updatedVol === undefined) {
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: updatedVol },
        statusCode: 200,
    };
    return response;
};