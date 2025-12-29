import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Adding users to all projects to ensure visibility...");

    const projects = await prisma.project.findMany();
    const users = await prisma.user.findMany();

    if (projects.length === 0 || users.length === 0) {
        console.log("No projects or users found.");
        return;
    }

    let addedCount = 0;

    for (const project of projects) {
        for (const user of users) {
            // Check if user is already a member
            const existingMember = await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId: project.id,
                        userId: user.id
                    }
                }
            });

            if (!existingMember) {
                await prisma.projectMember.create({
                    data: {
                        projectId: project.id,
                        userId: user.id,
                        role: 'MANAGER' // Promoted to MANAGER for demo purposes (allows delete)
                    }
                });
                console.log(`Added user ${user.email} to project ${project.name} as MANAGER`);
                addedCount++;
            } else if (existingMember.role === 'MEMBER') {
                // Upgrade to MANAGER if already MEMBER
                await prisma.projectMember.update({
                    where: { id: existingMember.id },
                    data: { role: 'MANAGER' }
                });
                console.log(`Upgraded ${user.email} to MANAGER in ${project.name}`);
            }
        }
    }

    console.log(`Finished. Added ${addedCount} new memberships.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
