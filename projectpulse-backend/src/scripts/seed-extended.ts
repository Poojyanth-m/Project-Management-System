import { PrismaClient, UserRole, ProjectStatus, TaskStatus, TaskPriority, ExpenseStatus, EntityType, ActivityAction } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting EXTENDED database seeding...');

    // 1. Ensure Main User (You)
    const email = 'poojyanthm@gmail.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('Creating main user...');
        const hashedPassword = await bcrypt.hash('Poojum123', 10);
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: 'Poojyanth',
                lastName: 'M',
                role: UserRole.MANAGER,
                isActive: true
            }
        });
    }
    const userId = user.id;

    // 2. Create Team Members (for realism)
    const teamMembers = [
        { email: 'alex@projectpulse.com', firstName: 'Alex', lastName: 'Designer', role: UserRole.MEMBER },
        { email: 'sam@projectpulse.com', firstName: 'Sam', lastName: 'Dev', role: UserRole.MEMBER },
        { email: 'kelly@projectpulse.com', firstName: 'Kelly', lastName: 'Product', role: UserRole.MANAGER },
    ];

    const memberIds: string[] = [];
    for (const tm of teamMembers) {
        let m = await prisma.user.findUnique({ where: { email: tm.email } });
        if (!m) {
            m = await prisma.user.create({
                data: {
                    ...tm,
                    password: await bcrypt.hash('Demo123', 10),
                    isActive: true
                }
            });
        }
        memberIds.push(m.id);
    }
    console.log(`✅ ${memberIds.length} team members ensured.`);

    // 3. Create MULTIPLE Projects (Active, Completed, Planned) -> Total 4-5 projects to fill Dashboard
    const projectsData = [
        {
            name: 'Mobile App Launch v2.0',
            status: ProjectStatus.ACTIVE,
            description: 'iOS and Android app refresh with new UI.',
            daysOffset: -30, // Started 30 days ago
            duration: 60
        },
        {
            name: 'Marketing Campaign Q1',
            status: ProjectStatus.ACTIVE,
            description: 'Social media and ad campaign for new product line.',
            daysOffset: -10,
            duration: 45
        },
        {
            name: 'Internal Tools Migration',
            status: ProjectStatus.COMPLETED,
            description: 'Moving from legacy CRM to Salesforce.',
            daysOffset: -120,
            duration: 90
        },
        {
            name: 'AI Research Initiative',
            status: ProjectStatus.PLANNED,
            description: 'Feasibility study for AI integration.',
            daysOffset: 15, // Starts in future
            duration: 120
        }
    ];

    for (const p of projectsData) {
        const existing = await prisma.project.findFirst({ where: { name: p.name } });
        let projectId = existing?.id;

        if (!existing) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + p.daysOffset);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + p.duration);

            const newProj = await prisma.project.create({
                data: {
                    name: p.name,
                    description: p.description,
                    status: p.status,
                    startDate,
                    endDate,
                    createdById: userId,
                    members: {
                        create: [
                            { userId, role: UserRole.MANAGER },
                            ...memberIds.map(mid => ({ userId: mid, role: UserRole.MEMBER }))
                        ]
                    }
                }
            });
            projectId = newProj.id;
            console.log(`✅ Created project: ${p.name}`);
        } else {
            // Ensure you are a member
            const isMember = await prisma.projectMember.findFirst({
                where: { projectId, userId }
            });
            if (!isMember) {
                await prisma.projectMember.create({
                    data: { projectId: projectId!, userId, role: UserRole.MANAGER }
                });
                console.log(`Linked you to existing project: ${p.name}`);
            }
        }

        if (!projectId) continue;

        // 4. Populate Tasks for EACH Project
        const taskCount = await prisma.task.count({ where: { projectId } });
        if (taskCount < 3) {
            // Generate random tasks
            const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.IN_REVIEW];
            const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH];

            for (let i = 1; i <= 8; i++) {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                // If project is completed, tasks should be done
                const finalStatus = p.status === ProjectStatus.COMPLETED ? TaskStatus.DONE : status;

                // Assign randomly to you or team
                const assigneeId = Math.random() > 0.3 ? userId : memberIds[Math.floor(Math.random() * memberIds.length)];

                await prisma.task.create({
                    data: {
                        projectId,
                        title: `${p.name} - Task ${i}`,
                        description: `Detailed description for task ${i} related to ${p.name}`,
                        status: finalStatus,
                        priority: priorities[Math.floor(Math.random() * priorities.length)],
                        assigneeId,
                        createdById: userId,
                        startDate: new Date(),
                        dueDate: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 20))),
                    }
                });
            }
            console.log(`   Detailed tasks added for ${p.name}`);
        }

        // 5. Populate Budget
        const budget = await prisma.budget.findUnique({ where: { projectId } });
        if (!budget) {
            const total = 10000 + Math.floor(Math.random() * 50000);
            await prisma.budget.create({
                data: {
                    projectId,
                    totalBudget: total,
                    createdById: userId,
                    expenses: {
                        create: [
                            {
                                description: 'Initial Setup',
                                amount: total * 0.1,
                                status: ExpenseStatus.APPROVED,
                                expenseDate: new Date(),
                                category: 'Setup'
                            },
                            {
                                description: 'Monthly Licensing',
                                amount: 500,
                                status: ExpenseStatus.PENDING,
                                expenseDate: new Date(),
                                category: 'Software'
                            }
                        ]
                    }
                }
            });
        }
    }

    // 6. Populate Recent Activity (Important for Dashboard 'Recent Activities' if used)
    const activitiesCount = await prisma.activityLog.count({ where: { userId } });
    if (activitiesCount < 5) {
        // Find a project to log activity against
        const firstProj = await prisma.project.findFirst({ where: { members: { some: { userId } } } });
        if (firstProj) {
            await prisma.activityLog.createMany({
                data: [
                    { userId, action: ActivityAction.CREATED, entityType: EntityType.PROJECT, entityId: firstProj.id },
                    { userId, action: ActivityAction.UPDATED, entityType: EntityType.PROJECT, entityId: firstProj.id },
                    { userId, action: ActivityAction.COMMENTED, entityType: EntityType.PROJECT, entityId: firstProj.id, metadata: { comment: 'Project kickoff successful' } }
                ]
            });
            console.log('✅ Activity logs added.');
        }
    }

    console.log('🎉 Extended Seeding Complete! Dashboard should now be rich with data.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
