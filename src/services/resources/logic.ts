import { find, read, write } from "../../integrations/airtable";
import { IErrorResponse } from "../../types/errors";
import { ILogicResponse, ICookie } from "../../types/types";
import { resourceNotFoundError } from "../../errors";
import { Order, Pouch, TypeformAnswer } from "../../types/custom";


// export const readPouch = async (pouch_id: string) => {
//     const pouch_details = await read("Pouches", pouch_id);
//     if (pouch_details === undefined){
//         return resourceNotFoundError();
//     }
//     const response: ILogicResponse = {
//         responseBody: { message: pouch_details },
//         statusCode: 200,
//     };
//     return response;
// }

export const healthCheckLogic = async (): Promise<ILogicResponse> => {
    const response: ILogicResponse = {
        responseBody: { message: "v1 - Alive!" },
        statusCode: 200,
    };
    return response;
};

export const volunteersLogic = async (captain_id: string): Promise<ILogicResponse> => {
    // empty filterByFormula for now, replace with captain_id once ready
    const volunteers = await find("Contacts", "", ["First Name", "Last Name", "Email", "Phone Number"] , [], "Volunteers", false);
    if (volunteers === undefined){
        return resourceNotFoundError();
    }
    const response: ILogicResponse = {
        responseBody: { message: volunteers },
        statusCode: 200,
    };
    return response;
};
