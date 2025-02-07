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
const validateSchema_1 = __importDefault(require("api/utils/validator/validateSchema"));
const response_1 = require("api/models/generic/response");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const generic_1 = require("api/models/generic/generic");
const response_2 = require("api/utils/response/response");
dotenv_1.default.config();
class GenericService {
    static getAtlantisData(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(process.env.ATLANTIS_API, {
                    params: {
                        input: credential,
                    },
                });
                const validationResult = (0, validateSchema_1.default)(generic_1.atlantisSchema, res.data);
                if (validationResult.error) {
                    return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: validationResult.details, data: null });
                }
                return {
                    message: "successful",
                    status: true,
                    data: validationResult.data,
                };
            }
            catch (error) {
                const err = (0, response_2.getErrors)(error);
                return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: err, data: null });
            }
        });
    }
    ;
    static getName(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getAtlantisData(credential);
                let name = "";
                if (result.data.hasOwnProperty('Name') && result.data.hasOwnProperty('email') && result.data.email) {
                    name = result.data.Name === "" ? result.data.email[0].Email : result.data.Name;
                }
                return {
                    message: "successful",
                    status: true,
                    data: name,
                };
            }
            catch (error) {
                const err = (0, response_2.getErrors)(error);
                return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: err, data: null });
            }
        });
    }
    static getBinusianID(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getAtlantisData(credential);
                let BinusianID = "";
                if (result.data.hasOwnProperty('BinusianID') && result.data.hasOwnProperty('email') && result.data.email) {
                    BinusianID = result.data.BinusianID === "" ? result.data.email[0].Email : result.data.BinusianID;
                }
                return {
                    message: "successful",
                    status: true,
                    data: BinusianID,
                };
            }
            catch (error) {
                const err = (0, response_2.getErrors)(error);
                return Object.assign(Object.assign({}, response_1.defaultResponse), { errors: err, data: null });
            }
        });
    }
}
exports.default = GenericService;
