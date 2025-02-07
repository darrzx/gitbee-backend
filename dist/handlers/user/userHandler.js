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
const genericService_1 = __importDefault(require("api/services/generic/genericService"));
const response_1 = require("api/utils/response/response");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserHandler {
    static getName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = zod_1.z.object({ nim: zod_1.z.string() });
            const validationResult = (0, validateSchema_1.default)(schema, req.query);
            if (validationResult.error) {
                (0, response_1.sendErrorResponse)(res, validationResult.details, 400);
            }
            const params = validationResult.data;
            const result = yield genericService_1.default.getName(params.nim);
            if (result.status === true && result.data) {
                (0, response_1.sendSuccessResponse)(res, result.data);
            }
            else {
                (0, response_1.sendErrorResponse)(res, result.errors ? result.errors : "Fetch Failed");
            }
        });
    }
    static getAllRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield prisma.role.findMany();
                (0, response_1.sendSuccessResponse)(res, roles);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message || "Fetch Failed");
            }
        });
    }
}
exports.default = UserHandler;
