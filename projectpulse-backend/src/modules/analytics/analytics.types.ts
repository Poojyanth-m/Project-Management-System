import { ProjectStatus, TaskStatus, TaskPriority } from '@prisma/client';

export interface DashboardStatsResponse {
    projects: {
        total: number;
        active: number;
        completed: number;
        statusDistribution: Record<ProjectStatus, number>;
    };
    tasks: {
        total: number;
        active: number;
        completed: number;
        overdue: number;
        statusDistribution: Record<TaskStatus, number>;
        priorityDistribution: Record<TaskPriority, number>;
    };
    // Flat aliases for frontend compatibility
    totalProjects: number;
    completedProjects: number;
    ongoingProjects: number;
    delayedProjects: number;
    activeTasks: number;
    totalMembers: number;
    // Original fields
    teamMembers: number;
    completionRate: number;
    timeTracking: {
        totalHoursLogged: number;
        billableHours: number;
        thisWeekHours: number;
    };
    budget: {
        totalBudgeted: number;
        totalSpent: number;
        utilizationPercentage: number;
    };
    recentActivities: ActivityLogResponse[];

    // New Sections for Dashboard
    upcomingDeadlines: {
        id: string;
        title: string;
        dueDate: Date | null;
        status: string; // 'Delayed', 'At risk', 'On going'
        priority: string;
    }[];
    teamWorkload: {
        userId: string;
        name: string;
        avatar: string | null;
        completedTaskCount: number; // or percentage
        totalTaskCount: number;
        workloadPercentage: number;
    }[];
    filters: {
        projects: { id: string; name: string }[];
        managers: { id: string; name: string }[];
        statuses: string[];
    };
}

export interface ActivityLogResponse {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    createdAt: Date;
    user: {
        firstName: string;
        lastName: string;
        avatar: string | null;
    };
    metadata?: any;
}

export interface ProjectAnalyticsResponse {
    projectId: string;
    taskProgress: number; // percentage
    tasksByStatus: Record<TaskStatus, number>;
    tasksByAssignee: Record<string, number>; // assigneeName -> count
    burnDownData: { date: string; remainingTasks: number }[];
    budget: {
        total: number;
        spent: number;
        remaining: number;
        expensesByCategory: Record<string, number>;
    };
}

export interface AnalyticsQueryRequest {
    startDate?: Date;
    endDate?: Date;
    projectId?: string;
}
