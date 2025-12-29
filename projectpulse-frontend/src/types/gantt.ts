export interface GanttTaskData {
    id: string;
    name: string;
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
    progress: number;
    dependencies?: string[]; // Array of IDs
    custom_class?: string;
}

export type ViewMode = "Day" | "Week" | "Month";
