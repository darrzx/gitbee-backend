"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atlantisSchema = void 0;
const zod_1 = require("zod");
exports.atlantisSchema = zod_1.z.object({
    email: zod_1.z
        .object({
        Email: zod_1.z.string(),
        isPrefEmail: zod_1.z.string(),
    })
        .array(),
    NIM: zod_1.z.string(),
    Name: zod_1.z.string(),
    BinusianID: zod_1.z.string(),
    KodeDosen: zod_1.z.string(),
});
