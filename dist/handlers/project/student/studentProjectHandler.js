"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateSchema_1 = __importDefault(require("api/utils/validator/validateSchema"));
const response_1 = require("api/utils/response/response");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StudentProjectHandler {
    static getStudentClassProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    student_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const classExists = yield prisma.class.findFirst({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class
                    }
                });
                const includeAssessment = !!classExists;
                const projects = yield prisma.project.findMany({
                    where: {
                        projectDetail: {
                            semester_id: params.semester_id,
                            course_id: params.course_id,
                            class: params.class,
                        },
                        projectGroups: {
                            some: {
                                student_id: params.student_id
                            }
                        }
                    },
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true,
                        assessment: includeAssessment
                    }
                });
                const updatedProjects = yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                    const updatedProjectGroups = project.projectGroups.map(group => {
                        const { id, project_id } = group, otherAttributes = __rest(group, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedGalleries = project.galleries.map(gallery => {
                        const { id, project_id } = gallery, otherAttributes = __rest(gallery, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedProjectTechnologies = yield Promise.all(project.projectTechnologies.map((technology) => __awaiter(this, void 0, void 0, function* () {
                        const technologyDetails = yield prisma.technology.findUnique({
                            where: { id: technology.technology_id }
                        });
                        const { id, project_id } = technology, otherAttributes = __rest(technology, ["id", "project_id"]);
                        return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails.name });
                    })));
                    return Object.assign(Object.assign({}, project), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies });
                })));
                const classTransactions = yield prisma.classTransaction.findFirst({
                    where: {
                        semester_id: params.semester_id,
                        course_code: params.course_id,
                        class: params.class
                    }
                });
                (0, response_1.sendSuccessResponse)(res, { updatedProjects, classTransactions });
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static getAllStudentProfileProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    student_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const projects = yield prisma.project.findMany({
                    where: {
                        projectGroups: {
                            some: {
                                student_id: params.student_id
                            }
                        }
                    },
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true,
                        assessment: true
                    },
                    orderBy: {
                        created_at: "desc"
                    }
                });
                const updatedProjects = yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                    const updatedProjectGroups = project.projectGroups.map(group => {
                        const { id, project_id } = group, otherAttributes = __rest(group, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedGalleries = project.galleries.map(gallery => {
                        const { id, project_id } = gallery, otherAttributes = __rest(gallery, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedProjectTechnologies = yield Promise.all(project.projectTechnologies.map((technology) => __awaiter(this, void 0, void 0, function* () {
                        const technologyDetails = yield prisma.technology.findUnique({
                            where: { id: technology.technology_id }
                        });
                        const { id, project_id } = technology, otherAttributes = __rest(technology, ["id", "project_id"]);
                        return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails.name });
                    })));
                    return Object.assign(Object.assign({}, project), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies });
                })));
                (0, response_1.sendSuccessResponse)(res, updatedProjects);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = StudentProjectHandler;
