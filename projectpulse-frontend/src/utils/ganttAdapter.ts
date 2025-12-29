import type { GanttTaskData } from "../types/gantt";

// Define what Frappe Gantt expects
export interface FrappeTask {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string; // Comma separated IDs
    custom_class?: string;
}

export const adaptTasksForGantt = (tasks: GanttTaskData[]): FrappeTask[] => {
    return tasks.map(t => ({
        id: t.id,
        name: t.name,
        start: t.start,
        end: t.end,
        progress: t.progress,
        dependencies: t.dependencies ? t.dependencies.join(", ") : "",
        custom_class: t.custom_class
    }));
};
