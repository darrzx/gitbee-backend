import express from "express";
import ProjectHandler from "api/handlers/project/projectHandler";
import hopProjectRoutes from "./hop/hopProjectRoutes";
import lecturerProjectRoutes from "./lecturer/lecturerProjectRoutes";

const projectRoutes = express.Router();

projectRoutes.post("/insert", ProjectHandler.insertProject);
projectRoutes.get("/all", ProjectHandler.getAllProject);
projectRoutes.get("/detail", ProjectHandler.getDetailProject);

projectRoutes.use("/hop", hopProjectRoutes);
projectRoutes.use("/lecturer", lecturerProjectRoutes);

export default projectRoutes;