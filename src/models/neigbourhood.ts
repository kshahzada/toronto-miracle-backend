
import { find } from "../integrations/airtable";
import { INeighbourhood } from "../types/types";
import Joi from "@hapi/joi";

const neighourhoodDBSchema = Joi.object({
    id: Joi.string().required(),
    Name: Joi.string().required(),
    Captains: Joi.string().required(),
    "Number of Assigned Teams": Joi.number().required(),
    "Number of Volunteers": Joi.number().required(),
    "Number of Donations": Joi.number().required(),
    "Assigned Hub": Joi.array().items(Joi.string()).required(),
});

const neighbourhoodFields = [
    "Name", "Captains", "Number of Assigned Teams", "Number of Volunteers", "Number of Donations", "Assigned Hub",
];

const transformFromDBToNeigbourhoodModel = (inputNeighbourhood: any): INeighbourhood => {
    const { value: rawNeighbourhood, error } = neighourhoodDBSchema.validate(inputNeighbourhood);
    if (error !== undefined) {
        throw new Error(error);
    }

    if (rawNeighbourhood["Assigned Hub"] === "") {
        throw new Error(`Neighbourhood is missing a hub: ${{ neighbourhood: rawNeighbourhood }}`);
    }

    return {
        neighbourhoodId: rawNeighbourhood.id,
        name: rawNeighbourhood.Name,
        captains: rawNeighbourhood.Captains,
        numTeams: rawNeighbourhood["Number of Assigned Teams"],
        numVols: rawNeighbourhood["Number of Volunteers"],
        numDonations: rawNeighbourhood["Number of Donations"],
        hub: rawNeighbourhood["Assigned Hub"][0],
    };
}

export const findNeighbourhoodsByTeam = async (team: string): Promise<INeighbourhood[]> => {
    const neighbourhoods = await find("Neighbourhoods",
        `FIND('${team}', team_id)>0`,
        neighbourhoodFields, [], "Summary");

    const foodDrives = neighbourhoods.map(rawNeighbourhood => transformFromDBToNeigbourhoodModel(rawNeighbourhood));
    return foodDrives;
}