import { PrismaClient, ExpenseStatus } from '@prisma/client';

const prisma = new PrismaClient();

const EXPENSE_CATEGORIES = ['Infrastructure', 'Software Licenses', 'Marketing', 'Consulting', 'Travel', 'Office Supplies', 'Personnel', 'Training'];
const DESCRIPTIONS = [
    'AWS Cloud Hosting Q1',
    'Google Workspace Licenses',
    'Social Media Ad Campaign',
    'External Security Audit',
    'Team Offsite',
    'MacBook Pro Purchase',
    'Freelance Designer',
    'Jira/Confluence Subscription',
    'Database Optimization',
    'User Research Incentives'
];

async function main() {
    console.log('💰 Seeding Budgets & Expenses for ALL projects...');

    const user = await prisma.user.findFirst({ where: { email: 'poojyanthm@gmail.com' } });
    if (!user) {
        console.error('User not found');
        return;
    }

    const projects = await prisma.project.findMany({
        include: { budget: true }
    });

    for (const project of projects) {
        if (project.budget) {
            console.log(`Skipping ${project.name} (Already has budget)`);
            continue;
        }

        console.log(`Creating budget for: ${project.name}`);

        // Random Budget between 20k and 500k
        const totalBudget = Math.floor(Math.random() * 48 + 2) * 10000;

        // Create Budget
        const budget = await prisma.budget.create({
            data: {
                projectId: project.id,
                totalBudget: totalBudget,
                createdById: user.id,
                currency: 'USD'
            }
        });

        // Create 5-12 Expenses per project
        const numExpenses = Math.floor(Math.random() * 8) + 5;
        const expensesData = [];

        for (let i = 0; i < numExpenses; i++) {
            const amount = Math.floor(Math.random() * 5000) + 100;
            const isApproved = Math.random() > 0.3; // 70% approved
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Past 60 days

            expensesData.push({
                budgetId: budget.id,
                description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
                amount: amount,
                category: EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)],
                status: isApproved ? ExpenseStatus.APPROVED : ExpenseStatus.PENDING,
                expenseDate: date
            });
        }

        await prisma.expense.createMany({
            data: expensesData
        });

        console.log(`   -> Added ${numExpenses} expenses.`);
    }

    console.log('✅ Budget seeding complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
