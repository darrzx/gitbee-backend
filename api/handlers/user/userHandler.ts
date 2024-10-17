import { z } from "zod";
import type { Request, Response } from "express";
import validateSchema from "api/utils/validator/validateSchema";
import GenericService from "api/services/generic/genericService";
import { sendErrorResponse, sendSuccessResponse } from "api/utils/response/response";

export default class UserHandler {
    static async getName(req: Request<{ nim: string }>, res: Response) {
        const schema = z.object({ nim: z.string() })

        const validationResult = validateSchema(schema, req.query);
        if (validationResult.error) {
            sendErrorResponse(res, validationResult.details, 400);
        }
    
        const params = validationResult.data;
        const result = await GenericService.getName(params.nim);
    
        if (result.status === true && result.data) {
            sendSuccessResponse(res, result.data);
        } else {
            sendErrorResponse(res, result.errors ? result.errors : "Fetch Failed");
        }
    }
}