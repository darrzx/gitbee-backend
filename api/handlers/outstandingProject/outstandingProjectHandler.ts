import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class OutstandingProjectHandler { 
    static async getAllOutstandingProject(req : Request, res : Response, next : NextFunction) {
        try {
            const outstandingProjects = await prisma.outstandingProject.findMany({
                include: {
                    project: {
                        include: {
                            projectDetail: true,
                            projectGroups: true,
                            galleries: true,
                            projectTechnologies: true
                        }
                    }
                }
            });

            const updatedOutstandingProjects = await Promise.all(outstandingProjects.map(async (outstandingProject) => {
                const { project_id, ...updatedOutstandingProject } = outstandingProject;

                const project = outstandingProject.project;
                const { created_at, ...updatedProject } = project;
    
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
                            technology_name: technologyDetails ? technologyDetails.name : null
                        };
                    })
                );
    
                return {
                    ...updatedOutstandingProject,
                    project: {
                        ...updatedProject,
                        projectGroups: updatedProjectGroups,
                        galleries: updatedGalleries,
                        projectTechnologies: updatedProjectTechnologies
                    }
                };
            }));
    
            sendSuccessResponse(res, updatedOutstandingProjects);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}