"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semesterRoutes_1 = __importDefault(require("./semester/semesterRoutes"));
const routes = express_1.default.Router();
routes.use((req, res, next) => {
    next();
});
routes.get("/", (req, res) => {
    res.send("Welcome to GitBee");
});
routes.use("/semester", semesterRoutes_1.default);
exports.default = routes;
