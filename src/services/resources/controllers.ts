import Joi from "@hapi/joi";
import { Request, Response } from "express";
import { badRequestError, serverError } from "../../errors";
import { ILogicResponse } from "../../types/types";
import { IErrorResponse } from "../../types/errors";
import { healthCheckLogic, volunteersLogic } from "./logic";

const sendResponse = (expressRes: Response, logicResponse: ILogicResponse | IErrorResponse) => {
    const { statusCode, responseBody, redirectURL } = logicResponse;
    // if( "cookies" in logicResponse && logicResponse.cookies !== undefined ){
    //     logicResponse.cookies.forEach((cookie) => {
    //         expressRes.cookie(cookie.name, cookie.val, cookie.options);
    //     })
    // }

    if (redirectURL !== undefined){
        return expressRes.status(statusCode).redirect(redirectURL);
    }
    return expressRes.status(statusCode).json(responseBody);
};

// export const getPouchRedirectToRoaster = async (req: Request, res: Response) => {
//     const { pouch_id } = req.params;

//     if(pouch_id === undefined){
//         const response = serverError("Pouch_ID is required");
//         return sendResponse(res, response);
//     }

//     try {
//         const response = await redirectToRoaster(pouch_id);
//         return sendResponse(res, response);
//     } catch (err) {
//         console.log(err);

//         const response = serverError(err);
//         return sendResponse(res, response);
//     }
// };

export const healthCheck = async (req: Request, res: Response) => {
    const response = await healthCheckLogic();
    return sendResponse(res, response);
};

export const volunteers = async (req: Request, res: Response) => {
    const { captain_id } = req.params;

    if(captain_id === undefined){
        const response = serverError("Captain_ID is required");
        return sendResponse(res, response);
    }

    const response = await volunteersLogic(captain_id);
    return sendResponse(res, response);
};

export const badRequestCatch = async (req: Request, res: Response) => {
    const response = badRequestError(`Endpoint ${req.path} does not exist`);
    return sendResponse(res, response);
};
