
import { find } from "../integrations/airtable";
import { IDonor } from "../types/types";
import Joi from "@hapi/joi";

const donorDBSchema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    "first name": Joi.string().required(),
    "address line": Joi.string().required(),
    "pickup notes": Joi.string(),
    "food_drive": Joi.string().required(),
    team: Joi.array().items(Joi.string()).required(),
    neighbourhood: Joi.array().items(Joi.string()).required(),
});

const donorFields = [
    "email", "first name", "address line", "pickup notes", "food_drive", "team", "neighbourhood",
];

const transformFromDBToDonorModel = (inputDonor: any) : IDonor => {
    const { value: rawDonor, error } = donorDBSchema.validate(inputDonor);
    if (error !== undefined){
        throw new Error(error);
    }

    if(rawDonor.team.length !== 1){
        throw new Error(`Donor is missing a team: ${{donor: rawDonor}}`);
    }
    if(rawDonor.neighbourhood.length !== 1){
        throw new Error(`Donor is missing a neighbourhood: ${{donor: rawDonor}}`);
    }

    return {
        userId: rawDonor.id,
        address: rawDonor["address line"],
        notes: rawDonor["pickup notes"],
        team: rawDonor.team[0],
        neighbourhood: rawDonor.neighbourhood[0],
    };
}

export const findDonorsByTeam = async (team: string): Promise<IDonor[]> => {
    const rawDonations = await find("Donations", 
    `AND(FIND('${team}', team_id)>0, food_drive="It'll just be me")`,
    donorFields, [], "Donors");

    const donations = rawDonations.map(rawDonation => {
        return transformFromDBToDonorModel(rawDonation);
    })
    return donations;
}

