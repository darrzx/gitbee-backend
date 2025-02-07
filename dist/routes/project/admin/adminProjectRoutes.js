"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminProjectHandler_1 = __importDefault(require("../../../../api/handlers/project/admin/adminProjectHandler"));
const adminProjectRoutes = express_1.default.Router();
adminProjectRoutes.get("/dashboard", adminProjectHandler_1.default.getAdminDashboard);
adminProjectRoutes.patch("/disable-toggle", adminProjectHandler_1.default.updateDisableToggle);
exports.default = adminProjectRoutes;
