
import { NextFunction, Request, Response } from "express";

import { IOptions } from "../types/prettify";

export const prettify = (option: IOptions) => {
    option = option || {};
    const always = option.always || false;
    const query = option.query;
    const spaces = option.spaces || 2;

    return (req: Request, res: Response, next: NextFunction) => {
        if (always === true || (query && typeof req.query[query] !== "undefined")) {
            // tslint:disable-next-line: no-any
            res.json = (body: any): Response => {
                if (!res.get("Content-Type")) {
                    res.set("Content-Type", "application/json");
                }
                res.send(JSON.stringify(body, null, spaces));
                return res;
            };
        }
        next();
    };
};
