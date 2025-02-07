"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hopProjectHandler_1 = __importDefault(require("../../../../api/handlers/project/hop/hopProjectHandler"));
const hopProjectRoutes = express_1.default.Router();
hopProjectRoutes.get("/dashboard", hopProjectHandler_1.default.getHoPDashboard);
exports.default = hopProjectRoutes;
