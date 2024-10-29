import express from "express";
import LecturerGroupHandler from "api/handlers/group/lecturer/lecturerGroupHandler";

const lecturerGroupRoutes = express.Router();

lecturerGroupRoutes.get("/class-group", LecturerGroupHandler.getClassGroup);
lecturerGroupRoutes.patch("/cancel", LecturerGroupHandler.cancelTemporaryGroup);

export default lecturerGroupRoutes;