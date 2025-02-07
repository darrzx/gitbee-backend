"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentClassHandler_1 = __importDefault(require("../../../../api/handlers/class/student/studentClassHandler"));
const studentClassRoutes = express_1.default.Router();
studentClassRoutes.get("/transaction", studentClassHandler_1.default.studentClassTransaction);
studentClassRoutes.get("/list", studentClassHandler_1.default.studentListInClass);
exports.default = studentClassRoutes;
