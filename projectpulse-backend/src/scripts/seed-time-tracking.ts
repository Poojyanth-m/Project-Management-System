import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Starting Time Tracking seed...');

        // 1. Get users
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            console.log("No users found. Skipping.");
            return;
        }

        // 2. Get projects with tasks
        const projects = await prisma.project.findMany({
            include: { tasks: true }
        });

        if (projects.length === 0) {
            console.log("No projects found. Skipping.");
            return;
        }

        console.log(`Found ${projects.length} projects and ${users.length} users.`);

        // 3. Generate time entries for the CURRENT WEEK (Mon-Sun) to populate Timesheet
        // Today is likely Monday Dec 29 2025 based on context.
        // We want to fill this specific week so the "Weekly Timesheet" looks good.

        const now = new Date();
        const currentDay = now.getDay(); // 0-6
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        // Generate logs for 7 days starting from Monday
        const weekOffsets = Array.from({ length: 7 }, (_, i) => i);

        console.log(`Seeding data for week of: ${monday.toISOString().split('T')[0]}`);

        let entryCount = 0;

        for (const project of projects) {
            if (project.tasks.length === 0) {
                console.log(`Project ${project.name} has no tasks. Skipping.`);
                continue;
            }

            console.log(`Seeding time for project: ${project.name}`);

            for (const user of users) {
                // Determine if user works on this project (simple random logic or just all)
                if (Math.random() > 0.6) continue;

                for (const dayIndex of weekOffsets) {
                    // Skip weekends sometimes (Sat=5, Sun=6)
                    if (dayIndex > 4 && Math.random() > 0.3) continue;

                    // 70% chance to log time on a weekday
                    if (Math.random() > 0.3) {
                        const date = new Date(monday);
                        date.setDate(monday.getDate() + dayIndex);
                        // Start hour 9-11 AM
                        date.setHours(9 + Math.floor(Math.random() * 3), 0, 0, 0);

                        // Pick 1-2 tasks
                        const numTasks = Math.floor(Math.random() * 2) + 1;
                        const shuffledTasks = [...project.tasks].sort(() => 0.5 - Math.random());
                        const selectedTasks = shuffledTasks.slice(0, numTasks);

                        let currentStartTime = new Date(date);

                        for (const task of selectedTasks) {
                            // Duration: 1h to 4h
                            const durationMinutes = Math.floor(Math.random() * (240 - 60 + 1)) + 60;
                            const endTime = new Date(currentStartTime.getTime() + durationMinutes * 60000);

                            const descriptions = [
                                `Working on ${task.title}`,
                                `Continued development of ${task.title}`,
                                `Team sync for ${task.title}`,
                                `Client feedback implementation: ${task.title}`
                            ];
                            const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

                            await prisma.timeEntry.create({
                                data: {
                                    userId: user.id,
                                    taskId: task.id,
                                    startTime: currentStartTime,
                                    endTime: endTime,
                                    duration: durationMinutes,
                                    description: randomDesc,
                                    isBillable: true
                                }
                            });
                            entryCount++;

                            // Advance time
                            currentStartTime = new Date(endTime.getTime() + 30 * 60000);
                        }
                    }
                }
            }
        }

        console.log(`Successfully created ${entryCount} time entries.`);

    } catch (error) {
        console.error('Error seeding time tracking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
