"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecturerClassHandler_1 = __importDefault(require("../../../../api/handlers/class/lecturer/lecturerClassHandler"));
const lecturerClassRoutes = express_1.default.Router();
lecturerClassRoutes.get("/check-finalize", lecturerClassHandler_1.default.checkFinalize);
lecturerClassRoutes.get("/transaction", lecturerClassHandler_1.default.lecturerClassTransaction);
lecturerClassRoutes.get("/list-course", lecturerClassHandler_1.default.lecturerListCourse);
exports.default = lecturerClassRoutes;
