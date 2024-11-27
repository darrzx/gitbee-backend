import express from "express";
import StudentProjectHandler from "api/handlers/project/student/studentProjectHandler";

const studentProjectRoutes = express.Router();

studentProjectRoutes.get("/history", StudentProjectHandler.getStudentClassProject);
studentProjectRoutes.get("/all", StudentProjectHandler.getAllStudentProject);

export default studentProjectRoutes;