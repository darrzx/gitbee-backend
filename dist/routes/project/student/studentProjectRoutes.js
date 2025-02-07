"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentProjectHandler_1 = __importDefault(require("../../../../api/handlers/project/student/studentProjectHandler"));
const studentProjectRoutes = express_1.default.Router();
studentProjectRoutes.get("/history", studentProjectHandler_1.default.getStudentClassProject);
studentProjectRoutes.get("/all", studentProjectHandler_1.default.getAllStudentProfileProject);
exports.default = studentProjectRoutes;
