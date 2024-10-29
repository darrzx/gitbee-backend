import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class HopOutstandingProjectHandler { 
    static async insertOutstandingProject(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({ 
                project_id: z.number(),
                grade: z.number(), 
                feedback: z.string().optional() 
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
            const insertedOutstandingProject = await prisma.outstandingProject.create({
                data: {
                    project_id: params.project_id,
                    grade: params.grade,
                    feedback: params.feedback,
                    created_at: new Date()
                }
            })
        
            sendSuccessResponse(res, insertedOutstandingProject);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Project Failed");
        }
    }
}