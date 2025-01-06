import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AdminUserHandler {
    static async updateRole(req: Request<{ nim: string }>, res: Response) {
        try {
            const schema = z.object({ 
                id: z.string(), 
                role: z.string() 
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
    
            const updatedUserRole = await prisma.user.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    role: params.role
                }
            });
    
            sendSuccessResponse(res, updatedUserRole);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Update Failed");
        }
    }
}