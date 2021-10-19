import express from "express";
import jwt from 'express-jwt';
import { ICookie } from "../types/types";

const { accessTokenSecret } = process.env;

export const auth = express.Router();

// any neighbourhood endpoint must have the neighbourhood contained in neighbourhoods field in the JWT
// auth.use("/v1/neighbourhoods/:neighbourhood", jwt({
//     secret: accessTokenSecret,
//     algorithms: ['HS256'],
//     getToken: req => req.cookies.id_token,
// }, (req, res, next) => {
//     const { neighbourhood } = req.params;
//     const { neighbourhoods } = req.user;
//     console.log({neighbourhood})
//     console.log({neighbourhoods})

//     if (neighbourhoods.includes(neighbourhood)) {
//         res.status(401).json({ error: "invalid token" });
//         return res.end();
//     }
//     next();
// }));

// any captain endpoint must have the userid in the JWT equal to the captain_id that is requested
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

auth.use("/v1/auth/me", jwt({
    secret: accessTokenSecret,
    algorithms: ['HS256'],
    getToken: req => req.cookies.id_token,
}));


// catch all invalid tokens as auth errors
auth.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "invalid token" });
        return res.end();
    };
    next();
});