import express from "express";
import authRoutes from "./auth/authRoutes";
import semesterRoutes from "./semester/semesterRoutes";
import projectRoutes from "./project/projectRoutes";
import statusRoutes from "./status/statusRoutes";
import categoryRoutes from "./category/categoryRoutes";
import technologyRoutes from "./technology/technologyRoutes";
import majorRoutes from "./major/majorRoutes";
import userRoutes from "./user/userRoutes";
import groupRoutes from "./group/groupRoutes";
const routes = express.Router();

routes.use((req, res, next) => {
  next();
});

routes.get("/", (req, res) => {
  res.send("Welcome to GitBee");
});

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/semester", semesterRoutes);
routes.use("/project", projectRoutes);
routes.use("/status", statusRoutes);
routes.use("/category", categoryRoutes);
routes.use("/technology", technologyRoutes);
routes.use("/major", majorRoutes);
routes.use("/group", groupRoutes);

export default routes;
