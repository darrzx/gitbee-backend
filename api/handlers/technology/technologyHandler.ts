import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class TechnologyHandler {
    static async getAllTechnology(req : Request, res : Response, next : NextFunction) {
        try {
            const technologies = await prisma.technology.findMany();
            sendSuccessResponse(res, technologies);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Fetch Failed");
        }
    }

    static async insertTechnology(req : Request, res : Response, next : NextFunction) {
        try {
            const schema = z.object({ name: z.string() });
      
            const validationResult = validateSchema(schema, req.body);
            if (validationResult.error) {
                return sendErrorResponse(res, validationResult.details);
            }

            const params = {
                name: validationResult.data.name
            };
    
            const newTechnology = await prisma.technology.create({
                data: {
                    name: params.name
                },
            });
    
            sendSuccessResponse(res, newTechnology);
        } catch (error) {
            sendErrorResponse(res, error.message ? error.message : "Insert Failed");
        }
    }
}