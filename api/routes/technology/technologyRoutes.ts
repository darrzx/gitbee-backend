import express from "express";
import TechnologyHandler from "api/handlers/technology/technologyHandler";

const technologyRoutes = express.Router();

technologyRoutes.get("/all", TechnologyHandler.getAllTechnology);
technologyRoutes.get("/data", TechnologyHandler.getTechnology);
technologyRoutes.post("/insert", TechnologyHandler.insertTechnology);

export default technologyRoutes;