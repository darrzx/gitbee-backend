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

            const newGallery = params.gallery.map(image => ({
                project_id: newProject.id,
                image
            }));
            await prisma.gallery.createMany({
                data: newGallery
            });

            const newProjectTechnology = params.technology_ids.map(technology_id => ({
                project_id: newProject.id,
                technology_id
            }));
            await prisma.projectTechnology.createMany({
                data: newProjectTechnology
            });
    
            if (params.group_members && params.group_members.length > 0) {
                const newProjectGroup = params.group_members.map(student_id => ({
                    project_id: newProject.id,
                    student_id: student_id
                }));
                await prisma.projectGroup.createMany({
                    data: newProjectGroup
                });
            }
        
            sendSuccessResponse(res, { newProject, newProjectDetail });
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Project Failed");
        }
    }

    static async getAllProject(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                search: z.string().optional(),
                categoryFilter: z.string().optional(),
                majorFilter: z.string().optional(),
                technologyFilter: z.string().optional()
            });

            const validationResult = validateSchema(schema, req.query);

            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Fetch Failed");
            }

            const params = validationResult.data;
            const whereCondition = {
                ...(params.search && {
                    OR: [
                        { projectDetail: { name: { contains: params.search } } },
                        { projectGroups: { some: { student_id: { contains: params.search } } } }
                    ]
                }),
                ...(params.categoryFilter && {
                    projectDetail: { category_id: Number(params.categoryFilter) }
                }),
                ...(params.majorFilter && {
                    projectDetail: { major_id: Number(params.majorFilter) }
                }),
                ...(params.technologyFilter && {
                    projectTechnologies: { some: { technology_id: Number(params.technologyFilter) } } // Direct equality for numeric filters
                })
            };

            const projects = await prisma.project.findMany({
                where: whereCondition,
                include: {
                    projectDetail: true,
                    projectGroups: true,
                    galleries: true,
                    projectTechnologies: true
                }
            });
            sendSuccessResponse(res, projects);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}