import express from "express";
import AdminUserHandler from "api/handlers/user/admin/adminUserHandler";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const adminUserRoutes = express.Router();

adminUserRoutes.get("/get-user", AdminUserHandler.getUser);

adminUserRoutes.post("/insert-user", AdminUserHandler.insertUser);
adminUserRoutes.patch("/update-role", AdminUserHandler.updateRole);
adminUserRoutes.post("/upload-excel", upload.single("file"), AdminUserHandler.uploadExcel);
adminUserRoutes.patch("/remove-data-excel", AdminUserHandler.removeDataExcel);

export default adminUserRoutes;