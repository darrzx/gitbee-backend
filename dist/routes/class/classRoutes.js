"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerClassRoutes_1 = __importDefault(require("api/routes/class/lecturer/lecturerClassRoutes"));
const studentClassRoutes_1 = __importDefault(require("./student/studentClassRoutes"));
const classRoutes = express_1.default.Router();
classRoutes.use("/lecturer", lecturerClassRoutes_1.default);
classRoutes.use("/student", studentClassRoutes_1.default);
exports.default = classRoutes;
