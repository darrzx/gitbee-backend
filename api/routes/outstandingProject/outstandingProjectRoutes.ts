import express from "express";
import hopOutstandingProjectRoutes from "./hop/hopOutstandingProjectRoutes";

const outstandingProjectRoutes = express.Router();

outstandingProjectRoutes.use("/hop", hopOutstandingProjectRoutes);

export default outstandingProjectRoutes;