import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LecturerClassHandler {
    static async checkFinalize(req : Request, res : Response) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                course_id: z.string(),
                class: z.string(),
                lecturer_id: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
            }
    
            const params = validationResult.data;
    
            const classExists = await prisma.class.findFirst({
                where: {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    lecturer_id: params.lecturer_id
                }
            });

            const isExists = !!classExists;
    
            sendSuccessResponse(res, isExists);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }

    static async lecturerClassTransaction(req : Request, res : Response) {
        try {
            const schema = z.object({
                semester_id: z.string(),
                lecturer_id: z.string()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
            }
    
            const params = validationResult.data;

            const classTransactions = await prisma.classTransaction.findMany({
                where: {
                    semester_id: params.semester_id,
                    lecturer_code: params.lecturer_id
                }
            });
    
            sendSuccessResponse(res, classTransactions);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }
}