import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class HopProjectHandler {
    static async getAllClassProject(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string()
            });

            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Fetch Failed");
            }

            const params = validationResult.data;

            const classExists = await prisma.class.findFirst({
                where: {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class
                }
            });
    
            const includeAssessment = !!classExists;
            
            const projects = await prisma.project.findMany({
                where: {
                    projectDetail: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,       
                        class: params.class,               
                    },
                    ...(includeAssessment && { 
                        assessment: { grade: { gte: 4 } }
                    })
                },
                include: {
                    projectDetail: true,
                    projectGroups: true,
                    galleries: true,
                    projectTechnologies: true,
                    assessment: includeAssessment
                }
            });

            const updatedProjects = await Promise.all(projects.map(async (project) => {
                const updatedProjectGroups = project.projectGroups.map(group => {
                    const { id, project_id, ...otherAttributes } = group;
                    return otherAttributes;
                });
    
                const updatedGalleries = project.galleries.map(gallery => {
                    const { id, project_id, ...otherAttributes } = gallery;
                    return otherAttributes;
                });

                const updatedProjectTechnologies = await Promise.all(
                    project.projectTechnologies.map(async (technology) => {
                        const technologyDetails = await prisma.technology.findUnique({
                            where: { id: technology.technology_id }
                        });
                        const { id, project_id, ...otherAttributes } = technology;
                        return {
                            ...otherAttributes,
                            technology_name: technologyDetails.name
                        };
                    })
                );
    
                return {
                    ...project,
                    projectGroups: updatedProjectGroups,
                    galleries: updatedGalleries,
                    projectTechnologies: updatedProjectTechnologies
                };
            }));

            sendSuccessResponse(res, updatedProjects);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}