import { CookieOptions } from 'express';

// Use Omit to exclude one or more fields (use "excludePlease"|"field2"|"field3" etc to exclude multiple)

export interface ILogicResponse {
    responseBody?: object;
    // redirectURL?: string;
    statusCode: number;
    cookies?: ICookie[];
}

export interface ICookie {
    name: string;
    val: any;
    options: CookieOptions;
}

export interface IUpdateAirtableData {
    id: string;
    fields: IUpdateFields;
}

export interface IUpdateFields {
    captainsNotes?: string;
}

export interface ICaptain {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    team: string;
    neighbourhoods: string[];
}

export interface IVolunteer {
    userId: string;
    email: string;
    name: string;
    number: string;
    vehicleAccess: boolean;
    waiver: boolean;
    notes: string;
    team: string;
    neighbourhood: string;
}

export interface IDonor {
    userId: string;
    address: string;
    notes: string;
    team: string;
    neighbourhood: string;
}

export interface IFoodDrive {
    userId: string;
    email: string;
    name: string;
    address: string;
    notes: string;
    foodDrive: string;
    team: string;
    neighbourhood: string;
}