export type EntityType = "TASK" | "PROJECT";

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Comment {
    id: string;
    entityType: EntityType;
    entityId: string;
    userId: string;
    user: User; // Expanded for UI
    message: string;
    createdAt: string; // ISO
}

export interface Activity {
    id: string;
    entityType: EntityType;
    entityId: string;
    userId: string;
    user: User;
    action: "CREATED" | "UPDATED_STATUS" | "ASSIGNED" | "COMMENTED";
    details?: string;
    createdAt: string;
}

export interface Mention {
    id: string;
    display: string;
}
