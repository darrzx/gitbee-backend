"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = sendSuccessResponse;
exports.sendErrorResponse = sendErrorResponse;
exports.getErrors = getErrors;
const response_1 = require("../../models/generic/response");
const axios_1 = __importDefault(require("axios"));
function sendSuccessResponse(res, data, cookie) {
    if (cookie) {
        res.cookie(cookie.name, cookie.value, {
            httpOnly: false,
            secure: false,
            expires: cookie.expires,
        });
    }
    res.status(200).json({
        message: "successful",
        status: true,
        data: data
    });
}
function sendErrorResponse(res, error, status) {
    res.status(status !== null && status !== void 0 ? status : 400).json(Object.assign(Object.assign({}, response_1.defaultResponse), { errors: error, data: null }));
}
function getErrors(error, message) {
    var _a, _b;
    const err = axios_1.default.isAxiosError(error) ? ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : error.message) : (message !== null && message !== void 0 ? message : "Unkown Error");
    return err;
}
