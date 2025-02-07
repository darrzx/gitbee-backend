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
const response_1 = require("api/utils/response/response");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OutstandingProjectHandler {
    static getAllOutstandingProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const outstandingProjects = yield prisma.outstandingProject.findMany({
                    where: {
                        is_outstanding: 1
                    },
                    include: {
                        project: {
                            include: {
                                projectDetail: true,
                                projectGroups: true,
                                galleries: true,
                                projectTechnologies: true
                            }
                        }
                    }
                });
                const updatedOutstandingProjects = yield Promise.all(outstandingProjects.map((outstandingProject) => __awaiter(this, void 0, void 0, function* () {
                    const { project_id } = outstandingProject, updatedOutstandingProjects = __rest(outstandingProject, ["project_id"]);
                    const project = outstandingProject.project;
                    const { created_at } = project, updatedProject = __rest(project, ["created_at"]);
                    const updatedProjectGroups = project.projectGroups.map(group => {
                        const { id, project_id } = group, otherAttributes = __rest(group, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedGalleries = project.galleries.map(gallery => {
                        const { id, project_id } = gallery, otherAttributes = __rest(gallery, ["id", "project_id"]);
                        return otherAttributes;
                    });
                    const updatedProjectTechnologies = yield Promise.all(project.projectTechnologies.map((technology) => __awaiter(this, void 0, void 0, function* () {
                        const technologyDetails = yield prisma.technology.findUnique({
                            where: { id: technology.technology_id }
                        });
                        const { id, project_id } = technology, otherAttributes = __rest(technology, ["id", "project_id"]);
                        return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails ? technologyDetails.name : null });
                    })));
                    return Object.assign(Object.assign({}, updatedOutstandingProjects), { project: Object.assign(Object.assign({}, updatedProject), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies }) });
                })));
                (0, response_1.sendSuccessResponse)(res, updatedOutstandingProjects);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = OutstandingProjectHandler;
