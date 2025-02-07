"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("api/utils/response/response");
const client_1 = require("@prisma/client");
const semesterService_1 = __importDefault(require("api/services/semester/semesterService"));
const prisma = new client_1.PrismaClient();
class DeadlineHandler {
    static checkDeadline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield semesterService_1.default.getCurrentSemesterData();
                const description = result.data.Description;
                const periode = description.split(" ")[0];
                const deadline = yield prisma.deadline.findFirst({
                    where: { periode },
                });
                if (!deadline || !deadline.deadline_at) {
                    return (0, response_1.sendErrorResponse)(res, "Deadline not found", 404);
                }
                const currentYear = new Date().getFullYear();
                const deadlineString = `${deadline.deadline_at} ${currentYear}`;
                const deadlineDate = new Date(deadlineString);
                if (isNaN(deadlineDate.getTime())) {
                    return (0, response_1.sendErrorResponse)(res, "Invalid deadline format", 400);
                }
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                deadlineDate.setHours(0, 0, 0, 0);
                const timeDifference = deadlineDate.getTime() - currentDate.getTime();
                const daysRemaining = timeDifference / (1000 * 3600 * 24);
                const isDeadline = currentDate > deadlineDate;
                const isCloseToDeadline = daysRemaining >= 0 && daysRemaining <= 14;
                (0, response_1.sendSuccessResponse)(res, {
                    periode,
                    deadline_at: deadline.deadline_at,
                    isDeadline,
                    isCloseToDeadline,
                });
            }
            catch (error) {
                return (0, response_1.sendErrorResponse)(res, error.message, 400);
            }
        });
    }
}
exports.default = DeadlineHandler;
