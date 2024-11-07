import express from "express";
import HopOutstandingProjectHandler from "api/handlers/outstandingProject/hop/hopOutstandingPorjectHandler";

const hopOutstandingProjectRoutes = express.Router();

hopOutstandingProjectRoutes.post("/insert", HopOutstandingProjectHandler.insertOutstandingProject);
hopOutstandingProjectRoutes.patch("/remove", HopOutstandingProjectHandler.removeOutstandingProject);

export default hopOutstandingProjectRoutes;