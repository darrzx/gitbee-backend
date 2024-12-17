import express from "express";
import SccProjectHandler from "api/handlers/project/scc/sccProjectHandler";

const sccProjectRoutes = express.Router();

sccProjectRoutes.get("/dashboard", SccProjectHandler.getAllProject);

export default sccProjectRoutes;