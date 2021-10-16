export interface IErrorResponse {
    statusCode: number;
    responseBody: {
        error: {
            message: string;
        };
    };
}
