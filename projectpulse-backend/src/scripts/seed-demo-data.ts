import { PrismaClient, UserRole, ProjectStatus, TaskStatus, TaskPriority, ExpenseStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding for demo data...');

    // 1. Ensure User
    const email = 'demo@projectpulse.com';
    // Using a known password hash for 'Demo123' to speed up seeding
    // const password = 'Demo123';
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Actually, let's look for ANY user first, so we don't force a specific login if they are using their own.
    let user = await prisma.user.findFirst();

    if (!user) {
        console.log('No users found. Creating demo user...');
        const hashedPassword = await bcrypt.hash('Demo123', 10);
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: 'Demo',
                lastName: 'User',
                role: UserRole.MANAGER,
            }
        });
        console.log(`✅ User created: ${email} / Demo123`);
    } else {
        console.log(`ℹ️ Using existing user: ${user.email}`);
    }

    // 2. Create Demo Project
    const projectName = 'Website Redesign 2025';
    let project = await prisma.project.findFirst({
        where: { name: projectName }
    });

    if (!project) {
        console.log('creating project...');
        project = await prisma.project.create({
            data: {
                name: projectName,
                description: 'Full overhaul of corporate website with modern tech stack.',
                status: ProjectStatus.ACTIVE,
                createdById: user.id,
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 90)), // +90 days
                members: {
                    create: {
                        userId: user.id,
                        role: UserRole.MANAGER
                    }
                }
            }
        });
        console.log(`✅ Project created: ${project.name}`);
    } else {
        console.log(`ℹ️ Project already exists: ${project.name}`);
    }

    // 3. Create Tasks
    const existingTasks = await prisma.task.count({ where: { projectId: project.id } });
    if (existingTasks === 0) {
        console.log('creating tasks...');
        const tasksData = [
            {
                title: 'Design Wireframes',
                status: TaskStatus.DONE,
                priority: TaskPriority.HIGH,
                dueDate: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
                completedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
            },
            {
                title: 'Backend API Setup',
                status: TaskStatus.IN_PROGRESS,
                priority: TaskPriority.HIGH,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            },
            {
                title: 'Frontend Component Library',
                status: TaskStatus.IN_PROGRESS,
                priority: TaskPriority.MEDIUM,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            },
            {
                title: 'User Testing',
                status: TaskStatus.TODO,
                priority: TaskPriority.LOW,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 20)),
            },
            {
                title: 'Deployment Scripts',
                status: TaskStatus.BLOCKED,
                priority: TaskPriority.MEDIUM,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            }
        ];

        for (const t of tasksData) {
            await prisma.task.create({
                data: {
                    ...t,
                    projectId: project.id,
                    createdById: user.id,
                    assigneeId: user.id,
                }
            });
        }
        console.log(`✅ Created ${tasksData.length} sample tasks`);
    }

    // 4. Budget & Expenses
    const budget = await prisma.budget.findUnique({ where: { projectId: project.id } });
    if (!budget) {
        console.log('creating budget...');
        const newBudget = await prisma.budget.create({
            data: {
                projectId: project.id,
                totalBudget: 50000,
                createdById: user.id,
                expenses: {
                    create: [
                        {
                            description: 'Figma License',
                            amount: 150.00,
                            status: ExpenseStatus.APPROVED,
                            expenseDate: new Date(),
                            category: 'Software'
                        },
                        {
                            description: 'Freelance Designer',
                            amount: 2500.00,
                            status: ExpenseStatus.PENDING,
                            expenseDate: new Date(),
                            category: 'Contractor'
                        }
                    ]
                }
            }
        });
        console.log(`✅ Created budget: $${newBudget.totalBudget}`);
    }

    // 5. Time Entries
    const tasks = await prisma.task.findMany({ where: { projectId: project.id } });
    const existingTime = await prisma.timeEntry.count({ where: { userId: user.id } });

    if (existingTime === 0 && tasks.length > 0) {
        console.log('creating time entries...');
        await prisma.timeEntry.createMany({
            data: [
                {
                    userId: user.id,
                    taskId: tasks[0].id,
                    startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
                    duration: 120, // 2 hours
                    isBillable: true
                },
                {
                    userId: user.id,
                    taskId: tasks[1].id,
                    startTime: new Date(),
                    duration: 240, // 4 hours
                    isBillable: true
                },
                {
                    userId: user.id,
                    taskId: tasks[1].id,
                    startTime: new Date(),
                    duration: 60, // 1 hour
                    isBillable: false
                }
            ]
        });
        console.log(`✅ Created sample time entries`);
    }

    console.log('🎉 Seeding complete!');
    console.log(`\n👉 Login with: ${user.email}`);
    console.log(`👉 If you didn't change the password, check database or use the Forgot Password flow.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
