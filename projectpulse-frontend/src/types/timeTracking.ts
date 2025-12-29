export type TimeEntryStatus = "LOGGED" | "SUBMITTED";

export interface TimeEntry {
    id: string;
    userId: string;
    taskId?: string;
    taskName?: string; // For display if task details aren't fetched separately
    projectId: string; // Using string to match backend ID types usually, though ProjectContext uses number. I'll handle conversion.
    projectName: string;
    description: string;
    date: string;       // YYYY-MM-DD
    startTime?: string; // ISO
    endTime?: string;   // ISO
    durationMinutes: number;
    note?: string;
    status: TimeEntryStatus;
    billable: boolean;
}

export interface TimeSummary {
    dailyTotalMinutes: number;
    weeklyTotalMinutes: number;
    billableMinutes: number;
    totalSessions: number;
}
