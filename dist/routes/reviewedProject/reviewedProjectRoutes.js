"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewedProjectHandler_1 = __importDefault(require("../../../api/handlers/reviewedProject/reviewedProjectHandler"));
const sccReviewedProjectRoutes_1 = __importDefault(require("./scc/sccReviewedProjectRoutes"));
const reviewedProjectRoutes = express_1.default.Router();
reviewedProjectRoutes.get("/all", reviewedProjectHandler_1.default.getAllReviewedProject);
reviewedProjectRoutes.use("/scc", sccReviewedProjectRoutes_1.default);
exports.default = reviewedProjectRoutes;
