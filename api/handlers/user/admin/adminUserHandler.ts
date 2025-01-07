import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";

const prisma = new PrismaClient();

export default class AdminUserHandler {
    static async getSccHop(req: Request, res: Response) {
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
    
            if (params.roleFilter === "SCC" || !params.roleFilter) {
                scc = await prisma.user.findMany({
                    where: {
                        role: "SCC",
                        ...searchCondition
                    }
                });
            }
    
            if (params.roleFilter === "HoP" || !params.roleFilter) {
                hop = await prisma.user.findMany({
                    where: {
                        role: "HoP",
                        ...searchCondition
                    }
                });
            }
    
            const response = {
                scc,
                hop
            };
    
            sendSuccessResponse(res, response);
        } catch (error) {
            sendErrorResponse(res, error.message || "Fetch Failed");
        }
    }    

    static async getLecturers(req: Request, res: Response) {
        try {
            const schema = z.object({
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
    
            const lecturers = await prisma.user.findMany({
                where: {
                    role: "Lecturer",
                    ...searchCondition
                }
            });
    
            sendSuccessResponse(res, lecturers);
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
                role: z.string() 
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

    static async uploadExcel(req: Request, res: Response) {
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

            const validatedUsers = rows
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
}