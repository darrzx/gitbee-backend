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

    // static async lecturerClassTransaction(req : Request, res : Response) {
    //     try {
    //         const schema = z.object({
    //             semester_id: z.string(),
    //             lecturer_id: z.string()
    //         });
    
    //         const validationResult = validateSchema(schema, req.query);
    //         if (validationResult.error) {
    //             return sendErrorResponse(res, validationResult.message ? validationResult.message : "Invalid Parameters");
    //         }
    
    //         const params = validationResult.data;
    
    //         const studentListTransactions = await prisma.studentListTransaction.findMany({
    //             where: {
    //                 semester_id: params.semester_id,
    //                 course_code: params.course_id,
    //                 class: params.class,
    //                 student_id: params.student_id
    //             }
    //         });

    //         const classTransactions = await prisma.classTransaction.findMany({
    //             where: {
    //                 semester_id: params.semester_id,
    //                 course_code: params.course_id,
    //                 class: params.class,
    //             }
    //         });

    //         const updatedStudentTransaction = studentListTransactions.map((studentData) => {
    //             const classData = classTransactions.find(
    //                 (classTransaction) =>
    //                     classTransaction.class === studentData.class &&
    //                     classTransaction.semester_id === studentData.semester_id &&
    //                     classTransaction.course_code === studentData.course_code
    //             );
    
    //             return {
    //                 id: studentData.id,
    //                 semester_id: studentData.semester_id,
    //                 student_id: studentData.student_id,
    //                 student_name: studentData.student_name,
    //                 class: studentData.class,
    //                 lecturer_code: classData?.lecturer_code ?? null,
    //                 lecturer_name: classData?.lecturer_name ?? null,
    //                 course_code: classData?.course_code ?? null,
    //                 course_name: classData?.course_name ?? null,
    //                 location: classData?.location ?? null
    //             };
    //         });
    
    //         sendSuccessResponse(res, updatedStudentTransaction);
    //     } catch (error) {
    //         sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
    //     }
    // }
}