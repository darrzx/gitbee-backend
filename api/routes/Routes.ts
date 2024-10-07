import express from "express";
import authRoutes from "./auth/authRoutes";
import semesterRoutes from "./semester/semesterRoutes";
import projectRoutes from "./project/projectRoutes";
const routes = express.Router();

routes.use((req, res, next) => {
  next();
});

routes.get("/", (req, res) => {
  res.send("Welcome to GitBee");
});

routes.use("/auth", authRoutes);
routes.use("/semester", semesterRoutes);
routes.use("/project", projectRoutes);

export default routes;
