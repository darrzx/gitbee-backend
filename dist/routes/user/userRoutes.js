"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userHandler_1 = __importDefault(require("../../../api/handlers/user/userHandler"));
const adminUserRoutes_1 = __importDefault(require("./admin/adminUserRoutes"));
const userRoutes = express_1.default.Router();
userRoutes.get("/get-name", userHandler_1.default.getName);
userRoutes.get("/get-role", userHandler_1.default.getAllRole);
userRoutes.use("/admin", adminUserRoutes_1.default);
exports.default = userRoutes;
