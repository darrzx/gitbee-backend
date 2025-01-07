import express from "express";
import AdminUserHandler from "api/handlers/user/admin/adminUserHandler";

const adminUserRoutes = express.Router();

adminUserRoutes.get("/get-scc-hop", AdminUserHandler.getSccHop);

adminUserRoutes.post("/insert-user", AdminUserHandler.insertUser);
adminUserRoutes.patch("/update-role", AdminUserHandler.updateRole);

export default adminUserRoutes;