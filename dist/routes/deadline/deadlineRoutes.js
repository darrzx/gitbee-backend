"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deadlineHandler_1 = __importDefault(require("../../../api/handlers/deadline/deadlineHandler"));
const express_1 = __importDefault(require("express"));
const deadlineRoutes = express_1.default.Router();
deadlineRoutes.get("/check", deadlineHandler_1.default.checkDeadline);
exports.default = deadlineRoutes;
