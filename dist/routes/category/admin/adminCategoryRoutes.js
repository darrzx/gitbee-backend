"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminCategoryHandler_1 = __importDefault(require("../../../../api/handlers/category/admin/adminCategoryHandler"));
const adminCategoryRoutes = express_1.default.Router();
adminCategoryRoutes.post("/insert", adminCategoryHandler_1.default.insertCategory);
adminCategoryRoutes.patch("/update", adminCategoryHandler_1.default.updateCategory);
exports.default = adminCategoryRoutes;
