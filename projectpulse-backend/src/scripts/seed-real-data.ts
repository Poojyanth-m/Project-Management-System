import { PrismaClient, UserRole, ProjectStatus, TaskStatus, TaskPriority, EntityType, ActivityAction, ExpenseStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌟 Starting REALISTIC Data Seeding for Dashboard & Gantt...');

    // 1. Get or Create Main User
    const email = 'poojyanthm@gmail.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
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
    console.log(`👤 Identifying as: ${user.email}`);

    // Clean up previous data for this user to ensure clean state (optional, but good for "fixing" broken states)
    // We won't delete the user, but we might remove their membership from existing demo projects to avoid duplicates
    // Actually, let's just create NEW unique projects.

    // 2. Create "ERP System Migration" (Complex, for Gantt)
    const projectStartDate = new Date();
    projectStartDate.setDate(projectStartDate.getDate() - 15); // Started 15 days ago
    const projectEndDate = new Date();
    projectEndDate.setDate(projectEndDate.getDate() + 45); // Ends in 45 days

    const project = await prisma.project.create({
        data: {
            name: 'ERP System Migration v2',
            description: 'Migrating legacy financial systems to modern cloud ERP.',
            status: ProjectStatus.ACTIVE,
            startDate: projectStartDate,
            endDate: projectEndDate,
            createdById: userId,
            members: {
                create: { userId, role: UserRole.MANAGER }
            }
        }
    });

    // 3. Create Tasks with Dependencies (Waterfall/Gantt style)
    // Task 1: Analysis (Done)
    const task1 = await prisma.task.create({
        data: {
            projectId: project.id,
            title: 'Requirements Analysis',
            status: TaskStatus.DONE,
            priority: TaskPriority.HIGH,
            startDate: new Date(new Date().setDate(new Date().getDate() - 15)),
            dueDate: new Date(new Date().setDate(new Date().getDate() - 10)),
            duration: 40, // 5 days (8h/day)
            progress: 100,
            completedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
            createdById: userId,
            assigneeId: userId
        }
    });

    // Task 2: Database Design (Done) - Depends on Task 1
    const task2 = await prisma.task.create({
        data: {
            projectId: project.id,
            title: 'Schema & Database Design',
            status: TaskStatus.DONE,
            priority: TaskPriority.HIGH,
            startDate: new Date(new Date().setDate(new Date().getDate() - 9)),
            dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
            duration: 32,
            progress: 100,
            completedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
            createdById: userId,
            assigneeId: userId
        }
    });
    // Dependency: Task 2 depends on Task 1
    await prisma.taskDependency.create({ data: { taskId: task2.id, dependsOnTaskId: task1.id } });

    // Task 3: API Implementation (In Progress) - Depends on Task 2
    const task3 = await prisma.task.create({
        data: {
            projectId: project.id,
            title: 'Core API Implementation',
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            startDate: new Date(new Date().setDate(new Date().getDate() - 4)),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            duration: 80,
            progress: 45,
            createdById: userId,
            assigneeId: userId
        }
    });
    await prisma.taskDependency.create({ data: { taskId: task3.id, dependsOnTaskId: task2.id } });

    // Task 4: UI Development (TODO) - Depends on Task 2
    const task4 = await prisma.task.create({
        data: {
            projectId: project.id,
            title: 'Dashboard UI Development',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
            duration: 120,
            progress: 0,
            createdById: userId,
            assigneeId: userId
        }
    });
    await prisma.taskDependency.create({ data: { taskId: task4.id, dependsOnTaskId: task2.id } });

    console.log('✅ Created Gantt-ready tasks with dependencies.');

    // 4. Create Budget & Expenses (For Dashboard Metrics)
    await prisma.budget.create({
        data: {
            projectId: project.id,
            totalBudget: 150000,
            createdById: userId,
            expenses: {
                create: [
                    { description: 'Server Infrastructure', amount: 12000, status: ExpenseStatus.APPROVED, expenseDate: new Date(), category: 'Infrastructure' },
                    { description: 'External Consultant', amount: 5000, status: ExpenseStatus.PENDING, expenseDate: new Date(), category: 'Services' }
                ]
            }
        }
    });

    // 5. Create Time Entries (For Dashboard Metrics)
    await prisma.timeEntry.createMany({
        data: [
            { userId, taskId: task1.id, startTime: new Date(), duration: 120, isBillable: true },
            { userId, taskId: task1.id, startTime: new Date(), duration: 240, isBillable: true },
            { userId, taskId: task3.id, startTime: new Date(), duration: 300, isBillable: true },
        ]
    });

    // 6. Create Recent Activity Logs (For Dashboard List)
    // CAREFUL: Polymorphic relations in Prisma require precise mapping. 
    // In our schema: 
    // project Project? @relation("ProjectActivities", ...)
    // task    Task?    @relation("TaskActivities", ...)
    // So if entityType is PROJECT, we must ensure 'entityId' is a valid Project ID.

    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action: ActivityAction.CREATED,
                entityType: EntityType.PROJECT,
                entityId: project.id,
                // Do NOT explicitly connect relations if entityId is the key, but Prisma requires it for the relation field if defined. 
                // Actually, our schema defined:
                // project Project? @relation(fields: [entityId]...)
                // So setting entityId IS setting the relation ID.
                // BUT, to be safe with Prisma types, we can let Prisma handle the FK if we prefer, but entityId is the scalar.
                // Let's rely on entityId.
            }
        });

        await prisma.activityLog.create({
            data: {
                userId,
                action: ActivityAction.COMPLETED,
                entityType: EntityType.TASK,
                entityId: task1.id,
            }
        });

        await prisma.activityLog.create({
            data: {
                userId,
                action: ActivityAction.STATUS_CHANGED,
                entityType: EntityType.TASK,
                entityId: task3.id,
                metadata: { from: 'TODO', to: 'IN_PROGRESS' }
            }
        });

        console.log('✅ Created activity logs.');
    } catch (e) {
        console.error('⚠️ Activity log creation warning:', e);
    }

    // 7. Create a second project for variety
    const proj2 = await prisma.project.create({
        data: {
            name: 'Q3 Marketing Campaign',
            status: ProjectStatus.PLANNED,
            description: 'Upcoming marketing push.',
            createdById: userId,
            members: { create: { userId, role: UserRole.MEMBER } }
        }
    });

    // Add tasks to Project 2
    await prisma.task.createMany({
        data: [
            { projectId: proj2.id, title: 'Campaign Strategy', status: TaskStatus.TODO, createdById: userId, assigneeId: userId, priority: TaskPriority.HIGH },
            { projectId: proj2.id, title: 'Content Creation', status: TaskStatus.TODO, createdById: userId, assigneeId: userId }
        ]
    });

    // Add budget to Project 2
    await prisma.budget.create({
        data: {
            projectId: proj2.id,
            totalBudget: 50000,
            createdById: userId
        }
    });

    console.log(`✅ Created second project: ${proj2.name}`);

    // 8. Seed Resources (New)
    console.log('📦 Seeding Resources...');

    // Clear existing resources to ensure we only have what we want
    // Note: We delete in order of relationship dependencies
    await prisma.resourceAllocation.deleteMany({});
    await prisma.resource.deleteMany({});

    // Create 10 Human Resources with Real Names
    const realResourcesContent = [
        { name: 'Poojyanth', role: 'Project Manager', availability: 100, costPH: 120 },
        { name: 'Prakriti', role: 'Business Analyst', availability: 100, costPH: 95 },
        { name: 'Rakshitha', role: 'Frontend Lead', availability: 100, costPH: 110 },
        { name: 'Venkata Durga Sai', role: 'Backend Lead', availability: 100, costPH: 110 },
        { name: 'Sanjana', role: 'Marketing Lead', availability: 100, costPH: 90 },
        { name: 'Sarah Wilson', role: 'Full Stack Developer', availability: 100, costPH: 95 },
        { name: 'David Chen', role: 'UI/UX Designer', availability: 100, costPH: 85 },
        { name: 'Emily Rodriguez', role: 'Project Coordinator', availability: 100, costPH: 90 },
        { name: 'Michael Brown', role: 'DevOps Engineer', availability: 100, costPH: 80 },
        { name: 'Jessica Lee', role: 'QA Analyst', availability: 100, costPH: 88 }
    ];

    for (let i = 0; i < realResourcesContent.length; i++) {
        const resData = realResourcesContent[i];
        const res = await prisma.resource.create({
            data: {
                name: resData.name,
                type: 'HUMAN',
                status: 'ACTIVE',
                availability: resData.availability,
                costPH: resData.costPH,
                projectId: project.id // Assigned to main project
            }
        });

        // Determine allocation percentage to vary statuses:
        // 0, 1, 2 = Overloaded (120%)
        // 3, 4 = Busy (100%)
        // Others = Partially Allocated (50-80%)
        let allocation = 70;
        if (i < 3) allocation = 120;
        else if (i < 5) allocation = 100;
        else allocation = Math.floor(Math.random() * 30) + 50;

        // Allocate each to make it look "live"
        await prisma.resourceAllocation.create({
            data: {
                resourceId: res.id,
                projectId: project.id,
                startDate: projectStartDate,
                endDate: projectEndDate,
                allocationPercentage: allocation,
                taskId: task3.id // Assign to API task
            }
        });
    }

    console.log('✅ 5 Real Resources seeded with allocations.');

    // 9. Seed Bulk Dashboard Data (Projects for Metrics)
    console.log('📊 Seeding Dashboard Filler Data...');
    const dashboardProjects = [
        { name: 'Mobile App 2.0', status: ProjectStatus.COMPLETED, budget: 80000, spent: 78000 },
        { name: 'Q4 Sales Drive', status: ProjectStatus.ACTIVE, budget: 20000, spent: 5000 },
        { name: 'Legacy Archival', status: ProjectStatus.COMPLETED, budget: 5000, spent: 2000 },
        { name: 'Internal Audit', status: ProjectStatus.ON_HOLD, budget: 15000, spent: 1000 },
        { name: 'Client Portal', status: ProjectStatus.ACTIVE, budget: 120000, spent: 90000 }, // High utilization
        { name: 'Website Translation', status: ProjectStatus.COMPLETED, budget: 10000, spent: 10000 },
        { name: 'Security Audit', status: ProjectStatus.ACTIVE, budget: 30000, spent: 15000 },
        { name: 'Team Offsite', status: ProjectStatus.COMPLETED, budget: 5000, spent: 5000 }
    ];

    for (const p of dashboardProjects) {
        // Create Project
        const newProj = await prisma.project.create({
            data: {
                name: p.name,
                status: p.status,
                description: 'Generated for dashboard metrics.',
                createdById: userId,
                members: { create: { userId, role: UserRole.MANAGER } },
                startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                endDate: p.status === ProjectStatus.COMPLETED ? new Date() : new Date(new Date().setMonth(new Date().getMonth() + 2))
            }
        });

        // Add Budget
        await prisma.budget.create({
            data: {
                projectId: newProj.id,
                totalBudget: p.budget,
                createdById: userId,
                expenses: {
                    create: {
                        description: 'Initial Costs',
                        amount: p.spent,
                        status: ExpenseStatus.APPROVED,
                        expenseDate: new Date(),
                        category: 'Misc'
                    }
                }
            }
        });

        // Add Random Tasks
        const taskCount = 5;
        for (let i = 0; i < taskCount; i++) {
            const isDone = p.status === ProjectStatus.COMPLETED || Math.random() > 0.5;
            const t = await prisma.task.create({
                data: {
                    projectId: newProj.id,
                    title: `${p.name} Task ${i + 1}`,
                    status: isDone ? TaskStatus.DONE : TaskStatus.IN_PROGRESS,
                    priority: Math.random() > 0.7 ? TaskPriority.HIGH : TaskPriority.MEDIUM,
                    startDate: new Date(),
                    dueDate: isDone ? new Date() : new Date(new Date().setDate(new Date().getDate() + 10)),
                    createdById: userId,
                    assigneeId: userId,
                    // Add time entries?
                }
            });

            // Add Time Entry for some tasks
            if (i % 2 === 0) {
                await prisma.timeEntry.create({
                    data: {
                        taskId: t.id,
                        userId: userId,
                        startTime: new Date(),
                        duration: Math.floor(Math.random() * 300) + 60, // 1-6 hours
                        isBillable: true
                    }
                });
            }
        }
    }
    console.log('✅ Dashboard filler data seeded.');

    console.log('✅ Dashboard filler data seeded.');

    // 10. Seed Time Tracking History (Last 30 Days)
    console.log('⏱️ Seeding Time Tracking History...');
    const allTasks = await prisma.task.findMany({ where: { createdById: userId } });

    if (allTasks.length > 0) {
        const timeEntriesData = [];
        for (let i = 0; i < 50; i++) {
            const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            // Random duration 0.5h to 8h (30 to 480 mins)
            const duration = Math.floor(Math.random() * 450) + 30;
            const startTime = new Date(date);
            const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

            timeEntriesData.push({
                taskId: randomTask.id,
                userId: userId,
                startTime: startTime,
                endTime: endTime,
                description: `Work on ${randomTask.title} - Sesssion ${i}`,
                duration: duration,
                isBillable: Math.random() > 0.2 // 80% billable
            });
        }

        await prisma.timeEntry.createMany({
            data: timeEntriesData
        });
        console.log(`✅ Added ${timeEntriesData.length} historical time entries.`);
    } else {
        console.log('⚠️ No tasks found to attach time entries to.');
    }

    console.log('🎉 REAL Seeding Complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
