"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerProjectHandler_1 = __importDefault(require("../../../../api/handlers/project/lecturer/lecturerProjectHandler"));
const lecturerProjectRoutes = express_1.default.Router();
lecturerProjectRoutes.get("/class", lecturerProjectHandler_1.default.getAllLecturerClassProject);
lecturerProjectRoutes.get("/all-reviewed", lecturerProjectHandler_1.default.getAllLecturerGoodProject);
exports.default = lecturerProjectRoutes;
