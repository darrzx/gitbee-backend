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
const genericService_1 = __importDefault(require("api/services/generic/genericService"));
const prisma = new client_1.PrismaClient();
class StudentGroupHandler {
    static insertTemporaryGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    student_ids: zod_1.z.array(zod_1.z.string()).or(zod_1.z.string()),
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const studentIds = Array.isArray(params.student_ids) ? params.student_ids : [params.student_ids];
                const existingInTemporaryGroup = yield prisma.temporaryGroup.findMany({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        student_id: { in: studentIds },
                    },
                    select: {
                        student_id: true,
                    },
                });
                const existingInProjectGroup = yield prisma.project.findMany({
                    where: {
                        projectDetail: {
                            semester_id: params.semester_id,
                            course_id: params.course_id,
                            class: params.class,
                        },
                        projectGroups: {
                            some: { student_id: { in: studentIds } },
                        },
                    },
                    select: {
                        projectGroups: {
                            select: {
                                student_id: true,
                            },
                        },
                    },
                });
                const studentsInTemporaryGroup = new Set(existingInTemporaryGroup.map((entry) => entry.student_id));
                const studentsInProjectGroup = new Set(existingInProjectGroup.flatMap((project) => project.projectGroups.map((group) => group.student_id)));
                const conflictingStudents = Array.from(new Set([
                    ...studentsInTemporaryGroup,
                    ...studentsInProjectGroup,
                ]));
                if (conflictingStudents.length > 0) {
                    return (0, response_1.sendErrorResponse)(res, `One Of The Group Members Has Already Created A Group`);
                }
                const existingTemporaryGroups = yield prisma.temporaryGroup.findMany({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class
                    },
                    orderBy: {
                        group: 'asc'
                    },
                    select: {
                        group: true
                    },
                    distinct: ['group']
                });
                console.log(existingTemporaryGroups);
                const existingGroupsInProject = yield prisma.projectDetail.findMany({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                    },
                    orderBy: {
                        group: 'asc'
                    },
                    select: {
                        group: true,
                    }
                });
                console.log(existingGroupsInProject);
                const combinedGroups = existingTemporaryGroups.concat(existingGroupsInProject);
                combinedGroups.sort((a, b) => a.group - b.group);
                console.log(combinedGroups);
                let currentProjectGroupIndex = 1;
                for (const temporaryGroup of combinedGroups) {
                    if (temporaryGroup.group == currentProjectGroupIndex) {
                        currentProjectGroupIndex++;
                    }
                    else {
                        break;
                    }
                }
                console.log("next group: " + currentProjectGroupIndex);
                const insertedGroups = yield Promise.all(studentIds.map((student_id) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const nameResponse = yield genericService_1.default.getName(student_id);
                    const student_name = (_a = nameResponse.data) !== null && _a !== void 0 ? _a : student_id;
                    const binusianIDResponse = yield genericService_1.default.getBinusianID(student_id);
                    const student_binusian_id = (_b = binusianIDResponse.data) !== null && _b !== void 0 ? _b : student_id;
                    return prisma.temporaryGroup.create({
                        data: {
                            semester_id: params.semester_id,
                            course_id: params.course_id,
                            class: params.class,
                            group: currentProjectGroupIndex,
                            student_id,
                            student_name,
                            student_binusian_id
                        }
                    });
                })));
                (0, response_1.sendSuccessResponse)(res, insertedGroups);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
    static getCurrentStudentGroup(req, res, next) {
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
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const whereCondition = {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    student_id: params.student_id
                };
                const currentStudentGroup = yield prisma.temporaryGroup.findFirst({
                    where: whereCondition
                });
                if (!currentStudentGroup) {
                    return (0, response_1.sendSuccessResponse)(res, []);
                }
                const groupMembers = yield prisma.temporaryGroup.findMany({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        group: currentStudentGroup.group
                    }
                });
                (0, response_1.sendSuccessResponse)(res, groupMembers);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = StudentGroupHandler;
