"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentGroupHandler_1 = __importDefault(require("../../../../api/handlers/group/student/studentGroupHandler"));
const studentGroupRoutes = express_1.default.Router();
studentGroupRoutes.post("/insert", studentGroupHandler_1.default.insertTemporaryGroup);
studentGroupRoutes.get("/current", studentGroupHandler_1.default.getCurrentStudentGroup);
exports.default = studentGroupRoutes;
