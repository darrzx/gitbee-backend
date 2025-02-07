"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hopOutstandingProjectHandler_1 = __importDefault(require("../../../../api/handlers/outstandingProject/hop/hopOutstandingProjectHandler"));
const hopOutstandingProjectRoutes = express_1.default.Router();
hopOutstandingProjectRoutes.post("/insert", hopOutstandingProjectHandler_1.default.insertOutstandingProject);
exports.default = hopOutstandingProjectRoutes;
