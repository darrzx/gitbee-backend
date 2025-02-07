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
const auth_1 = require("api/utils/auth/auth");
const auth_2 = require("api/utils/auth/auth");
const response_1 = require("api/utils/response/response");
const genericService_1 = __importDefault(require("api/services/generic/genericService"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthHandler {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const schema = zod_1.z.object({
                microsoft_token: zod_1.z.string(),
                role: zod_1.z.string().optional()
            });
            const valid = schema.safeParse(req.body);
            if (valid.success != true) {
                return (0, response_1.sendErrorResponse)(res, (_b = (_a = valid === null || valid === void 0 ? void 0 : valid.error) === null || _a === void 0 ? void 0 : _a.errors[0]) === null || _b === void 0 ? void 0 : _b.message, 400);
            }
            try {
                const microsoftToken = valid.data.microsoft_token;
                const decodedToken = (0, auth_1.parseJwt)(microsoftToken);
                const email = decodedToken.preferred_username || decodedToken.unique_name;
                const name = decodedToken.name;
                if (!email || !name) {
                    return (0, response_1.sendErrorResponse)(res, "Invalid token: Missing email or name", 400);
                }
                const atlantis = yield genericService_1.default.getAtlantisData(email);
                if (atlantis instanceof Error) {
                    return (0, response_1.sendErrorResponse)(res, "Failed to fetch Binusian data", 401);
                }
                const username = (_c = atlantis.data.BinusianID) !== null && _c !== void 0 ? _c : "";
                const lecturer_code = (_d = atlantis.data.KodeDosen) !== null && _d !== void 0 ? _d : "";
                const user = yield prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: email },
                            { lecturer_code: lecturer_code },
                        ],
                    },
                    select: {
                        lecturer_code: true,
                        email: true,
                        role: true
                    },
                });
                const role = (user === null || user === void 0 ? void 0 : user.role)
                    ? user.role === "Lecturer"
                        ? ["Lecturer"]
                        : [user.role, "Lecturer"]
                    : ["Student"];
                const nim = (user === null || user === void 0 ? void 0 : user.role) != null ? user === null || user === void 0 ? void 0 : user.lecturer_code : atlantis.data.NIM;
                let activeRole = null;
                if (valid.data.role) {
                    const checkedUser = yield prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { lecturer_code: lecturer_code },
                            ],
                        },
                        select: {
                            role: true
                        },
                    });
                    if (checkedUser) {
                        activeRole = valid.data.role;
                    }
                }
                else {
                    activeRole = (user === null || user === void 0 ? void 0 : user.role) ? "Lecturer" : "Student";
                }
                const token = (0, auth_2.createToken)(nim, username, name.toLowerCase(), email.toLowerCase(), role, microsoftToken, "", activeRole);
                return (0, response_1.sendSuccessResponse)(res, {
                    nim: nim,
                    BinusianId: username,
                    Name: name.toUpperCase(),
                    Email: email.toLowerCase(),
                    Role: role,
                    ActiveRole: activeRole,
                    MicrosoftToken: microsoftToken
                }, {
                    name: process.env.COOKIE_NAME,
                    value: token.token,
                    expires: token.expires,
                });
            }
            catch (error) {
                return (0, response_1.sendErrorResponse)(res, error.message, 400);
            }
        });
    }
}
exports.default = AuthHandler;
