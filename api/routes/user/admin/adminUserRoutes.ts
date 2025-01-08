import express from "express";
import AdminUserHandler from "api/handlers/user/admin/adminUserHandler";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const adminUserRoutes = express.Router();

adminUserRoutes.get("/get-user", AdminUserHandler.getUser);
adminUserRoutes.post("/insert-user", AdminUserHandler.insertUser);
adminUserRoutes.patch("/update-role", AdminUserHandler.updateRole);
adminUserRoutes.post("/upload-user-excel", upload.single("file"), AdminUserHandler.uploadUserExcel);
adminUserRoutes.patch("/remove-user-excel", AdminUserHandler.removeUserExcel);

adminUserRoutes.post("/upload-transaction-excel", upload.single("file"), AdminUserHandler.uploadTransactionExcel);
adminUserRoutes.patch("/remove-transaction-excel", AdminUserHandler.removeTransactionExcel);

export default adminUserRoutes;