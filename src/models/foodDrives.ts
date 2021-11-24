
import { find } from "../integrations/airtable";
import { IFoodDrive } from "../types/types";
import Joi from "@hapi/joi";

const foodDriveDBSchema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    "first name": Joi.string().required(),
    "address line": Joi.string().required(),
    "pickup notes": Joi.string(),
    "food_drive": Joi.string().required(),
    team: Joi.array().items(Joi.string()).required(),
    neighbourhood: Joi.array().items(Joi.string()).required(),
});

const foodDriveFields = [
    "email", "first name", "address line", "pickup notes", "food_drive", "team", "neighbourhood",
];

const transformFromDBToFoodDriveModel = (inputFoodDrive: any): IFoodDrive => {
    const { value: rawFoodDrive, error } = foodDriveDBSchema.validate(inputFoodDrive);
    if (error !== undefined) {
        throw new Error(error);
    }

    if (rawFoodDrive.team.length !== 1) {
        throw new Error(`FoodDrive is missing a team: ${{ foodDrive: rawFoodDrive }}`);
    }
    if (rawFoodDrive.neighbourhood.length !== 1) {
        throw new Error(`FoodDrive is missing a neighbourhood: ${{ foodDrive: rawFoodDrive }}`);
    }

    return {
        userId: rawFoodDrive.id,
        email: rawFoodDrive.email,
        name: rawFoodDrive["first name"],
        address: rawFoodDrive["address line"],
        notes: rawFoodDrive["pickup notes"],
        foodDrive: rawFoodDrive.food_drive,
        team: rawFoodDrive.team[0],
        neighbourhood: rawFoodDrive.neighbourhood[0],
    };
}

export const findFoodDrivesByTeam = async (team: string): Promise<IFoodDrive[]> => {
    const rawFoodDrives = await find("Donations",
        `FIND('${team}', team_id)>0`,
        foodDriveFields, [], "Food Drives");
    console.log({ rawFoodDrives})

    const foodDrives = rawFoodDrives.map(rawFoodDrive => transformFromDBToFoodDriveModel(rawFoodDrive));
    return foodDrives;
}

