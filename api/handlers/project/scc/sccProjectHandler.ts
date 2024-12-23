import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";
import { formatProjects } from "api/utils/formatter/formatterProject";

const prisma = new PrismaClient();

export default class SccProjectHandler {
    static async getAllProject(req: Request, res: Response, next: NextFunction) {
        try {
            const schema = z.object({
                major_id: z.string(),
                semester_id: z.string(),
                course_id: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Validation Failed");
            }
    
            const params = validationResult.data;
    
            const [reviewedProjects, notReviewedProjects] = await Promise.all([
                prisma.project.findMany({
                    where: {
                        projectDetail: {
                            semester_id: params.semester_id,
                            major_id: Number(params.major_id),
                            course_id: params.course_id,
                            status_id: 3
                        }
                    },
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true,
                        assessment: true,
                        reviewedProject: true
                    },
                    orderBy: {
                        assessment: {
                            grade: 'desc'
                        }
                    }
                }),
                prisma.project.findMany({
                    where: {
                        projectDetail: {
                            semester_id: params.semester_id,
                            major_id: Number(params.major_id),
                            course_id: params.course_id,
                            status_id: 2
                        },
                        assessment: { grade: { gte: 4 } }
                    },
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true,
                        assessment: true
                    },
                    orderBy: {
                        assessment: {
                            grade: 'desc'
                        }
                    }
                })
            ]);
    
            const formattedReviewedProjects = await formatProjects(reviewedProjects);
            const formattedNotReviewedProjects = await formatProjects(notReviewedProjects);
    
            const response = {
                "count reviewed": formattedReviewedProjects.length,
                "count not reviewed": formattedNotReviewedProjects.length,
                "reviewed": formattedReviewedProjects,
                "not reviewed": formattedNotReviewedProjects
            };
    
            sendSuccessResponse(res, response);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}