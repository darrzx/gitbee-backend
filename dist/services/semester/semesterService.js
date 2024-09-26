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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_1 = require("../../models/generic/response");
const response_2 = require("../../utils/response/response");
dotenv_1.default.config();
class SemesterService {
    static getAllSemesterData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${process.env.BLUEJACK_API}Semester/GetSemestersWithActiveDate`);
                return {
                    message: "successful",
                    status: true,
                    data: res.data,
                };
            }
            catch (error) {
                const err = (0, response_2.getErrors)(error);
                return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: err, data: null });
            }
        });
    }
    static getCurrentSemesterData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${process.env.BLUEJACK_API}Semester/Active`);
                return {
                    message: "successful",
                    status: true,
                    data: res.data,
                };
            }
            catch (error) {
                const err = (0, response_2.getErrors)(error);
                return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: err, data: null });
            }
        });
    }
}
exports.default = SemesterService;
