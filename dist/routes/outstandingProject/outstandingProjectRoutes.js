"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const outstandingProjectHandler_1 = __importDefault(require("../../../api/handlers/outstandingProject/outstandingProjectHandler"));
const hopOutstandingProjectRoutes_1 = __importDefault(require("./hop/hopOutstandingProjectRoutes"));
const outstandingProjectRoutes = express_1.default.Router();
outstandingProjectRoutes.get("/all", outstandingProjectHandler_1.default.getAllOutstandingProject);
outstandingProjectRoutes.use("/hop", hopOutstandingProjectRoutes_1.default);
exports.default = outstandingProjectRoutes;
