import api from "./api";
import type { TimeEntry, TimeSummary } from "../types/timeTracking";

export const timeTrackingService = {
    // GET /time-tracking
    getTimeEntries: async (userId?: string, date?: string): Promise<TimeEntry[]> => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (date) {
            params.append('from', new Date(date).toISOString());
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            params.append('to', nextDay.toISOString());
        }

        const res = await api.get(`/time-tracking?${params.toString()}`);

        // Filter out running timers (entries with null endTime) and map the rest
        return res.data.data
            .filter((entry: any) => entry.endTime !== null) // Only include completed entries
            .map((entry: any) => {
                const startTime = new Date(entry.startTime);
                const endTime = new Date(entry.endTime);

                // Use backend's duration field if available, otherwise calculate
                let durationMinutes = 0;
                if (entry.duration !== undefined && entry.duration !== null) {
                    durationMinutes = entry.duration;
                } else if (entry.endTime && entry.startTime) {
                    const durationMs = endTime.getTime() - startTime.getTime();
                    durationMinutes = Math.round(durationMs / 1000 / 60);
                }

                return {
                    id: entry.id,
                    userId: entry.userId,
                    taskId: entry.taskId,
                    taskName: entry.task?.title || "Unknown Task",
                    projectId: entry.task?.projectId || "",
                    projectName: entry.task?.project?.name || "Unknown Project",
                    description: entry.description || "",
                    date: startTime.toISOString().split('T')[0],
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    durationMinutes: Math.max(0, durationMinutes), // Ensure no negative
                    status: "LOGGED",
                    billable: entry.isBillable ?? true
                };
            });
    },

    // POST /time-tracking/manual
    addTimeEntry: async (entry: Omit<TimeEntry, "id" | "status">): Promise<TimeEntry> => {
        const payload = {
            taskId: entry.taskId,
            description: entry.description,
            startTime: entry.startTime,
            endTime: entry.endTime,
            isBillable: entry.billable
        };

        const res = await api.post("/time-tracking/manual", payload);
        return {
            ...entry,
            id: res.data.data.id,
            status: "LOGGED"
        } as TimeEntry;
    },

    // Calculate summary client-side
    getSummary: async (range: "daily" | "weekly" | "monthly"): Promise<TimeSummary> => {
        const res = await api.get("/time-tracking");
        const entries = res.data.data;

        const now = new Date();

        // Filter out running timers (null endTime) first
        let filteredEntries = entries.filter((e: any) => e.endTime !== null);

        if (range === 'daily') {
            const todayStr = now.toISOString().split('T')[0];
            filteredEntries = filteredEntries.filter((e: any) => e.startTime.startsWith(todayStr));
        } else if (range === 'weekly') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredEntries = filteredEntries.filter((e: any) => new Date(e.startTime) >= oneWeekAgo);
        } else if (range === 'monthly') {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredEntries = filteredEntries.filter((e: any) => new Date(e.startTime) >= oneMonthAgo);
        }

        // Use backend duration field if available, otherwise calculate
        const totalMinutes = filteredEntries.reduce((acc: number, curr: any) => {
            let duration = 0;
            if (curr.duration !== undefined && curr.duration !== null) {
                duration = curr.duration;
            } else if (curr.endTime && curr.startTime) {
                duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / 1000 / 60;
            }
            return acc + duration;
        }, 0);

        const billableMinutes = filteredEntries
            .filter((e: any) => e.isBillable)
            .reduce((acc: number, curr: any) => {
                let duration = 0;
                if (curr.duration !== undefined && curr.duration !== null) {
                    duration = curr.duration;
                } else if (curr.endTime && curr.startTime) {
                    duration = (new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / 1000 / 60;
                }
                return acc + duration;
            }, 0);

        return {
            dailyTotalMinutes: range === 'daily' ? Math.round(totalMinutes) : 0,
            weeklyTotalMinutes: Math.round(totalMinutes),
            billableMinutes: Math.round(billableMinutes),
            totalSessions: filteredEntries.length
        };
    }
};

// Timer Utility Logic
export class Stopwatch {
    private startTime: number | null = null;
    private savedDuration: number = 0; // ms

    start() {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
    }

    pause() {
        if (this.startTime) {
            this.savedDuration += Date.now() - this.startTime;
            this.startTime = null;
        }
    }

    stop() {
        this.pause();
        const finalDuration = this.savedDuration;
        this.reset();
        return finalDuration; // ms
    }

    reset() {
        this.startTime = null;
        this.savedDuration = 0;
    }

    getElapsed(): number {
        if (this.startTime) {
            return this.savedDuration + (Date.now() - this.startTime);
        }
        return this.savedDuration;
    }

    isRunning(): boolean {
        return this.startTime !== null;
    }
}
