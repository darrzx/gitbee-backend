import express from "express";
import LecturerClassHandler from "api/handlers/class/lecturer/lecturerClassHandler";

const lecturerClassRoutes = express.Router();

lecturerClassRoutes.get("/check-finalize", LecturerClassHandler.checkFinalize);
lecturerClassRoutes.get("/transaction", LecturerClassHandler.lecturerClassTransaction);

export default lecturerClassRoutes;
