"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const majorHandler_1 = __importDefault(require("../../../api/handlers/major/majorHandler"));
const majorRoutes = express_1.default.Router();
majorRoutes.get("/all", majorHandler_1.default.getAllMajor);
majorRoutes.post("/insert", majorHandler_1.default.insertMajor);
exports.default = majorRoutes;
