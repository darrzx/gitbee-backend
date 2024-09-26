import express from "express";
import SemesterHandler from "@/handlers/semester/semesterHandler";

const semesterRoutes = express.Router();

semesterRoutes.get("/all", SemesterHandler.getAllSemester);
semesterRoutes.get("/current", SemesterHandler.getCurrentSemester);

export default semesterRoutes;
