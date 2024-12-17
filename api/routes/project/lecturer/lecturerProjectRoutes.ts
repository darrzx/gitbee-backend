import express from "express";
import LecturerProjectHandler from "api/handlers/project/lecturer/lecturerProjectHandler";

const lecturerProjectRoutes = express.Router();

lecturerProjectRoutes.get("/class", LecturerProjectHandler.getAllClassProject);
lecturerProjectRoutes.get("/all-reviewed", LecturerProjectHandler.getAllReviewedProject);

export default lecturerProjectRoutes;