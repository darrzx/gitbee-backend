"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sccReviewedPorjectHandler_1 = __importDefault(require("../../../../api/handlers/reviewedProject/scc/sccReviewedPorjectHandler"));
const sccReviewedProjectRoutes = express_1.default.Router();
sccReviewedProjectRoutes.post("/insert", sccReviewedPorjectHandler_1.default.insertReviewedProject);
exports.default = sccReviewedProjectRoutes;
