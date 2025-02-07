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
class AdminTechnologyHandler {
    static insertTechnology(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({ name: zod_1.z.string() });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.details);
                }
                const params = {
                    name: validationResult.data.name
                };
                const newTechnology = yield prisma.technology.create({
                    data: {
                        name: params.name
                    },
                });
                (0, response_1.sendSuccessResponse)(res, newTechnology);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
    static updateTechnology(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    id: zod_1.z.string(),
                    name: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.details);
                }
                const params = validationResult.data;
                const updatedTechnology = yield prisma.technology.update({
                    where: {
                        id: Number(params.id)
                    },
                    data: {
                        name: params.name
                    }
                });
                (0, response_1.sendSuccessResponse)(res, updatedTechnology);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Update Failed");
            }
        });
    }
}
exports.default = AdminTechnologyHandler;
