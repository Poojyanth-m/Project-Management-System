// Analytics & Reporting Types
export interface ProjectAnalytics {
    total: number;
    completed: number;
    active: number;
    delayed: number;
    onHold: number;
    completionRate: number;
}

export interface TaskAnalytics {
    total: number;
    completed: number;
    inProgress: number;
    toDo: number;
    overdue: number;
    onTime: number;
    completionRate: number;
}

export interface TimeAnalytics {
    loggedHours: number;
    plannedHours: number;
    billableHours: number;
    nonBillableHours: number;
    utilizationRate: number;
}

export interface BudgetAnalytics {
    totalBudget: number;
    spent: number;
    remaining: number;
    utilizationRate: number;
}

export interface TaskStatusDistribution {
    status: string;
    count: number;
    percentage: number;
    color: string;
}

export interface ProjectPerformance {
    projectName: string;
    completionRate: number;
    tasksCompleted: number;
    totalTasks: number;
    status: "On Track" | "At Risk" | "Delayed";
}

export interface AnalyticsDashboard {
    projects: ProjectAnalytics;
    tasks: TaskAnalytics;
    time: TimeAnalytics;
    budget: BudgetAnalytics;
    taskDistribution: TaskStatusDistribution[];
    projectPerformance: ProjectPerformance[];
    lastUpdated: string;
}

export interface ReportSummary {
    period: string;
    generated: string;
    overview: {
        totalProjects: number;
        completedProjects: number;
        totalTasks: number;
        completedTasks: number;
        totalHours: number;
        budgetUtilization: number;
    };
}
