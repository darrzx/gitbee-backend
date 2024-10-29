import express from "express";
import HopOutstandingProjectHandler from "api/handlers/outstandingProject/hop/hopOutstandingPorjectHandler";

const hopOutstandingProjectRoutes = express.Router();

hopOutstandingProjectRoutes.post("/insert", HopOutstandingProjectHandler.insertOutstandingProject);

export default hopOutstandingProjectRoutes;