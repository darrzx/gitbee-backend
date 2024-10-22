import express from "express";
import LecturerGroupHandler from "api/handlers/group/lecturer/lecturerGroupHandler";

const lecturerGroupRoutes = express.Router();

lecturerGroupRoutes.get("/current", LecturerGroupHandler.getStudentGroup);

export default lecturerGroupRoutes;