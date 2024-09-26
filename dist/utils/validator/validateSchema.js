"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const validateSchema = (schema, object) => {
    try {
        const parsed = schema.parse(object);
        return {
            data: parsed,
            message: "Success",
            details: null,
            error: false,
            status: null,
        };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const messages = error.errors.map((issue) => `${issue.path.join(".")} is ${issue.message}`);
            return {
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Invalid request data",
                error: true,
                details: messages,
                data: null,
            };
        }
        else {
            return {
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
                error: true,
                details: ["Unknown error"],
                data: null,
            };
        }
    }
};
exports.default = validateSchema;
