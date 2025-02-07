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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateSchema_1 = __importDefault(require("api/utils/validator/validateSchema"));
const response_1 = require("api/utils/response/response");
const client_1 = require("@prisma/client");
const formatterProject_1 = require("api/utils/formatter/formatterProject");
const prisma = new client_1.PrismaClient();
class AdminProjectHandler {
    static getAdminDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    search: zod_1.z.string().optional(),
                    majorFilter: zod_1.z.string().optional(),
                    categoryFilter: zod_1.z.string().optional(),
                    semester_id: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Validation Failed");
                }
                const params = validationResult.data;
                const whereConditions = (statusId) => (Object.assign({ projectDetail: Object.assign(Object.assign(Object.assign({ status_id: statusId }, (params.majorFilter && { major_id: Number(params.majorFilter) })), (params.categoryFilter && { category_id: Number(params.categoryFilter) })), (params.semester_id && { semester_id: params.semester_id })) }, (params.search && {
                    OR: [
                        { projectDetail: { title: { contains: params.search } } },
                        { projectGroups: { some: { student_name: { contains: params.search } } } },
                        { projectGroups: { some: { student_id: { contains: params.search } } } },
                        { projectGroups: { some: { student_binusian_id: { contains: params.search } } } }
                    ]
                })));
                const [submittedProjects, gradedProjects, reviewedProjects, outstandingProjects] = yield Promise.all([
                    prisma.project.findMany({
                        where: whereConditions(1),
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true,
                        }
                    }),
                    prisma.project.findMany({
                        where: whereConditions(2),
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true,
                            assessment: true
                        },
                        orderBy: {
                            assessment: {
                                grade: 'desc'
                            }
                        }
                    }),
                    prisma.project.findMany({
                        where: whereConditions(3),
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true,
                            assessment: true
                        },
                        orderBy: {
                            assessment: {
                                grade: 'desc'
                            }
                        }
                    }),
                    prisma.project.findMany({
                        where: whereConditions(4),
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true,
                            assessment: true
                        },
                        orderBy: {
                            assessment: {
                                grade: 'desc'
                            }
                        }
                    })
                ]);
                const formattedSubmittedProjects = yield (0, formatterProject_1.formatProjects)(submittedProjects);
                const formattedGradedProjects = yield (0, formatterProject_1.formatProjects)(gradedProjects);
                const formattedReviewedProjects = yield (0, formatterProject_1.formatProjects)(reviewedProjects);
                const formattedOutstandingProjects = yield (0, formatterProject_1.formatProjects)(outstandingProjects);
                const response = {
                    "count submitted": formattedSubmittedProjects.length,
                    "count graded": formattedGradedProjects.length,
                    "count reviewed": formattedReviewedProjects.length,
                    "count outstanding": formattedOutstandingProjects.length,
                    "submitted": formattedSubmittedProjects,
                    "graded": formattedGradedProjects,
                    "reviewed": formattedReviewedProjects,
                    "outstanding": formattedOutstandingProjects
                };
                (0, response_1.sendSuccessResponse)(res, response);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static updateDisableToggle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    project_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Insert Failed");
                }
                const params = validationResult.data;
                const project = yield prisma.project.findUnique({
                    where: { id: Number(params.project_id) },
                    select: { is_disable: true }
                });
                if (!project) {
                    return (0, response_1.sendErrorResponse)(res, "Project not found");
                }
                const newIsDisable = project.is_disable === 0 ? 1 : 0;
                yield prisma.project.update({
                    where: {
                        id: Number(params.project_id)
                    },
                    data: {
                        is_disable: newIsDisable
                    }
                });
                return (0, response_1.sendSuccessResponse)(res, "Update completed successfully!");
            }
            catch (error) {
                return (0, response_1.sendErrorResponse)(res, error.message);
            }
        });
    }
}
exports.default = AdminProjectHandler;
