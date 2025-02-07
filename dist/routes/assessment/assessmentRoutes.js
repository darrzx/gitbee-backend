"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assessmentHandler_1 = __importDefault(require("../../../api/handlers/assessment/assessmentHandler"));
const assessmentRoutes = express_1.default.Router();
assessmentRoutes.post("/insert", assessmentHandler_1.default.insertAssessment);
exports.default = assessmentRoutes;
