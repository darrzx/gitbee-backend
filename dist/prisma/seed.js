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
const genericService_1 = __importDefault(require("api/services/generic/genericService"));
const category_1 = require("./seeds/category");
const major_1 = require("./seeds/major");
const project_1 = require("./seeds/project");
const status_1 = require("./seeds/status");
const technology_1 = require("./seeds/technology");
const client_1 = require("@prisma/client");
const user_1 = require("./seeds/user");
const deadline_1 = require("./seeds/deadline");
const role_1 = require("./seeds/role");
const student_1 = require("./seeds/student");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.status.deleteMany({});
        yield prisma.category.deleteMany({});
        yield prisma.technology.deleteMany({});
        yield prisma.major.deleteMany({});
        yield prisma.project.deleteMany({});
        yield prisma.projectDetail.deleteMany({});
        yield prisma.projectGroup.deleteMany({});
        yield prisma.projectTechnology.deleteMany({});
        yield prisma.gallery.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.deadline.deleteMany({});
        yield prisma.role.deleteMany({});
        yield prisma.class.deleteMany({});
        yield prisma.hoPMajor.deleteMany({});
        yield prisma.studentListTransaction.deleteMany({});
        yield prisma.classTransaction.deleteMany({});
        yield prisma.$executeRaw `ALTER TABLE status AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE category AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE technology AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE major AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE project AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE project_detail AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE project_group AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE project_technology AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE gallery AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE user AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE deadline AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE role AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE class AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE hop_major AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE student_list_transaction AUTO_INCREMENT = 1`;
        yield prisma.$executeRaw `ALTER TABLE class_transaction AUTO_INCREMENT = 1`;
        // Seed statuses
        yield prisma.status.createMany({
            data: status_1.statuses
        });
        console.log('Status data seeded successfully.');
        // Seed categories
        yield prisma.category.createMany({
            data: category_1.categories
        });
        console.log('Category data seeded successfully.');
        // Seed technologies
        yield prisma.technology.createMany({
            data: technology_1.technologies
        });
        console.log('Technology data seeded successfully.');
        // Seed majors
        yield prisma.major.createMany({
            data: major_1.majors
        });
        console.log('Major data seeded successfully.');
        // Seed users
        yield prisma.user.createMany({
            data: user_1.users
        });
        console.log('User data seeded successfully.');
        yield prisma.hoPMajor.createMany({
            data: {
                user_id: 4,
                major_id: 6
            }
        });
        // Seed roles
        yield prisma.role.createMany({
            data: role_1.roles
        });
        console.log('Role data seeded successfully.');
        // Seed deadline
        yield prisma.deadline.createMany({
            data: deadline_1.deadlines
        });
        console.log('Deadline data seeded successfully.');
        // Seed student
        yield prisma.studentListTransaction.createMany({
            data: student_1.students
        });
        console.log('Student data seeded successfully.');
        //seed projects
        for (const params of project_1.projects) {
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
            if (params.status_id == 2 || params.status_id == 3 || params.status_id == 4) {
                let gradeValue;
                if (params.status_id === 2) {
                    gradeValue = Math.floor(Math.random() * 3) + 1;
                }
                else {
                    gradeValue = Math.floor(Math.random() * 2) + 4;
                }
                yield prisma.assessment.create({
                    data: {
                        project_id: newProject.id,
                        grade: gradeValue,
                        reason: "Bagus",
                        created_at: new Date(),
                    },
                });
                yield prisma.class.create({
                    data: {
                        semester_id: params.semester_id,
                        course_id: params.course_id,
                        class: params.class,
                        lecturer_id: params.lecturer_id,
                        finalized_at: new Date()
                    }
                });
            }
            if (params.status_id == 3 || params.status_id == 4) {
                yield prisma.reviewedProject.create({
                    data: {
                        project_id: newProject.id,
                        is_recommended: 1,
                        feedback: "Feedback Bagus banget",
                        created_at: new Date()
                    }
                });
            }
            if (params.status_id == 4) {
                yield prisma.outstandingProject.create({
                    data: {
                        project_id: newProject.id,
                        is_outstanding: 1,
                        feedback: "Feedback Bagus banget",
                        created_at: new Date()
                    }
                });
            }
        }
        console.log('Project data seeded successfully.');
    });
}
main().catch(e => {
    console.log(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
