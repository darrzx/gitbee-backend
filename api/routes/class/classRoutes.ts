import express from "express";
import lecturerClassRoutes from "api/routes/class/lecturer/lecturerClassRoutes";

const classRoutes = express.Router();

classRoutes.use("/lecturer", lecturerClassRoutes);

export default classRoutes;