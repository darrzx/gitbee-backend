import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AdminProjectHandler { 
    static async updateDisableToggle(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                project_id: z.string()
            });

            const validationResult = validateSchema(schema , req.query);
            if (validationResult.error) {
              return sendErrorResponse(res, validationResult.message ? validationResult.message : "Insert Failed");
            }

            const params = validationResult.data;
            const project = await prisma.project.findUnique({
                where: { id: Number(params.project_id) },
                select: { is_disable: true }
            });
    
            if (!project) {
                return sendErrorResponse(res, "Project not found");
            }
    
            const newIsDisable = project.is_disable === 0 ? 1 : 0;
    
            await prisma.project.update({
                where: { 
                    id: Number(params.project_id) 
                },
                data: { 
                    is_disable: newIsDisable 
                }
            });

            return sendSuccessResponse(res, "Update completed successfully!");
        } catch (error) {
            return sendErrorResponse(res, error.message);
        }
    }
}