import GenericService from "api/services/generic/genericService";
import { categories } from "./seeds/category";
import { majors } from "./seeds/major";
import { projects } from "./seeds/project";
import { statuses } from "./seeds/status";
import { technologies } from "./seeds/technology";
import { PrismaClient } from "@prisma/client";
import { users } from "./seeds/user";
const prisma = new PrismaClient();

async function main() {
    await prisma.status.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.technology.deleteMany({});
    await prisma.major.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.projectDetail.deleteMany({});
    await prisma.projectGroup.deleteMany({});
    await prisma.projectTechnology.deleteMany({});
    await prisma.gallery.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.$executeRaw`ALTER TABLE status AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE category AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE technology AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE major AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE project AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE project_detail AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE project_group AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE project_technology AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE gallery AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE user AUTO_INCREMENT = 1`;

    // Seed statuses
    await prisma.status.createMany({
        data: statuses
    });
    console.log('Status data seeded successfully.');

    // Seed categories
    await prisma.category.createMany({
        data: categories
    });
    console.log('Category data seeded successfully.');

    // Seed technologies
    await prisma.technology.createMany({
        data: technologies
    });
    console.log('Technology data seeded successfully.');

    // Seed majors
    await prisma.major.createMany({
        data: majors
    });
    console.log('Major data seeded successfully.');

    // Seed users
    await prisma.user.createMany({
        data: users
    });
    console.log('User data seeded successfully.');

    //seed projects
    for (const params of projects) {
        const newProject = await prisma.project.create({
            data: {
              lecturer_id: params.lecturer_id,
              student_leader_id: params.student_leader_id,
              is_disable: 0
            },
        });

        const newProjectDetail = await prisma.projectDetail.create({
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
        await prisma.gallery.createMany({
            data: newGallery
        });

        const newProjectTechnology = params.technology_ids.map(technology_id => ({
            project_id: newProject.id,
            technology_id
        }));
        await prisma.projectTechnology.createMany({
            data: newProjectTechnology
        });

        let groupMembers = params.group_members || [];
        if (!groupMembers.includes(params.student_leader_id)) {
            groupMembers.push(params.student_leader_id);
        }

        if (groupMembers.length > 0) {
            const newProjectGroupPromises = groupMembers.map(async (student_id) => {
                const nameResponse = await GenericService.getName(student_id);
                const BinusianIdResponse = await GenericService.getBinusianID(student_id);
                const name = nameResponse.data ?? student_id;
                const binusianId = BinusianIdResponse.data ?? student_id;

                return {
                    project_id: newProject.id,
                    student_id,
                    student_name: name,
                    student_binusian_id: binusianId
                };
            });
        
            const newProjectGroup = await Promise.all(newProjectGroupPromises);
        
            await prisma.projectGroup.createMany({
                data: newProjectGroup
            });
        }

        if(params.status_id == 2) {
            await prisma.assessment.create({
                data: {
                    project_id: newProject.id,
                    grade: Math.floor(Math.random() * 5) + 1,
                    reason: "Bagus",
                    created_at: new Date()
                }
            });

            await prisma.class.create({
                data: {
                    semester_id: params.semester_id,
                    course_id: params.course_id,
                    class: params.class,
                    lecturer_id: params.lecturer_id,
                    finalized_at: new Date()
                }
            })
        }
    }
    console.log('Project data seeded successfully.');

}

main().catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });