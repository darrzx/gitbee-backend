"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sccProjectHandler_1 = __importDefault(require("../../../../api/handlers/project/scc/sccProjectHandler"));
const sccProjectRoutes = express_1.default.Router();
sccProjectRoutes.get("/dashboard", sccProjectHandler_1.default.getSccDashboard);
exports.default = sccProjectRoutes;
