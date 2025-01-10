import { z } from "zod";
import { parseJwt } from "api/utils/auth/auth";
import type { Request, Response } from "express";
import { createToken } from "api/utils/auth/auth";
import { sendSuccessResponse, sendErrorResponse } from "api/utils/response/response";
import GenericService from "api/services/generic/genericService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AuthHandler {
    static async login(req: Request, res: Response) {
        const schema = z.object({
            microsoft_token: z.string(),
        });

        const valid = schema.safeParse(req.body);
        if (valid.success != true) {    
            return sendErrorResponse(res, valid?.error?.errors[0]?.message, 400);
        }

        try {
            const microsoftToken = valid.data.microsoft_token;
            const decodedToken = parseJwt(microsoftToken);

            const email = decodedToken.preferred_username || decodedToken.unique_name;
            const name = decodedToken.name;
            console.log(name);
            console.log(email);

            if (!email || !name) {
                return sendErrorResponse(res, "Invalid token: Missing email or name", 400);
            }

            const atlantis = await GenericService.getAtlantisData(email);
            if (atlantis instanceof Error) {
                return sendErrorResponse(res, "Failed to fetch Binusian data", 401);
            }

            const username = atlantis.data.BinusianID ?? "";
            const nim = atlantis.data.NIM ?? "";
            const lecturer_code = atlantis.data.KodeDosen ?? "";

            const user = await prisma.user.findFirst({
                where: { 
                    email: email
                },
                select: {
                    email: true,
                    role: true,
                },
            });
            console.log(user)
            console.log(user?.role)
            const role = user?.role ?? "Student";
            console.log(role)

            const token = createToken(
                nim,
                username,
                name.toLowerCase(),
                email.toLowerCase(),
                role
            );

            return sendSuccessResponse(res, {
                nim: nim,
                BinusianId: username,
                Name: name.toUpperCase(),
                Email: email.toLowerCase(),
                Role: role,
            }, {
                name: process.env.COOKIE_NAME,
                value: token.token,
                expires: token.expires,
            });
        } catch (error) {
            return sendErrorResponse(res, error.message, 400);
        }
    }
}