"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const auth_1 = require("api/utils/auth/auth");
const response_1 = require("api/utils/response/response");
const AuthMiddleware = () => {
    return (req, res, next) => {
        const cookies = req.cookies;
        const token = cookies[process.env.COOKIE_NAME];
        if (!token) {
            return (0, response_1.sendErrorResponse)(res, "Cookie not found", 401);
        }
        const verify = (0, auth_1.verifyToken)(token);
        if (!verify.status) {
            return (0, response_1.sendErrorResponse)(res, "Forbidden", 401);
        }
        const data = verify.data;
        if (!data) {
            return (0, response_1.sendErrorResponse)(res, "Forbidden", 401);
        }
        next();
    };
};
exports.AuthMiddleware = AuthMiddleware;
