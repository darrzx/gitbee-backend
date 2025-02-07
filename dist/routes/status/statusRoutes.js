"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statusHandler_1 = __importDefault(require("../../../api/handlers/status/statusHandler"));
const statusRoutes = express_1.default.Router();
statusRoutes.get("/all", statusHandler_1.default.getAllStatus);
exports.default = statusRoutes;
