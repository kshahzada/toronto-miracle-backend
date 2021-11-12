
import { find, read, update } from "../integrations/airtable";
import { ICaptain } from "../types/types";
import Joi from "@hapi/joi";

const DEFAULT_AREA_CODE = "1";

const captainDBSchema = Joi.object({
    id: Joi.string().required(),
    Email: Joi.string().required(),
    "First Name": Joi.string().required(),
    "Last Name": Joi.string().required(),
    "Phone Number": Joi.string().required(),
    team: Joi.array().items(Joi.string()).required(),
    neighbourhoods: Joi.array().items(Joi.string()).required(),
});

const captainFields = [
    "Email", "First Name", "Last Name", "Phone Number", "team", "neighbourhoods",
];

const transformFromDBToModel = async (inputCaptain: any) => {
    const rawCaptain = await captainDBSchema.validateAsync(inputCaptain);
    const phoneNumber = rawCaptain["Phone Number"].replace(/\D/g,'');
    if(rawCaptain.team.length !== 1){
        throw new Error(`Captain is missing a team: ${{captain: rawCaptain}}`);
    }

    return {
        userId: rawCaptain.id,
        email: rawCaptain.email,
        firstName: rawCaptain["First Name"],
        lastName: rawCaptain["Last Name"],
        phoneNumber: phoneNumber.length < 11 ? DEFAULT_AREA_CODE + phoneNumber : phoneNumber,
        team: rawCaptain.team[0],
        neighbourhoods: rawCaptain.neighbourhoods,
    };
}

export const findCaptainByEmail = async (email: string): Promise<ICaptain | undefined> => {
    const cleanedEmail = email.toLowerCase();
    const results = await find("Captains",
        `email=\'${cleanedEmail}\'`,
        captainFields,
    );

    if (results.length === 0) {
        return;
    }

    if (results.length > 1) {
        throw new Error(`Multiple matches in findCaptainByEmail: ${cleanedEmail}`);
    }

    return transformFromDBToModel(results[0]);
}

export const getCaptain = async (userId: string): Promise<ICaptain | undefined> => {
    const rawCaptain: any = await read("Captains", userId, captainFields);
    return transformFromDBToModel(rawCaptain);
}

