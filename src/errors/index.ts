import { IErrorResponse } from "../types/errors";

export const badRequestError = (error?: string): IErrorResponse => ({
  responseBody: {
    error: {
      message: `Bad Request${error ? ` - ${error}` : ""}`,
    },
  },
  statusCode: 400,
});

export const redisError = (): IErrorResponse => ({
  responseBody: {
    error: {
      message: "Redis Broken",
    },
  },
  statusCode: 500,
});

export const serverError = (error?: string): IErrorResponse => ({
  responseBody: {
    error: {
      message: `Server Error${error ? ` - ${error}` : ""}`,
    },
  },
  statusCode: 500,
});

export const authenticationFailedError = (): IErrorResponse => ({
  responseBody: {
    error: {
      message: "Matching credentials not found",
    },
  },
  statusCode: 401,
});

export const resourceNotFoundError = (): IErrorResponse => ({
  responseBody: {
    error: {
      message: "Resources not found",
    },
  },
  statusCode: 404,
});

export const notImplementedError = (): IErrorResponse => ({
  responseBody: {
    error: {
      message: "Not implemented",
    },
  },
  statusCode: 501,
});
