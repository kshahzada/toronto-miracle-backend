import Joi from "@hapi/joi";
import { Request, Response } from "express";
import { badRequestError } from "../../errors";
import { ILogicResponse, IUpdateFields } from "../../types/types";
import { IErrorResponse } from "../../types/errors";
import { 
    healthCheckLogic, 
    neighbourhoodVolunteersLogic, 
    neighbourhoodDonorsLogic,
    neighbourhoodDrivesLogic,
    teamDonorsLogic,
    getTokenLogic, 
    getLoggedInLogic, 
    updateVolunteerNotesLogic, 
    logoutLogic 
} from "./logic";

const { local } = process.env;

const sendResponse = (expressRes: Response, logicResponse: ILogicResponse | IErrorResponse) => {
    const { statusCode, responseBody } = logicResponse;

    if( "cookies" in logicResponse && logicResponse.cookies !== undefined ){
        logicResponse.cookies.forEach((cookie) => {
            if (cookie.val) {
                expressRes.cookie(cookie.name, cookie.val, cookie.options);
            } else {
                expressRes.clearCookie(cookie.name, {
                    ...(local ? {} : { domain: "torontomiracle.org" }), // conditionally set domain if you are not developping locally
                });
            }
        })
    }

    return expressRes.status(statusCode).json(responseBody);
};

export const getLoggedIn = async (req: Request, res: Response) => {
    const { userId } = req.user;
    const response = await getLoggedInLogic(userId);
    return sendResponse(res, response);
};

export const logout = async (req: Request, res: Response) => {
    const response = await logoutLogic();
    return sendResponse(res, response);
};

export const authenticate = async (req: Request, res: Response) => {

    // define schema shapes
    const paramSchema = Joi.object({
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(11).max(12).required(),
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

// TODO:- we need to define what "logic" is as a template otherwise this is a dangerous pattern IMO
const getDataForNeigborhood = async (req: Request, res: Response, logic) => {
    // define schema shapes
    const paramSchema = Joi.object({
        neighbourhood: Joi.string().token().length(17).required(),
    });

    // destructure request
    const { params } = req;

    // test request shape
    const { value: parsedParams, error: schemaError } = paramSchema.validate(params);

    // if there is a schema issue, respond with 400
    if (schemaError) {
        const response = badRequestError(schemaError);
        return sendResponse(res, response);
    }

    // otherwise complete request
    const { neighbourhood } = parsedParams;
    const response = await logic(neighbourhood);
    return sendResponse(res, response);
}

export const teamDonors = async (req: Request, res: Response) => {
    // define schema shapes
    const paramSchema = Joi.object({
        team: Joi.string().token().length(17).required(),
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
    const { team } = parsedParams;
    const response = await teamDonorsLogic(team);
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

export const neighbourhoodDonors = async (req: Request, res: Response) => {
    return await getDataForNeigborhood(req, res, neighbourhoodDonorsLogic);
};

export const neighbourhoodDrives = async (req: Request, res: Response) => {
    return await getDataForNeigborhood(req, res, neighbourhoodDrivesLogic);
};

export const updateVolunteerNotes = async (req: Request, res: Response) => {
    // define schema shapes
    const paramSchema = Joi.object({
        volunteer: Joi.string().required(), // can further validate shape
        neighbourhood: Joi.string().token().length(17).required(),
    });

    const bodySchema = Joi.object({
        fields: Joi.object({
            captainsNotes: Joi.string().allow(""),
        }).required(),
    });

    // destructure request
    const { params, body } = req;

    // test request shape
    const { value: parsedParams, error: paramsSchemaError } = paramSchema.validate(params);
    const { value: parsedBody, error: bodySchemaError } = bodySchema.validate(body);

    // if there is a schema issue, respond with 400
    if (paramsSchemaError) {
        const response = badRequestError(paramsSchemaError);
        return sendResponse(res, response);
    } else if (bodySchemaError) {
        const response = badRequestError(paramsSchemaError);
        return sendResponse(res, response);
    }

    // otherwise complete request
    const { volunteer, neighbourhood } = parsedParams;    
    const fields: IUpdateFields = parsedBody.fields;
    const response = await updateVolunteerNotesLogic(neighbourhood, volunteer, fields);
    return sendResponse(res, response);
};

export const badRequestCatch = async (req: Request, res: Response) => {
    const response = badRequestError(`Endpoint ${req.path} does not exist`);
    return sendResponse(res, response);
};
