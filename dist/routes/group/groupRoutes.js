"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentGroupRoutes_1 = __importDefault(require("./student/studentGroupRoutes"));
const lecturerGroupRoutes_1 = __importDefault(require("./lecturer/lecturerGroupRoutes"));
const groupRoutes = express_1.default.Router();
groupRoutes.use("/student", studentGroupRoutes_1.default);
groupRoutes.use("/lecturer", lecturerGroupRoutes_1.default);
exports.default = groupRoutes;
