import express from "express";
import authRoutes from "./auth/authRoutes";
import semesterRoutes from "./semester/semesterRoutes";
const routes = express.Router();

routes.use((req, res, next) => {
  next();
});

routes.get("/", (req, res) => {
  res.send("Welcome to GitBee");
});

routes.use("/auth", authRoutes);
routes.use("/semester", semesterRoutes);

export default routes;
