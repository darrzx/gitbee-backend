"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectHandler_1 = __importDefault(require("../../../api/handlers/project/projectHandler"));
const lecturerProjectRoutes_1 = __importDefault(require("./lecturer/lecturerProjectRoutes"));
const adminProjectRoutes_1 = __importDefault(require("./admin/adminProjectRoutes"));
const studentProjectRoutes_1 = __importDefault(require("./student/studentProjectRoutes"));
const sccProjectRoutes_1 = __importDefault(require("./scc/sccProjectRoutes"));
const hopProjectRoutes_1 = __importDefault(require("./hop/hopProjectRoutes"));
const projectRoutes = express_1.default.Router();
projectRoutes.post("/insert", projectHandler_1.default.insertProject);
projectRoutes.get("/all", projectHandler_1.default.getAllProject);
projectRoutes.get("/detail", projectHandler_1.default.getDetailProject);
projectRoutes.use("/hop", hopProjectRoutes_1.default);
projectRoutes.use("/scc", sccProjectRoutes_1.default);
projectRoutes.use("/lecturer", lecturerProjectRoutes_1.default);
projectRoutes.use("/admin", adminProjectRoutes_1.default);
projectRoutes.use("/student", studentProjectRoutes_1.default);
exports.default = projectRoutes;
