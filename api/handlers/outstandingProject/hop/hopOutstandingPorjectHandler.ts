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
                is_recommended: z.boolean(),
                feedback: z.string().optional() 
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
            if(params.is_recommended) {
                await prisma.outstandingProject.create({
                    data: {
                        project_id: params.project_id,
                        grade: params.grade,
                        feedback: params.feedback,
                        created_at: new Date()
                    }
                });
            }

            await prisma.projectDetail.update({
                where: { project_id: params.project_id },
                data: { status_id: 3 }
            });
        
            sendSuccessResponse(res, "Project Successfully Reviewed");
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }

    static async removeOutstandingProject(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                project_id: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
            }
    
            const params = validationResult.data;
            const whereCondition = {
                project_id: Number(params.project_id)
            };
    
            const deletedOutstandingProject = await prisma.outstandingProject.delete({
                where: whereCondition
            });
    
            sendSuccessResponse(res, deletedOutstandingProject);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Delete Failed");
        }
    }
}