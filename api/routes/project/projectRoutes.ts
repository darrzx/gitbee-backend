import express from "express";
import ProjectHandler from "api/handlers/project/projectHandler";

const projectRoutes = express.Router();

projectRoutes.post("/insert", ProjectHandler.insertProject);
projectRoutes.get("/all", ProjectHandler.getAllProject);

export default projectRoutes;