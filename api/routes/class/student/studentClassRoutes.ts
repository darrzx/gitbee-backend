import express from "express";
import StudentClassHandler from "api/handlers/class/student/studentClassHandler";

const studentClassRoutes = express.Router();

studentClassRoutes.get("/transaction", StudentClassHandler.checkFinalize);

export default studentClassRoutes;
