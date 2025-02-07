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
class LecturerGroupHandler {
    static getClassGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const whereCondition = {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class
                };
                const studentGroup = yield prisma.temporaryGroup.findMany({
                    where: whereCondition
                });
                const groupedData = studentGroup.reduce((acc, current) => {
                    const groupName = current.group;
                    if (!acc[groupName]) {
                        acc[groupName] = [];
                    }
                    acc[groupName].push(current);
                    return acc;
                }, {});
                const sortedGroups = Object.keys(groupedData)
                    .sort((a, b) => Number(a) - Number(b))
                    .map(name => ({
                    group: Number(name),
                    students: groupedData[name]
                }));
                (0, response_1.sendSuccessResponse)(res, sortedGroups);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static getClassList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const whereCondition = {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class
                };
                const studentGroup = yield prisma.temporaryGroup.findMany({
                    where: whereCondition
                });
                (0, response_1.sendSuccessResponse)(res, studentGroup);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static removeTemporaryGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    group: zod_1.z.number()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Invalid Parameters");
                }
                const params = validationResult.data;
                const whereCondition = {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    group: params.group
                };
                const deletedGroup = yield prisma.temporaryGroup.deleteMany({
                    where: whereCondition
                });
                (0, response_1.sendSuccessResponse)(res, deletedGroup);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Delete Failed");
            }
        });
    }
}
exports.default = LecturerGroupHandler;
