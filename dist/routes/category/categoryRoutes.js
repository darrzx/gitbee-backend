"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryHandler_1 = __importDefault(require("../../../api/handlers/category/categoryHandler"));
const adminCategoryRoutes_1 = __importDefault(require("./admin/adminCategoryRoutes"));
const categoryRoutes = express_1.default.Router();
categoryRoutes.get("/all", categoryHandler_1.default.getAllCategory);
categoryRoutes.use("/admin", adminCategoryRoutes_1.default);
exports.default = categoryRoutes;
