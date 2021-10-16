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
