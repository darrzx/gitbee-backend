import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";

const prisma = new PrismaClient();

export default class AdminUserHandler {
    static async getUser(req: Request, res: Response) {
        try {
            const schema = z.object({
                roleFilter: z.string().optional(),
                search: z.string().optional()
            });
    
            const validationResult = validateSchema(schema, req.query);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.message || "Validation Failed");
            }
    
            const params = validationResult.data;    
            const searchCondition = params.search
                ? {
                    OR: [
                        { lecturer_code: { contains: params.search } },
                        { email: { contains: params.search } },
                        { name: { contains: params.search } },
                    ]
                }
                : {};
    
            let scc = null;
            let hop = null;
            let lecturer = null;

            if (params.roleFilter === "SCC" || !params.roleFilter) {
                scc = await prisma.user.findMany({
                    where: {
                        role: "SCC",
                        ...searchCondition
                    }
                });
            }
    
            if (params.roleFilter === "HoP" || !params.roleFilter) {
                const hopData = await prisma.user.findMany({
                    where: {
                        role: "HoP",
                        ...searchCondition
                    },
                    include: {
                        hopMajor: {
                            select: {
                                major: { 
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                });
                hop = hopData.map((h) => ({
                    ...h,
                    hop_major: h.hopMajor.map((hm) => ({
                        id: hm.major.id,
                        name: hm.major.name,
                    })),
                }));
                hop.forEach((h) => delete h.hopMajor);
            }

            if (params.roleFilter === "Lecturer" || !params.roleFilter) {
                lecturer = await prisma.user.findMany({
                    where: {
                        role: "Lecturer",
                        ...searchCondition
                    }
                });
            }
    
            const response = {
                scc,
                hop,
                lecturer
            };
    
            sendSuccessResponse(res, response);
        } catch (error) {
            sendErrorResponse(res, error.message || "Fetch Failed");
        }
    }    

    static async insertUser(req : Request, res : Response) {
        try {
            const schema = z.object({
                lecturer_code: z.string(),
                email: z.string(), 
                name: z.string(),
                role: z.string(),
                major_ids: z.array(z.string()).optional()
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
    
            const newUser = await prisma.user.create({
                data: {
                    lecturer_code: params.lecturer_code,
                    email: params.email,
                    name: params.name,
                    role: params.role,
                },
            });

            if(params.role == "HoP" && params.major_ids) {
                const newHoPMajors = params.major_ids.map(major_id => ({
                    user_id: Number(newUser.id),
                    major_id: Number(major_id),
                }));
                await prisma.hoPMajor.createMany({
                    data: newHoPMajors
                });
            }
    
            sendSuccessResponse(res, newUser);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const schema = z.object({ 
                id: z.string(), 
                role: z.string(),
                major_ids: z.array(z.string()).optional()
            });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = validationResult.data;
    
            const updatedUserRole = await prisma.user.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    role: params.role
                }
            });

            if(params.role == "HoP" && params.major_ids) {
                const newHoPMajors = params.major_ids.map(major_id => ({
                    user_id: Number(params.id),
                    major_id: Number(major_id),
                }));
                await prisma.hoPMajor.createMany({
                    data: newHoPMajors
                });
            }
    
            sendSuccessResponse(res, updatedUserRole);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Update Failed");
        }
    }

    static async uploadUserExcel(req: Request, res: Response) {
        try {
            if (!req.file) {
                return sendErrorResponse(res, "No file uploaded.");
            }

            const schema = z.object({
                lecturer_code: z.string(),
                name: z.string(),
                email: z.string(), 
                role: z.string()
            });

            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

            // testing 3 data
            const firstThreeRows = rows.slice(0, 10);
            const validatedUsers = firstThreeRows
                .map((row) => ({
                    lecturer_code: row[3],    
                    name: row[2],             
                    email: row[2],            
                    role: "Lecturer",       
                }))
                .filter((row) => schema.safeParse(row).success);
    
            if (validatedUsers.length === 0) {
                return sendErrorResponse(res, "No valid rows found in the file.");
            }
    
            const createdUsers = await prisma.user.createMany({
                data: validatedUsers,
                skipDuplicates: true,
            });

            sendSuccessResponse(res, createdUsers);
        } catch (error) {
            sendErrorResponse(res, error.message || "Failed to process the Excel file.");
        }
    }

    static async removeUserExcel(req : Request, res : Response) {
        try {    
            const deletedUsers = await prisma.user.deleteMany({
                where: {
                    NOT: {
                        role: "Admin"
                    }
                }
            });
    
            sendSuccessResponse(res, deletedUsers);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Remove Failed");
        }
    }

    static async uploadTransactionExcel(req: Request, res: Response) {
        try {
            if (!req.file) {
                return sendErrorResponse(res, "No file uploaded.");
            }

            const schema = z.object({
                semester_id: z.string(),
                lecturer_code: z.string(),
                lecturer_name: z.string(), 
                course_code: z.string(),
                course_name: z.string(),
                class: z.string(),
                location: z.string()
            });

            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

            const validatedTransactions = rows
                .map((row) => ({
                    semester_id: row[0],
                    lecturer_code: row[3],   
                    lecturer_name: row[2],     
                    course_code: row[9], 
                    course_name: row[10], 
                    class: row[11], 
                    location: row[13]
                }))
                .filter((row) => schema.safeParse(row).success);
    
            if (validatedTransactions.length === 0) {
                return sendErrorResponse(res, "No valid rows found in the file.");
            }
    
            const createdTransactions = await prisma.classTransaction.createMany({
                data: validatedTransactions,
            });

            sendSuccessResponse(res, createdTransactions);
        } catch (error) {
            sendErrorResponse(res, error.message || "Failed to process the Excel file.");
        }
    }

    static async removeTransactionExcel(req : Request, res : Response) {
        try {    
            const deletedTransactions = await prisma.classTransaction.deleteMany({});
    
            sendSuccessResponse(res, deletedTransactions);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Remove Failed");
        }
    }
}