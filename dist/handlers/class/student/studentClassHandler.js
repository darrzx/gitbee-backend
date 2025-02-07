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
class StudentClassHandler {
    static studentClassTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    student_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const studentListTransactions = yield prisma.studentListTransaction.findMany({
                    where: {
                        semester_id: params.semester_id,
                        student_id: params.student_id
                    }
                });
                const classTransactions = yield prisma.classTransaction.findMany({
                    where: {
                        semester_id: params.semester_id
                    }
                });
                const updatedStudentTransaction = studentListTransactions.map((studentData) => {
                    var _a, _b, _c, _d, _e;
                    const classData = classTransactions.find((classTransaction) => classTransaction.class === studentData.class &&
                        classTransaction.semester_id === studentData.semester_id &&
                        classTransaction.course_code === studentData.course_code);
                    return {
                        id: studentData.id,
                        semester_id: studentData.semester_id,
                        student_id: studentData.student_id,
                        student_name: studentData.student_name,
                        class: studentData.class,
                        lecturer_code: (_a = classData === null || classData === void 0 ? void 0 : classData.lecturer_code) !== null && _a !== void 0 ? _a : null,
                        lecturer_name: (_b = classData === null || classData === void 0 ? void 0 : classData.lecturer_name) !== null && _b !== void 0 ? _b : null,
                        course_code: (_c = classData === null || classData === void 0 ? void 0 : classData.course_code) !== null && _c !== void 0 ? _c : null,
                        course_name: (_d = classData === null || classData === void 0 ? void 0 : classData.course_name) !== null && _d !== void 0 ? _d : null,
                        location: (_e = classData === null || classData === void 0 ? void 0 : classData.location) !== null && _e !== void 0 ? _e : null
                    };
                });
                (0, response_1.sendSuccessResponse)(res, updatedStudentTransaction);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static studentListInClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    course_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const studentLists = yield prisma.studentListTransaction.findMany({
                    where: {
                        semester_id: params.semester_id,
                        class: params.class,
                        course_code: params.course_id
                    }
                });
                const groupedStudents = yield prisma.temporaryGroup.findMany({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                    },
                    select: { student_id: true }
                });
                const projectsWithDetailsAndGroups = yield prisma.project.findMany({
                    where: {
                        projectDetail: {
                            semester_id: params.semester_id,
                            course_id: params.course_id,
                            class: params.class,
                        },
                    },
                    include: {
                        projectGroups: {
                            select: { student_id: true },
                        },
                        projectDetail: true,
                    },
                });
                const groupedStudentIds = new Set(groupedStudents.map((g) => g.student_id));
                const projectStudentIds = new Set(projectsWithDetailsAndGroups.flatMap((project) => project.projectGroups.map((group) => group.student_id)));
                const studentListsWithDisableFlag = studentLists.map((student) => (Object.assign(Object.assign({}, student), { is_disable: groupedStudentIds.has(student.student_id) || projectStudentIds.has(student.student_id)
                        ? 1
                        : 0 })));
                (0, response_1.sendSuccessResponse)(res, studentListsWithDisableFlag);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = StudentClassHandler;
