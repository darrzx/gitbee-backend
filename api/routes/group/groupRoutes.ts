import express from "express";
import studentGroupRoutes from "./student/studentGroupRoutes";

const groupRoutes = express.Router();

groupRoutes.use("/student", studentGroupRoutes);

export default groupRoutes;