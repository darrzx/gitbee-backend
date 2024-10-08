import express from "express";
import CategoryHandler from "api/handlers/category/categoryHandler";

const categoryRoutes = express.Router();

categoryRoutes.get("/all", CategoryHandler.getAllCategory);
categoryRoutes.post("/insert", CategoryHandler.insertCategory);

export default categoryRoutes;
