
import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";
import express from "express";
import path from "path";

// const swaggerDoc = YAML.load(path.join(__dirname, './swagger.yaml')); loading the yaml isn't working for some reason so we need to use a js file
import { swaggerDoc } from "./swagger";

export const openAPIDocs = express.Router();
openAPIDocs.use('/docs', swaggerUi.serveWithOptions({ redirect: false }));
openAPIDocs.get('/docs', swaggerUi.setup(swaggerDoc));

