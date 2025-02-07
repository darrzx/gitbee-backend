"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authHandler_1 = __importDefault(require("../../../api/handlers/auth/authHandler"));
const authRoutes = express_1.default.Router();
authRoutes.post("/login", authHandler_1.default.login);
exports.default = authRoutes;
