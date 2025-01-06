import express from "express";
import AdminUserHandler from "api/handlers/user/admin/adminUserHandler";

const adminUserRoutes = express.Router();

adminUserRoutes.patch("/update-role", AdminUserHandler.updateRole);

export default adminUserRoutes;