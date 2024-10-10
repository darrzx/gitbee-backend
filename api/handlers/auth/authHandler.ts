import { z } from "zod";
import { parseJwt } from "api/utils/auth/auth";
import type { Request, Response } from "express";
import { createToken } from "api/utils/auth/auth";
import { sendErrorResponse } from "api/utils/response/response";
import GenericService from "api/services/generic/genericService";
import { sendSuccessResponse } from "api/utils/response/response";

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

            if (!email || !name) {
                return sendErrorResponse(res, "Invalid token: Missing email or name", 400);
            }

            const atlantis = await GenericService.getAtlantisData(email);
            if (atlantis instanceof Error) {
                return sendErrorResponse(res, "Failed to fetch Binusian data", 401);
            }

            const username = atlantis.data.BinusianID ?? "BN124298983";
            const nim = atlantis.data.NIM ?? "";
            const role = atlantis.data.KodeDosen ? "Lecturer" : "Student";

            const token = createToken(
                nim,
                username,
                name.toLowerCase(),
                email.toLowerCase(),
                role
            );

            return sendSuccessResponse(res, {
                UserName: username,
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