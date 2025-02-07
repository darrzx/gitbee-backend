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
const xlsx_1 = __importDefault(require("xlsx"));
const semesterService_1 = __importDefault(require("api/services/semester/semesterService"));
const prisma = new client_1.PrismaClient();
class AdminUserHandler {
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    roleFilter: zod_1.z.string().optional(),
                    search: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message || "Validation Failed");
                }
                const params = validationResult.data;
                const searchCondition = params.search
                    ? {
                        OR: [
                            { lecturer_code: { contains: params.search } },
                            { email: { contains: params.search } },
                            { name: { contains: params.search } },
                        ]
                    }
                    : {};
                let scc = null;
                let hop = null;
                let lecturer = null;
                let admin = null;
                if (params.roleFilter === "SCC" || !params.roleFilter) {
                    scc = yield prisma.user.findMany({
                        where: Object.assign({ role: "SCC" }, searchCondition)
                    });
                }
                if (params.roleFilter === "HoP" || !params.roleFilter) {
                    const hopData = yield prisma.user.findMany({
                        where: Object.assign({ role: "HoP" }, searchCondition),
                        include: {
                            hopMajors: {
                                select: {
                                    major: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        },
                    });
                    hop = hopData.map((h) => (Object.assign(Object.assign({}, h), { hop_major: h.hopMajors.map((hm) => ({
                            id: hm.major.id,
                            name: hm.major.name,
                        })) })));
                    hop.forEach((h) => delete h.hopMajors);
                }
                if (params.roleFilter === "Lecturer" || !params.roleFilter) {
                    lecturer = yield prisma.user.findMany({
                        where: Object.assign({ role: "Lecturer" }, searchCondition)
                    });
                }
                if (params.roleFilter === "Admin" || !params.roleFilter) {
                    admin = yield prisma.user.findMany({
                        where: Object.assign({ role: "Admin" }, searchCondition)
                    });
                }
                const response = {
                    scc,
                    hop,
                    lecturer,
                    admin
                };
                (0, response_1.sendSuccessResponse)(res, response);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message || "Fetch Failed");
            }
        });
    }
    static insertUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    lecturer_code: zod_1.z.string(),
                    email: zod_1.z.string(),
                    name: zod_1.z.string(),
                    role: zod_1.z.string(),
                    major_ids: zod_1.z.array(zod_1.z.string()).optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.details);
                }
                const params = validationResult.data;
                const newUser = yield prisma.user.create({
                    data: {
                        lecturer_code: params.lecturer_code,
                        email: params.email,
                        name: params.name,
                        role: params.role,
                    },
                });
                if (params.role == "HoP" && params.major_ids) {
                    const newHoPMajors = params.major_ids.map(major_id => ({
                        user_id: Number(newUser.id),
                        major_id: Number(major_id),
                    }));
                    yield prisma.hoPMajor.createMany({
                        data: newHoPMajors
                    });
                }
                (0, response_1.sendSuccessResponse)(res, newUser);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
    static updateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    id: zod_1.z.string(),
                    role: zod_1.z.string(),
                    major_ids: zod_1.z.array(zod_1.z.string()).optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.details);
                }
                const params = validationResult.data;
                const userExists = yield prisma.user.findUnique({
                    where: {
                        id: Number(params.id)
                    },
                    include: {
                        hopMajors: true
                    }
                });
                if (userExists && userExists.role === "HoP" && params.role !== "HoP") {
                    yield prisma.hoPMajor.deleteMany({
                        where: {
                            user_id: userExists.id
                        }
                    });
                }
                const updatedUserRole = yield prisma.user.update({
                    where: {
                        id: Number(params.id)
                    },
                    data: {
                        role: params.role
                    }
                });
                if (params.role == "HoP" && params.major_ids) {
                    yield prisma.hoPMajor.deleteMany({
                        where: {
                            user_id: Number(params.id)
                        }
                    });
                    const newHoPMajors = params.major_ids.map(major_id => ({
                        user_id: Number(params.id),
                        major_id: Number(major_id),
                    }));
                    yield prisma.hoPMajor.createMany({
                        data: newHoPMajors,
                        skipDuplicates: true
                    });
                }
                (0, response_1.sendSuccessResponse)(res, updatedUserRole);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Update Failed");
            }
        });
    }
    static uploadUserExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return (0, response_1.sendErrorResponse)(res, "No file uploaded.");
                }
                const schema = zod_1.z.object({
                    lecturer_code: zod_1.z.string(),
                    name: zod_1.z.string(),
                    email: zod_1.z.string(),
                    role: zod_1.z.string()
                });
                const workbook = xlsx_1.default.read(req.file.buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
                // testing 20 data
                const firstTenRows = rows.slice(0, 20);
                const validatedUsers = firstTenRows
                    .map((row) => ({
                    lecturer_code: row[2],
                    name: row[1],
                    email: row[1],
                    role: "Lecturer",
                }))
                    .filter((row) => schema.safeParse(row).success);
                if (validatedUsers.length === 0) {
                    return (0, response_1.sendErrorResponse)(res, "No valid rows found in the file.");
                }
                const createdUsers = yield prisma.user.createMany({
                    data: validatedUsers,
                    skipDuplicates: true
                });
                (0, response_1.sendSuccessResponse)(res, createdUsers);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message || "Failed to process the Excel file.");
            }
        });
    }
    static removeUserExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUsers = yield prisma.user.deleteMany({
                    where: {
                        NOT: [
                            { role: "Admin" },
                            { role: "SCC" },
                            { role: "HoP" }
                        ]
                    }
                });
                (0, response_1.sendSuccessResponse)(res, deletedUsers);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Remove Failed");
            }
        });
    }
    static getAllTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    search: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const whereCondition = Object.assign({}, (params.search && {
                    OR: [
                        { lecturer_code: { contains: params.search } },
                        { lecturer_name: { contains: params.search } },
                        { course_code: { contains: params.search } },
                        { course_name: { contains: params.search } },
                        { class: { contains: params.search } }
                    ]
                }));
                const classTransactions = yield prisma.classTransaction.findMany({
                    where: whereCondition
                });
                (0, response_1.sendSuccessResponse)(res, classTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static uploadTransactionExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return (0, response_1.sendErrorResponse)(res, "No file uploaded.");
                }
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    lecturer_code: zod_1.z.string(),
                    lecturer_name: zod_1.z.string(),
                    course_code: zod_1.z.string(),
                    course_name: zod_1.z.string(),
                    class: zod_1.z.string(),
                    location: zod_1.z.string()
                });
                const workbook = xlsx_1.default.read(req.file.buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
                const semesterRaw = rows[0][0];
                let semesterName = "";
                if (semesterRaw) {
                    const yearPart = Math.floor(semesterRaw / 100);
                    const termPart = semesterRaw % 100;
                    const year = 2000 + yearPart;
                    if (termPart === 10) {
                        semesterName = `Odd Semester ${year}/${year + 1}`;
                    }
                    else if (termPart === 20) {
                        semesterName = `Even Semester ${year}/${year + 1}`;
                    }
                }
                const semesterData = yield semesterService_1.default.getAllSemesterData();
                const semesterId = semesterData.data.find((semester) => semester.Description === semesterName);
                const uniqueCombinations = new Set();
                // testing 20 data
                const firstTenRows = rows.slice(0, 20);
                const validatedTransactions = firstTenRows
                    .map((row) => ({
                    semester_id: semesterId.SemesterID,
                    lecturer_code: row[2],
                    lecturer_name: row[1],
                    course_code: row[3],
                    course_name: row[4],
                    class: row[5],
                    location: row[6]
                }))
                    .filter((row) => {
                    const uniqueKey = `${row.semester_id}|${row.lecturer_code}|${row.course_code}|${row.class}|${row.location}`;
                    if (uniqueCombinations.has(uniqueKey)) {
                        return false;
                    }
                    uniqueCombinations.add(uniqueKey);
                    return true;
                })
                    .filter((row) => schema.safeParse(row).success);
                if (validatedTransactions.length === 0) {
                    return (0, response_1.sendErrorResponse)(res, "No valid rows found in the file.");
                }
                const createdTransactions = yield prisma.classTransaction.createMany({
                    data: validatedTransactions,
                    skipDuplicates: true
                });
                (0, response_1.sendSuccessResponse)(res, createdTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message || "Failed to process the Excel file.");
            }
        });
    }
    static removeTransactionExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTransactions = yield prisma.classTransaction.deleteMany({});
                (0, response_1.sendSuccessResponse)(res, deletedTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Remove Failed");
            }
        });
    }
    static getAllStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    search: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const whereCondition = Object.assign({}, (params.search && {
                    OR: [
                        { student_id: { contains: params.search } },
                        { student_name: { contains: params.search } },
                        { course_code: { contains: params.search } },
                        { class: { contains: params.search } }
                    ]
                }));
                const studentTransactions = yield prisma.studentListTransaction.findMany({
                    where: whereCondition
                });
                (0, response_1.sendSuccessResponse)(res, studentTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static uploadStudentExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return (0, response_1.sendErrorResponse)(res, "No file uploaded.");
                }
                const schema = zod_1.z.object({
                    semester_id: zod_1.z.string(),
                    student_id: zod_1.z.string(),
                    student_name: zod_1.z.string(),
                    course_code: zod_1.z.string(),
                    class: zod_1.z.string()
                });
                const workbook = xlsx_1.default.read(req.file.buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
                const semesterRaw = rows[0][2];
                let semesterName = "";
                if (semesterRaw) {
                    const yearPart = Math.floor(semesterRaw / 100);
                    const termPart = semesterRaw % 100;
                    const year = 2000 + yearPart;
                    if (termPart === 10) {
                        semesterName = `Odd Semester ${year}/${year + 1}`;
                    }
                    else if (termPart === 20) {
                        semesterName = `Even Semester ${year}/${year + 1}`;
                    }
                }
                const semesterData = yield semesterService_1.default.getAllSemesterData();
                const semesterId = semesterData.data.find((semester) => semester.Description === semesterName);
                if (!semesterId) {
                    return (0, response_1.sendErrorResponse)(res, "Invalid semester information.");
                }
                // testing 20 data
                const firstTenRows = rows.slice(0, 20);
                const validatedTransactions = firstTenRows
                    .map((row) => ({
                    semester_id: semesterId.SemesterID,
                    student_id: row[0].toString(),
                    student_name: row[1],
                    course_code: row[3],
                    class: row[4]
                }))
                    .filter((row) => schema.safeParse(row).success)
                    .filter((row) => row.class.startsWith("L"));
                if (validatedTransactions.length === 0) {
                    return (0, response_1.sendErrorResponse)(res, "No valid rows found in the file.");
                }
                const createdTransactions = yield prisma.studentListTransaction.createMany({
                    data: validatedTransactions,
                    skipDuplicates: true
                });
                (0, response_1.sendSuccessResponse)(res, createdTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message || "Failed to process the Excel file.");
            }
        });
    }
    static removeStudentExcel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTransactions = yield prisma.studentListTransaction.deleteMany({});
                (0, response_1.sendSuccessResponse)(res, deletedTransactions);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Remove Failed");
            }
        });
    }
}
exports.default = AdminUserHandler;
