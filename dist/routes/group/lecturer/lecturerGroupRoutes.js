"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerGroupHandler_1 = __importDefault(require("../../../../api/handlers/group/lecturer/lecturerGroupHandler"));
const lecturerGroupRoutes = express_1.default.Router();
lecturerGroupRoutes.get("/class-group", lecturerGroupHandler_1.default.getClassGroup);
lecturerGroupRoutes.get("/class-list", lecturerGroupHandler_1.default.getClassList);
lecturerGroupRoutes.patch("/remove", lecturerGroupHandler_1.default.removeTemporaryGroup);
exports.default = lecturerGroupRoutes;
