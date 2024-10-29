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
                lecturer_id: z.string(),
                student_leader_id: z.string(),
                title: z.string(),
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string(),
                github_link: z.string(),
                project_link: z.string(),
                documentation: z.string(),
                thumbnail: z.string(),
                description: z.string(),
                status_id: z.number(),
                category_id: z.number(),
                major_id: z.number(),
                gallery: z.array(z.string()),
                group_members: z.array(z.string()).optional(),
                technology_ids: z.array(z.number())
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
        
            // sendSuccessResponse(res, { newProject, newProjectDetail });
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Project Failed");
        }
    }
}