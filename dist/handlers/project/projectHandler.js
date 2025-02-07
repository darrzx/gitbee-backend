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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const response_1 = require("api/utils/response/response");
const validateSchema_1 = __importDefault(require("api/utils/validator/validateSchema"));
const genericService_1 = __importDefault(require("api/services/generic/genericService"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProjectHandler {
    static insertProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    lecturer_id: zod_1.z.string(),
                    student_leader_id: zod_1.z.string(),
                    title: zod_1.z.string(),
                    semester_id: zod_1.z.string(),
                    course_id: zod_1.z.string(),
                    class: zod_1.z.string(),
                    github_link: zod_1.z.string(),
                    project_link: zod_1.z.string(),
                    documentation: zod_1.z.string(),
                    video_link: zod_1.z.string(),
                    thumbnail: zod_1.z.string(),
                    description: zod_1.z.string(),
                    status_id: zod_1.z.number(),
                    category_id: zod_1.z.number(),
                    major_id: zod_1.z.number(),
                    gallery: zod_1.z.array(zod_1.z.string()),
                    group_members: zod_1.z.array(zod_1.z.string()).optional(),
                    technology_ids: zod_1.z.array(zod_1.z.number()),
                    group: zod_1.z.number()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.body);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.details);
                }
                const params = validationResult.data;
                const existingProject = yield prisma.project.findFirst({
                    where: {
                        lecturer_id: params.lecturer_id,
                        projectGroups: {
                            some: {
                                student_id: params.student_leader_id,
                            },
                        },
                        projectDetail: {
                            course_id: params.course_id,
                            semester_id: params.semester_id,
                            class: params.class
                        }
                    },
                    include: {
                        projectDetail: true,
                        projectGroups: true
                    }
                });
                if (existingProject) {
                    const projectId = existingProject.id;
                    yield prisma.$transaction([
                        prisma.gallery.deleteMany({ where: { project_id: projectId } }),
                        prisma.projectTechnology.deleteMany({ where: { project_id: projectId } }),
                        prisma.projectGroup.deleteMany({ where: { project_id: projectId } }),
                        prisma.projectDetail.delete({ where: { project_id: projectId } }),
                        prisma.project.delete({ where: { id: projectId } })
                    ]);
                }
                const newProject = yield prisma.project.create({
                    data: {
                        lecturer_id: params.lecturer_id,
                        student_leader_id: params.student_leader_id,
                        is_disable: 0
                    },
                });
                const newProjectDetail = yield prisma.projectDetail.create({
                    data: {
                        project_id: newProject.id,
                        title: params.title,
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        github_link: params.github_link,
                        project_link: params.project_link,
                        documentation: params.documentation,
                        video_link: params.video_link,
                        thumbnail: params.thumbnail,
                        description: params.description,
                        status_id: params.status_id,
                        category_id: params.category_id,
                        major_id: params.major_id,
                        group: params.group
                    },
                });
                const newGallery = params.gallery.map(image => ({
                    project_id: newProject.id,
                    image
                }));
                yield prisma.gallery.createMany({
                    data: newGallery
                });
                const newProjectTechnology = params.technology_ids.map(technology_id => ({
                    project_id: newProject.id,
                    technology_id
                }));
                yield prisma.projectTechnology.createMany({
                    data: newProjectTechnology
                });
                let groupMembers = params.group_members || [];
                if (!groupMembers.includes(params.student_leader_id)) {
                    groupMembers.push(params.student_leader_id);
                }
                if (groupMembers.length > 0) {
                    const newProjectGroupPromises = groupMembers.map((student_id) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        const nameResponse = yield genericService_1.default.getName(student_id);
                        const BinusianIdResponse = yield genericService_1.default.getBinusianID(student_id);
                        const name = (_a = nameResponse.data) !== null && _a !== void 0 ? _a : student_id;
                        const binusianId = (_b = BinusianIdResponse.data) !== null && _b !== void 0 ? _b : student_id;
                        return {
                            project_id: newProject.id,
                            student_id,
                            student_name: name,
                            student_binusian_id: binusianId
                        };
                    }));
                    const newProjectGroup = yield Promise.all(newProjectGroupPromises);
                    yield prisma.projectGroup.createMany({
                        data: newProjectGroup
                    });
                }
                const whereCondition = {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    group: Number(params.group)
                };
                const deletedTemporaryGroup = yield prisma.temporaryGroup.deleteMany({
                    where: whereCondition
                });
                (0, response_1.sendSuccessResponse)(res, { newProject, newProjectDetail });
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Insert Failed");
            }
        });
    }
    static getAllProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    search: zod_1.z.string().optional(),
                    categoryFilter: zod_1.z.string().optional(),
                    majorFilter: zod_1.z.string().optional(),
                    technologyFilter: zod_1.z.string().optional(),
                    semester_id: zod_1.z.string().optional()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const whereCondition = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ is_disable: 0 }, (params.search && {
                    OR: [
                        { projectDetail: { title: { contains: params.search } } },
                        { projectGroups: { some: { student_name: { contains: params.search } } } },
                        { projectGroups: { some: { student_id: { contains: params.search } } } },
                        { projectGroups: { some: { student_binusian_id: { contains: params.search } } } }
                    ]
                })), (params.categoryFilter && {
                    projectDetail: { category_id: Number(params.categoryFilter) }
                })), (params.majorFilter && {
                    projectDetail: { major_id: Number(params.majorFilter) }
                })), (params.technologyFilter && {
                    projectTechnologies: { some: { technology_id: Number(params.technologyFilter) } }
                })), { assessment: { isNot: null } });
                const projects = yield prisma.project.findMany({
                    where: whereCondition,
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true,
                        outstandingProject: true,
                        reviewedProject: true,
                        assessment: true
                    },
                    orderBy: [
                        {
                            projectDetail: {
                                status_id: 'desc'
                            }
                        },
                        {
                            outstandingProject: {
                                is_outstanding: 'desc'
                            }
                        },
                        {
                            reviewedProject: {
                                is_recommended: 'desc'
                            }
                        },
                        {
                            assessment: {
                                grade: 'desc'
                            }
                        }
                    ]
                });
                const updatedProjects = yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
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
                        return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails.name });
                    })));
                    return Object.assign(Object.assign({}, project), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies });
                })));
                (0, response_1.sendSuccessResponse)(res, updatedProjects);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
    static getDetailProject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = zod_1.z.object({
                    id: zod_1.z.string()
                });
                const validationResult = (0, validateSchema_1.default)(schema, req.query);
                if (validationResult.error) {
                    return (0, response_1.sendErrorResponse)(res, validationResult.message ? validationResult.message : "Fetch Failed");
                }
                const params = validationResult.data;
                const projects = yield prisma.project.findMany({
                    where: { id: Number(params.id) },
                    include: {
                        projectDetail: true,
                        projectGroups: true,
                        galleries: true,
                        projectTechnologies: true
                    }
                });
                const updatedProject = yield Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
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
                        return Object.assign(Object.assign({}, otherAttributes), { technology_name: technologyDetails.name });
                    })));
                    return Object.assign(Object.assign({}, project), { projectGroups: updatedProjectGroups, galleries: updatedGalleries, projectTechnologies: updatedProjectTechnologies });
                })));
                (0, response_1.sendSuccessResponse)(res, updatedProject);
            }
            catch (error) {
                (0, response_1.sendErrorResponse)(res, error.message ? error.message : "Fetch Failed");
            }
        });
    }
}
exports.default = ProjectHandler;
