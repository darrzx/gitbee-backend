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
const semesterService_1 = __importDefault(require("../../services/semester/semesterService"));
const response_1 = require("../../utils/response/response");
class SemesterHandler {
    static getAllSemester(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield semesterService_1.default.getAllSemesterData();
            if (result.status === true && result.data) {
                (0, response_1.sendSuccessResponse)(res, result.data);
            }
            else {
                (0, response_1.sendErrorResponse)(res, result.errors ? result.errors : "Fetch Failed");
            }
        });
    }
    static getCurrentSemester(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield semesterService_1.default.getCurrentSemesterData();
            if (result.status === true && result.data) {
                (0, response_1.sendSuccessResponse)(res, result.data);
            }
            else {
                (0, response_1.sendErrorResponse)(res, result.errors ? result.errors : "Fetch Failed");
            }
        });
    }
}
exports.default = SemesterHandler;
