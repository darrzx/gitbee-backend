import express from "express";
import ProjectHandler from "api/handlers/project/projectHandler";

const projectRoutes = express.Router();

projectRoutes.post("/insert", ProjectHandler.insertProject);

export default projectRoutes;