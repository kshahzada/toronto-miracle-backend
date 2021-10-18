import express from "express";
import jwt from 'express-jwt';
import { ICookie } from "../types/types";

const { accessTokenSecret } = process.env;

export const auth = express.Router();


auth.use("/v1/resources/captains/:captainId", jwt({
    secret: accessTokenSecret,
    algorithms: ['HS256'],
    getToken: req => req.cookies.id_token,
}, (req, res, next) => {
    const { captainId } = req.params;
    const { userId } = req.user;

    if (userId !== captainId) {
        res.status(401).json({ error: "invalid token" });
        return res.end();
    }

    next();
}));

auth.use("/v1/resources/loggedin", jwt({
    secret: accessTokenSecret,
    algorithms: ['HS256'],
    getToken: req => req.cookies.id_token,
}));


// catch all invalid tokens as auth errors
auth.use((err, req, res, next) => {
    console.log(req.cookies)
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "invalid token" });
        return res.end();
    };
    next();
});