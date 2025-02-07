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
const prisma = new client_1.PrismaClient();
class AssessmentHandler {
    static insertAssessment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    lecturer_id: zod_1.z.string(),
                    assessments: zod_1.z.array(zod_1.z.object({
                        project_id: zod_1.z.string(),
                        grade: zod_1.z.number(),
                        reason: zod_1.z.string().optional()
                    }))
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                // const insertedAssessments = await prisma.$transaction(
                //     params.assessments.map((assessment) => prisma.assessment.create({
                //         data: {
                //             project_id: Number(assessment.project_id),
                //             grade: assessment.grade,
                //             reason: assessment.reason ?? "",
                //             created_at: new Date()
                //         }
                //     }))
                // );
                // const finalizeClass = await prisma.class.create({
                //     data: {
                //         semester_id: params.semester_id, 
                //         course_id: params.course_id, 
                //         class: params.class, 
                //         lecturer_id: params.lecturer_id,
                //         finalized_at: new Date()
                //     }
                // });
                const insertedAssessments = yield prisma.$transaction([
                    ...params.assessments.map((assessment) => {
                        var _a;
                        return prisma.assessment.create({
                            data: {
                                project_id: Number(assessment.project_id),
                                grade: assessment.grade,
                                reason: (_a = assessment.reason) !== null && _a !== void 0 ? _a : "",
                                created_at: new Date()
                            }
                        });
                    }),
                    ...params.assessments.map((assessment) => prisma.projectDetail.update({
                        where: { project_id: Number(assessment.project_id) },
                        data: { status_id: 2 }
                    })),
                    prisma.class.create({
                        data: {
                            semester_id: params.semester_id,
                            course_id: params.course_id,
                            class: params.class,
                            lecturer_id: params.lecturer_id,
                            finalized_at: new Date()
                        }
                    })
                ]);
                (0, response_1.sendSuccessResponse)(res, insertedAssessments);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
}
exports.default = AssessmentHandler;
