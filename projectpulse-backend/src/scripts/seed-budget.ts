import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Budgets and Expenses...");

    // 1. Get projects
    const projects = await prisma.project.findMany();
    if (projects.length === 0) return console.log("No projects found.");

    let budgetCount = 0;
    let expenseCount = 0;

    for (const project of projects) {
        // Create or Update Budget
        // Random budget between 10k and 1m
        const totalBudget = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;

        const budget = await prisma.budget.upsert({
            where: { projectId: project.id },
            update: {},
            create: {
                projectId: project.id,
                totalBudget: totalBudget,
                currency: "USD",
                createdById: project.createdById // Assuming createdById is available on project (it is)
            }
        });
        budgetCount++;

        // Create 2-5 expenses
        const numExpenses = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < numExpenses; i++) {
            const amount = Math.floor(Math.random() * (totalBudget / 10)); // up to 10% of budget

            const categories = ["Software", "Marketing", "Personnel", "Hardware", "Travel", "Other"];
            const category = categories[Math.floor(Math.random() * categories.length)];

            const titles = [
                `Payment for ${category} service`,
                `Q1 ${category} Budget`,
                `Emergency ${category} expense`,
                `Subscription renewal`
            ];
            const title = titles[Math.floor(Math.random() * titles.length)];

            // Reduce date by random days (0-60)
            const expenseDate = new Date();
            expenseDate.setDate(expenseDate.getDate() - Math.floor(Math.random() * 60));

            await prisma.expense.create({
                data: {
                    budgetId: budget.id,
                    description: title,
                    amount: amount,
                    category: category,
                    expenseDate: expenseDate,
                    status: (Math.random() > 0.2) ? "APPROVED" : "PENDING"
                }
            });
            expenseCount++;
        }
    }

    console.log(`Created ${budgetCount} budgets and ${expenseCount} expenses.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
