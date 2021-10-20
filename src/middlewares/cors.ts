import { NextFunction, Request, Response } from "express";

const { local } = process.env;

const whitelist = [
    'https://dev-app.torontomiracle.org',
    'https://app.torontomiracle.org',
    ... local ? ['https://editor.swagger.io'] : [],
    ... local ? ['http://localhost:3000'] : [],
];

export const cors = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const origin = req.get('Origin') || "";
        if (whitelist.includes(origin)) {
            res.set('Access-Control-Allow-Credentials', "true");
            res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, id_token");
            res.set('Access-Control-Allow-Origin', origin);
        }
        if ('OPTIONS' === req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };
};