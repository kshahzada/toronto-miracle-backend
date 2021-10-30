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
    id: string,
    fields: IUpdateFields
}

export interface IUpdateFields {
    captainsNotes?: string,
}
