import type { GanttTaskData } from "../types/gantt";

// Helper to generate dates relative to today
const today = new Date();
const addDays = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const MOCK_TASKS: Record<string, GanttTaskData[]> = {
    "1": [ // Website Redesign
        { id: "t1", name: "Project Kickoff", start: addDays(-5), end: addDays(-4), progress: 100, custom_class: "gantt-milestone" },
        { id: "t2", name: "Design Phase", start: addDays(-3), end: addDays(4), progress: 60, dependencies: ["t1"] },
        { id: "t3", name: "Frontend Dev", start: addDays(5), end: addDays(15), progress: 0, dependencies: ["t2"] },
        { id: "t4", name: "Backend Dev", start: addDays(5), end: addDays(20), progress: 0, dependencies: ["t2"] },
        { id: "t5", name: "QA & Testing", start: addDays(21), end: addDays(25), progress: 0, dependencies: ["t3", "t4"] },
        { id: "t6", name: "Launch", start: addDays(26), end: addDays(27), progress: 0, dependencies: ["t5"], custom_class: "gantt-milestone" }
    ],
    "2": [ // Mobile App
        { id: "m1", name: "Requirements", start: addDays(-10), end: addDays(-5), progress: 100 },
        { id: "m2", name: "UI Design", start: addDays(-4), end: addDays(2), progress: 80, dependencies: ["m1"] },
        { id: "m3", name: "Development", start: addDays(3), end: addDays(14), progress: 30, dependencies: ["m2"] }
    ]
};

export const ganttService = {
    getTasks: async (projectId: string): Promise<GanttTaskData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_TASKS[projectId] || []);
            }, 600);
        });
    }
};
