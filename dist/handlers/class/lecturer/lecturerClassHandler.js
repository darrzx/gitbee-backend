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
class LecturerClassHandler {
    static checkFinalize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    lecturer_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const classExists = yield prisma.class.findFirst({
                    where: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        lecturer_id: params.lecturer_id
                    }
                });
                const isExists = !!classExists;
                (0, response_1.sendSuccessResponse)(res, isExists);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
    static lecturerClassTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    lecturer_id: zod_1.z.string(),
                    course_id: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const classTransactions = yield prisma.classTransaction.findMany({
                    where: Object.assign({ semester_id: params.semester_id, lecturer_code: params.lecturer_id }, (params.course_id ? { course_code: params.course_id } : {}))
                });
                (0, response_1.sendSuccessResponse)(res, classTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static lecturerListCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    lecturer_id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const classTransactions = yield prisma.classTransaction.groupBy({
                    by: ['course_code', 'course_name'],
                    where: {
                        semester_id: params.semester_id,
                        lecturer_code: params.lecturer_id
                    }
                });
                const listCourses = classTransactions.map((transaction) => ({
                    course_code: transaction.course_code,
                    course_name: transaction.course_name
                }));
                (0, response_1.sendSuccessResponse)(res, listCourses);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = LecturerClassHandler;
