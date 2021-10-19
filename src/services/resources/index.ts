import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import compression from "compression";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import serverless from "serverless-http";

import { prettify } from "../../middlewares/prettify";
import { router } from "./routes";
import { auth } from "../../middlewares/auth";
import { swaggerDoc } from "../../openAPIs/swagger";
import swaggerUi from "swagger-ui-express";

const { local } = process.env;

export const service = express();

service.use(morgan("combined"));
service.use(bodyParser.json({ limit: "50mb" }));
service.use(cookieParser());
service.use(cors({
    origin: local ? "*" : "/\.torontomiracle\.org$/",
}));

service.use(compression());
service.use(prettify({ query: "pretty" }));

service.use(auth);

service.use("/docs", swaggerUi.serveWithOptions({ redirect: false }), swaggerUi.setup(swaggerDoc));
service.use(router);

service.use(function (err, req, res, next) {
    res.end(err.message); // this catches the error!!
});

export const handler = serverless(service);
