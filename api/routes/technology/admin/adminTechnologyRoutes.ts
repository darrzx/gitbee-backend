import express from "express";
import AdminCategoryHandler from "api/handlers/category/admin/adminCategoryHandler";
import AdminTechnologyHandler from "api/handlers/technology/admin/adminTechnologyHandler";

const adminTechnologyRoutes = express.Router();

adminTechnologyRoutes.post("/insert", AdminTechnologyHandler.insertTechnology);
adminTechnologyRoutes.patch("/update", AdminTechnologyHandler.updateTechnology);

export default adminTechnologyRoutes;