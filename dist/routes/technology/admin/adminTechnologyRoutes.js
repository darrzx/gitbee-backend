"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminTechnologyHandler_1 = __importDefault(require("../../../../api/handlers/technology/admin/adminTechnologyHandler"));
const adminTechnologyRoutes = express_1.default.Router();
adminTechnologyRoutes.post("/insert", adminTechnologyHandler_1.default.insertTechnology);
adminTechnologyRoutes.patch("/update", adminTechnologyHandler_1.default.updateTechnology);
exports.default = adminTechnologyRoutes;
