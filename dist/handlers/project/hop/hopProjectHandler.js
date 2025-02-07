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
class HopProjectHandler {
    static getHoPDashboard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    major_id: zod_1.z.string(),
                    semester_id: zod_1.z.string(),
                    is_outstanding: zod_1.z.string().optional(),
                    search: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Validation Failed");
                }
                const params = validationResult.data;
                const searchCondition = params.search
                    ? {
                        OR: [
                            { projectDetail: { title: { contains: params.search } } },
                            {
                                projectGroups: {
                                    some: {
                                        OR: [
                                            { student_id: { contains: params.search } },
                                            { student_name: { contains: params.search } }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    : {};
                const isOutstandingCondition = params.is_outstanding ? { is_outstanding: Number(params.is_outstanding) } : {};
                const [reviewedProjects, notReviewedProjects] = yield Promise.all([
                    prisma.project.findMany({
                        where: Object.assign(Object.assign({ projectDetail: {
                                semester_id: params.semester_id,
                                major_id: Number(params.major_id),
                                status_id: 4
                            } }, (isOutstandingCondition ? { outstandingProject: isOutstandingCondition } : {})), searchCondition),
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true,
                            assessment: true,
                            outstandingProject: true
                        },
                        orderBy: {
                            assessment: {
                                grade: 'desc'
                            }
                        }
                    }),
                    prisma.project.findMany({
                        where: Object.assign({ projectDetail: {
                                semester_id: params.semester_id,
                                major_id: Number(params.major_id),
                                status_id: 3
                            }, reviewedProject: { is_recommended: 1 } }, searchCondition),
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
                const formattedReviewedProjects = yield (0, formatterProject_1.formatProjects)(reviewedProjects);
                const formattedNotReviewedProjects = yield (0, formatterProject_1.formatProjects)(notReviewedProjects);
                const finalReviewedProjects = yield Promise.all(formattedReviewedProjects.map((project) => __awaiter(this, void 0, void 0, function* () {
                    const lecturer = yield prisma.user.findUnique({
                        where: { lecturer_code: project.lecturer_id }
                    });
                    const major = yield prisma.major.findUnique({
                        where: { id: project.projectDetail.major_id }
                    });
                    const category = yield prisma.category.findUnique({
                        where: { id: project.projectDetail.category_id }
                    });
                    const course = yield prisma.classTransaction.findFirst({
                        where: {
                            course_code: project.projectDetail.course_id
                        }
                    });
                    return Object.assign(Object.assign({}, project), { lecturer_name: lecturer ? lecturer.name : null, projectDetail: Object.assign(Object.assign({}, project.projectDetail), { major_name: major ? major.name : null, category_name: category ? category.name : null, course_name: course ? course.course_name : null }) });
                })));
                const finalNotReviewedProjects = yield Promise.all(formattedNotReviewedProjects.map((project) => __awaiter(this, void 0, void 0, function* () {
                    const lecturer = yield prisma.user.findUnique({
                        where: { lecturer_code: project.lecturer_id }
                    });
                    const major = yield prisma.major.findUnique({
                        where: { id: project.projectDetail.major_id }
                    });
                    const category = yield prisma.category.findUnique({
                        where: { id: project.projectDetail.category_id }
                    });
                    const course = yield prisma.classTransaction.findFirst({
                        where: {
                            course_code: project.projectDetail.course_id
                        }
                    });
                    return Object.assign(Object.assign({}, project), { lecturer_name: lecturer ? lecturer.name : null, projectDetail: Object.assign(Object.assign({}, project.projectDetail), { major_name: major ? major.name : null, category_name: category ? category.name : null, course_name: course ? course.course_name : null }) });
                })));
                const response = {
                    "count reviewed": finalReviewedProjects.length,
                    "count not reviewed": finalNotReviewedProjects.length,
                    "reviewed": finalReviewedProjects,
                    "not reviewed": finalNotReviewedProjects
                };
                (0, response_1.sendSuccessResponse)(res, response);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = HopProjectHandler;
