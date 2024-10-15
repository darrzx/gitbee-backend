import type { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response/response";
import validateSchema from "api/utils/validator/validateSchema";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ProjectHandler {
    static async insertProject(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({ 
                lecturer_id: z.string(),
                student_leader_id: z.string(),
                name: z.string(),
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string(),
                github_link: z.string(),
                project_link: z.string(),
                documentation: z.string(),
                thumbnail: z.string(),
                status_id: z.number(),
                category_id: z.number(),
                major_id: z.number()
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = {
                lecturer_id: validationResult.data.lecturer_id,
                student_leader_id: validationResult.data.student_leader_id,
                name: validationResult.data.name,
                semester_id: validationResult.data.semester_id,
                course_id: validationResult.data.course_id,
                class: validationResult.data.class,
                github_link: validationResult.data.github_link,
                project_link: validationResult.data.project_link,
                documentation: validationResult.data.documentation,
                thumbnail: validationResult.data.thumbnail,
                status_id: validationResult.data.status_id,
                category_id: validationResult.data.category_id,
                major_id: validationResult.data.major_id
            };

            const newProject = await prisma.project.create({
                data: {
                  lecturer_id: params.lecturer_id,
                  student_leader_id: params.student_leader_id
                },
            });

            const newProjectDetail = await prisma.projectDetail.create({
                data: {
                  project_id: newProject.id,
                  name: params.name,
                  semester_id: params.semester_id,
                  course_id: params.course_id,
                  class: params.class,
                  github_link: params.github_link,
                  project_link: params.project_link,
                  documentation: params.documentation,
                  thumbnail: params.thumbnail,
                  status_id: params.status_id,
                  category_id: params.category_id,
                  major_id: params.major_id
                },
            });
        
            sendSuccessResponse(res, { newProject, newProjectDetail });
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Project Failed");
        }
    }
}