"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semesterHandler_1 = __importDefault(require("../../../api/handlers/semester/semesterHandler"));
const semesterRoutes = express_1.default.Router();
semesterRoutes.get("/all", semesterHandler_1.default.getAllSemester);
semesterRoutes.get("/current", semesterHandler_1.default.getCurrentSemester);
exports.default = semesterRoutes;
