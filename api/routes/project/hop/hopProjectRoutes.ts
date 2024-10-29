import express from "express";
import HopProjectHandler from "api/handlers/project/hop/hopProjectHandler";

const hopProjectRoutes = express.Router();

hopProjectRoutes.get("/class", HopProjectHandler.getAllClassProject);

export default hopProjectRoutes;