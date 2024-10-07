import type { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response/response";

export default class ProjectHandler {
    static async insertProject(req : Request, res : Response, next : NextFunction) {
        // const result = await SemesterService.getAllSemesterData();

        // if (result.status === true && result.data) {
        //     sendSuccessResponse(res, result.data);
        // } else {
        //     sendErrorResponse(res, result.errors ? result.errors : "Fetch Failed");
        // }
    }
}