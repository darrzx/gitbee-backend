import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";
import GenericService from "api/services/generic/genericService";

const prisma = new PrismaClient();

export default class StudentGroupHandler {
    static async insertTemporaryGroup(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string(),
                student_ids: z.array(z.string()).or(z.string()),
            });
    
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Fetch Failed");
            }
    
            const params = validationResult.data;
            const studentIds = Array.isArray(params.student_ids) ? params.student_ids : [params.student_ids];

            const maxName = await prisma.temporaryGroup.findFirst({
                where: {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class
                },
                orderBy: {
                    group: 'desc'
                },
                select: {
                    group: true
                }
            });
    
            const nextName = maxName ? maxName.group + 1 : 1;
    
            const insertedGroups = await Promise.all(studentIds.map(async (student_id) => {
                const nameResponse = await GenericService.getName(student_id);
                const student_name = nameResponse.data ?? student_id;
    
                const binusianIDResponse = await GenericService.getBinusianID(student_id);
                const student_binusian_id = binusianIDResponse.data ?? student_id;
    
                return prisma.temporaryGroup.create({
                    data: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        group: nextName,
                        student_id,
                        student_name,
                        student_binusian_id
                    }
                });
            }));
    
            sendSuccessResponse(res, insertedGroups);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }

    static async getCurrentStudentGroup(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string(),
                student_id: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
            }
    
            const params = validationResult.data;
            const whereCondition = {
                semester_id: params.semester_id,
                course_id: params.course_id,
                class: params.class,
                student_id: params.student_id
            };
    
            const currentStudentGroup = await prisma.temporaryGroup.findFirst({
                where: whereCondition
            });

            if (!currentStudentGroup) {
                return sendSuccessResponse(res, []);
            }
    
            const groupMembers = await prisma.temporaryGroup.findMany({
                where: {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    group: currentStudentGroup.group
                }
            });
    
            sendSuccessResponse(res, groupMembers);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}