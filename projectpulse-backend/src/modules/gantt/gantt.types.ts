import { TaskStatus, TaskPriority } from '@prisma/client';

export interface GanttTaskResponse {
    id: string;
    projectId: string;
    title: string;
    startDate: Date | null;
    dueDate: Date | null; // End Date
    duration: number | null;
    progress: number;
    status: TaskStatus;
    priority: TaskPriority;
    parentTaskId: string | null;
    dependencies: string[]; // IDs of tasks this task VALIDLY depends on (Predecessors)
    assignee: {
        id: string;
        fullName: string;
        avatar: string | null;
    } | null;
}

export interface DependencyRequest {
    taskId: string;        // Successor (The task that is blocked/depends on another)
    dependsOnTaskId: string; // Predecessor (The blocking task)
}
