
import { find, read } from "../integrations/airtable";
import { IDonor } from "../types/types";
import Joi from "@hapi/joi";

const donorDBSchema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    "first name": Joi.string().required(),
    "address": Joi.string().required(),
    "postal code": Joi.string().required(),
    "pickup notes": Joi.string().required(),
    "food_drive": Joi.string().required(),
    team: Joi.array().items(Joi.string()).required(),
    neighbourhood: Joi.array().items(Joi.string()).required(),
});

const donorFields = [
    "id", "email", "first name", "address", "pickup notes", "food_drive", "team", "neighbourhood",
];

const transformFromDBToDonorModel = (inputDonor: any) : IDonor => {
    const { value: rawDonor, error } = donorDBSchema.validate(inputDonor);
    if (error !== undefined){
        throw new Error(error);
    }

    const address = rawDonor["postal code"] ? `${rawDonor["address"]} ${rawDonor["postal code"]}` : rawDonor["address"];

    if(rawDonor.team.length !== 1){
        throw new Error(`Donor is missing a team: ${{donor: rawDonor}}`);
    }
    if(rawDonor.neighboorhood.length !== 1){
        throw new Error(`Donor is missing a neighbourhood: ${{donor: rawDonor}}`);
    }

    return {
        userId: rawDonor.id,
        address: address,
        notes: rawDonor["pickup notes"],
        team: rawDonor.team[0],
        neighbourhood: rawDonor.neighbourhood[0],
    };
}

export const findDonorsByTeam = async (team: string): Promise<IDonor[]> => {
    const rawDonations = await find("Donations", 
    `AND(FIND('${team}', team)>0)`,
    donorFields, [], "Donors");

    const donations = rawDonations.map(rawDonation => transformFromDBToDonorModel(rawDonation))
    return donations;
}

