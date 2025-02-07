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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const formatProjects = (projects) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedProjectGroups = project.projectGroups.map(group => {
            const { id, project_id } = group, otherAttributes = __rest(group, ["id", "project_id"]);
            return otherAttributes;
        });
        const updatedGalleries = project.galleries.map(gallery => {
            const { id, project_id } = gallery, otherAttributes = __rest(gallery, ["id", "project_id"]);
            return otherAttributes;
        });
        const updatedProjectTechnologies = yield Promise.all(project.projectTechnologies.map((technology) => __awaiter(void 0, void 0, void 0, function* () {
            const technologyDetails = yield prisma.technology.findUnique({
                where: { id: technology.technology_id }
            });
            const { id, project_id } = technology, otherAttributes = __rest(technology, ["id", "project_id"]);
            return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails === null || technologyDetails === void 0 ? void 0 : technologyDetails.name });
        })));
        return Object.assign(Object.assign({}, project), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies });
    })));
});
exports.formatProjects = formatProjects;
