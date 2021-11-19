
import { find } from "../integrations/airtable";
import { IVolunteer } from "../types/types";
import Joi from "@hapi/joi";

const volunteerDBSchema = Joi.object({
    id: Joi.string().required(),
    Email: Joi.string().required(),
    "First Name": Joi.string().required(),
    "Last Name": Joi.string().required(),
    "Phone Number": Joi.string().required(),
    Waiver: Joi.boolean(),
    "Vehicle Access": Joi.number().required(),
    notes: Joi.string(),
    team: Joi.array().items(Joi.string()).required(),
    neighbourhood: Joi.array().items(Joi.string()).required(),
});


const volunteerFields = [
    "Email", "First Name", "Last Name", "Phone Number", "Vehicle Access", "Waiver", "notes", "team", "neighbourhood",
];

const transformFromDBToVolunteerModel = (inputVolunteer: any) : IVolunteer => {
    const { value: rawVolunteer, error } = volunteerDBSchema.validate(inputVolunteer);
    if (error !== undefined){
        throw new Error(error);
    }

    if(rawVolunteer.team.length !== 1){
        throw new Error(`Volunteer is missing a team: ${{volunteer: rawVolunteer}}`);
    }
    if(rawVolunteer.neighbourhood.length !== 1){
        throw new Error(`Volunteer is missing a neighbourhood: ${{volunteer: rawVolunteer}}`);
    }

    return {
        userId: rawVolunteer.id,
        email: rawVolunteer.Email,
        name: rawVolunteer["First Name"].concat(" ", rawVolunteer["Last Name"]),
        number: rawVolunteer["Phone Number"],
        vehicleAccess: rawVolunteer["Vehicle Access"],
        waiver: rawVolunteer.Waiver,
        notes: rawVolunteer.notes,
        team: rawVolunteer.team[0],
        neighbourhood: rawVolunteer.neighbourhood[0],
    };
}

export const findVolunteersByTeam = async (team: string): Promise<IVolunteer[]> => {
    const rawVolunteers = await find("Volunteers", 
    `FIND('${team}', team_id)>0`,
    volunteerFields, [], "Grid view");

    const volunteers = rawVolunteers.map(rawVolunteer => {
        console.log(rawVolunteer)
        return transformFromDBToVolunteerModel(rawVolunteer);
    })
    return volunteers;
}