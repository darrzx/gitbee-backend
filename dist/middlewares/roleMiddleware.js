"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMiddleware = void 0;
const auth_1 = require("api/utils/auth/auth");
const response_1 = require("api/utils/response/response");
const RoleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const cookies = req.cookies;
        const token = cookies[process.env.COOKIE_NAME];
        if (!token) {
            return (0, response_1.sendErrorResponse)(res, "Cookie not found", 401);
        }
        const verify = (0, auth_1.verifyToken)(token);
        if (!verify.status) {
            return (0, response_1.sendErrorResponse)(res, verify.data, 401);
        }
        const data = verify.data;
        const role = data["role"];
        if (!role) {
            return (0, response_1.sendErrorResponse)(res, "User role not found", 401);
        }
        if (role !== requiredRole) {
            return (0, response_1.sendErrorResponse)(res, "Forbidden", 401);
        }
        next();
    };
};
exports.RoleMiddleware = RoleMiddleware;
