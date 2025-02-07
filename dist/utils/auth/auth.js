"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwt = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const addHour = (hour) => {
    const now = new Date();
    now.setTime(now.getTime() + (hour * 60 * 60 * 1000));
    return now;
};
const createToken = (nim, username, name, email, role, microsoftToken, messier_id, activeRole) => {
    const expire = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    const token = jsonwebtoken_1.default.sign({
        exp: expire,
        nim: nim,
        role: role,
        binusianId: username,
        name: name.toUpperCase(),
        email: email.toLowerCase(),
        messier_id: messier_id,
        activeRole: activeRole,
        microsoftToken: microsoftToken
    }, secret);
    return {
        token,
        expires: addHour(168),
    };
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        const verified = jsonwebtoken_1.default.verify(token, secret);
        return {
            status: true,
            data: verified
        };
    }
    catch (error) {
        return {
            status: false,
            data: error
        };
    }
};
exports.verifyToken = verifyToken;
const parseJwt = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded) {
            throw new Error("Invalid token");
        }
        return decoded;
    }
    catch (error) {
        throw new Error("Failed to parse token: " + error.message);
    }
};
exports.parseJwt = parseJwt;
