import type { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response/response";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import validateSchema from "api/utils/validator/validateSchema";
const prisma = new PrismaClient();

export default class CategoryHandler {
    static async getAllCategory(req : Request, res : Response, next : NextFunction) {
        try {
            const categories = await prisma.category.findMany();
            sendSuccessResponse(res, categories);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }

    static async insertCategory(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({ name: z.string() });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = {
                name: validationResult.data.name
            };
    
            const newCategory = await prisma.category.create({
                data: {
                    name: params.name
                },
            });
    
            sendSuccessResponse(res, newCategory);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }
}