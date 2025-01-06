import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AdminUserHandler {
    static async insertUser(req : Request, res : Response) {
        try {
            const schema = z.object({
                lecturer_code: z.string(),
                email: z.string(), 
                role: z.string() 
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
    
            const newUser = await prisma.user.create({
                data: {
                    lecturer_code: params.lecturer_code,
                    email: params.email,
                    role: params.role,
                },
            });
    
            sendSuccessResponse(res, newUser);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const schema = z.object({ 
                id: z.string(), 
                role: z.string(),
                major_ids: z.array(z.string()).optional()
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

            if(params.role == "HoP" && params.major_ids) {
                const newHoPMajors = params.major_ids.map(major_id => ({
                    user_id: Number(params.id),
                    major_id: Number(major_id),
                }));
                await prisma.hoPMajor.createMany({
                    data: newHoPMajors
                });
            }
    
            sendSuccessResponse(res, updatedUserRole);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Update Failed");
        }
    }
}