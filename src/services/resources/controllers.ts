import Joi from "@hapi/joi";
import { Request, Response } from "express";
import { badRequestError } from "../../errors";
import { ILogicResponse } from "../../types/types";
import { IErrorResponse } from "../../types/errors";
import { healthCheckLogic, captainVolunteersLogic, neighbourhoodVolunteersLogic, getTokenLogic, getLoggedInLogic } from "./logic";

const sendResponse = (expressRes: Response, logicResponse: ILogicResponse | IErrorResponse) => {
    const { statusCode, responseBody } = logicResponse;

    if( "cookies" in logicResponse && logicResponse.cookies !== undefined ){
        logicResponse.cookies.forEach((cookie) => {
            expressRes.cookie(cookie.name, cookie.val, cookie.options);
        })
    }

    return expressRes.status(statusCode).json(responseBody);
};

export const getLoggedIn = async (req: Request, res: Response) => {
    const { userId } = req.user;
    const response = await getLoggedInLogic(userId);
    return sendResponse(res, response);
};

export const authenticate = async (req: Request, res: Response) => {

    // define schema shapes
    const paramSchema = Joi.object({
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(9).max(10).required(),
    });

    // destructure request
    const { body } = req;

    // test request shape
    const { value: parsedBody, error: schemaError } = paramSchema.validate(body);

    // if there is a schema issue, respond with 400
    if(schemaError){
        const response = badRequestError(schemaError);
        return sendResponse(res, response);
    }

    // otherwise complete request
    const { email, phoneNumber } = parsedBody;
    const response = await getTokenLogic(email, phoneNumber, req.hostname);
    return sendResponse(res, response);
};

export const healthCheck = async (req: Request, res: Response) => {
    const response = await healthCheckLogic();
    return sendResponse(res, response);
};

export const captainVolunteers = async (req: Request, res: Response) => {
    // define schema shapes
    const paramSchema = Joi.object({
        captain_id: Joi.string().token().length(17).required(),
    });

    // destructure request
    const { params } = req;

    // test request shape
    const { value: parsedParams, error: schemaError } = paramSchema.validate(params);

    // if there is a schema issue, respond with 400
    if(schemaError){
        const response = badRequestError(schemaError);
        return sendResponse(res, response);
    }

    // otherwise complete request
    const { captain_id } = parsedParams;
    const response = await captainVolunteersLogic(captain_id);
    return sendResponse(res, response);
};

export const neighbourhoodVolunteers = async (req: Request, res: Response) => {
    // define schema shapes
    const paramSchema = Joi.object({
        neighbourhood: Joi.string().token().length(17).required(),
    });

    // destructure request
    const { params } = req;

    // test request shape
    const { value: parsedParams, error: schemaError } = paramSchema.validate(params);

    // if there is a schema issue, respond with 400
    if(schemaError){
        const response = badRequestError(schemaError);
        return sendResponse(res, response);
    }

    // otherwise complete request
    const { neighbourhood } = parsedParams;
    const response = await neighbourhoodVolunteersLogic(neighbourhood);
    return sendResponse(res, response);
};

export const badRequestCatch = async (req: Request, res: Response) => {
    const response = badRequestError(`Endpoint ${req.path} does not exist`);
    return sendResponse(res, response);
};
