import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LecturerGroupHandler {
    static async getStudentGroup(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
            }
    
            const params = validationResult.data;
            const whereCondition = {
                semester_id: params.semester_id,
                course_id: params.course_id,
                class: params.class
            };
    
            const StudentGroup = await prisma.temporaryGroup.findMany({
                where: whereCondition
            });
    
            const groupedData = StudentGroup.reduce((acc: any, current: any) => {
                const groupName = current.group;

                if (!acc[groupName]) {
                    acc[groupName] = [];
                }
    
                acc[groupName].push(current);
    
                return acc;
            }, {});
    
            const sortedGroups = Object.keys(groupedData)
                .sort((a, b) => Number(a) - Number(b))
                .map(name => ({
                    group: Number(name),
                    students: groupedData[name]
                }));
    
            sendSuccessResponse(res, sortedGroups);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}