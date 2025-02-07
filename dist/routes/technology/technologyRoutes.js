"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const technologyHandler_1 = __importDefault(require("../../../api/handlers/technology/technologyHandler"));
const adminTechnologyRoutes_1 = __importDefault(require("./admin/adminTechnologyRoutes"));
const technologyRoutes = express_1.default.Router();
technologyRoutes.get("/all", technologyHandler_1.default.getAllTechnology);
technologyRoutes.get("/data", technologyHandler_1.default.getTechnology);
technologyRoutes.use("/admin", adminTechnologyRoutes_1.default);
exports.default = technologyRoutes;
