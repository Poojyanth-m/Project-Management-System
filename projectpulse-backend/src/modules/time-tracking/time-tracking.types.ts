// Time Entry Response
export interface TimeEntryResponse {
    id: string;
    userId: string;
    taskId: string;
    description: string | null;
    startTime: Date;
    endTime: Date | null;
    duration: number | null; // in minutes
    isBillable: boolean;
    createdAt: Date;
    updatedAt: Date;
    task: {
        id: string;
        title: string;
        project: {
            id: string;
            name: string;
        };
    };
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

// Request Types
export interface StartTimerRequest {
    taskId: string;
    description?: string;
    isBillable?: boolean;
    startTime?: Date; // Optional, defaults to now
}

export interface StopTimerRequest {
    endTime?: Date; // Optional, defaults to now
    description?: string;
}

export interface ManualEntryRequest {
    taskId: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    isBillable?: boolean;
}

export interface UpdateTimeEntryRequest {
    description?: string;
    startTime?: Date;
    endTime?: Date;
    isBillable?: boolean;
}
