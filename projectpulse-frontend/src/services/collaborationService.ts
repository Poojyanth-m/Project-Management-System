import type { Comment, Activity, User, EntityType } from "../types/collaboration";

const MOCK_USERS: User[] = [
    { id: "u1", name: "Alice Johnson", avatar: "" },
    { id: "u2", name: "Bob Smith", avatar: "" },
    { id: "u3", name: "Charlie Brown", avatar: "" },
    { id: "u4", name: "Diana Prince", avatar: "" },
];

const CURRENT_USER: User = MOCK_USERS[0]; // Simulator

let MOCK_COMMENTS: Comment[] = [
    {
        id: "c1",
        entityType: "TASK",
        entityId: "1",
        userId: "u2",
        user: MOCK_USERS[1],
        message: "Can we check the contrast on the secondary buttons?",
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "c2",
        entityType: "TASK",
        entityId: "1",
        userId: "u1",
        user: MOCK_USERS[0],
        message: "Sure, updated the palette.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
    }
];

let MOCK_ACTIVITIES: Activity[] = [
    {
        id: "a1",
        entityType: "TASK",
        entityId: "1",
        userId: "u3",
        user: MOCK_USERS[2],
        action: "CREATED",
        createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: "a2",
        entityType: "TASK",
        entityId: "1",
        userId: "u1",
        user: MOCK_USERS[0],
        action: "UPDATED_STATUS",
        details: "Changed status to In Progress",
        createdAt: new Date(Date.now() - 90000000).toISOString()
    }
];

export const collaborationService = {
    getComments: async (entityType: EntityType, entityId: string): Promise<Comment[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_COMMENTS.filter(c => c.entityType === entityType && c.entityId === entityId)
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
            }, 400);
        });
    },

    postComment: async (entityType: EntityType, entityId: string, message: string): Promise<Comment> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newComment: Comment = {
                    id: Date.now().toString(),
                    entityType,
                    entityId,
                    userId: CURRENT_USER.id,
                    user: CURRENT_USER,
                    message,
                    createdAt: new Date().toISOString()
                };
                MOCK_COMMENTS = [...MOCK_COMMENTS, newComment];

                // Also add activity
                const newActivity: Activity = {
                    id: `act_${Date.now()}`,
                    entityType,
                    entityId,
                    userId: CURRENT_USER.id,
                    user: CURRENT_USER,
                    action: "COMMENTED",
                    createdAt: new Date().toISOString()
                };
                MOCK_ACTIVITIES = [newActivity, ...MOCK_ACTIVITIES];

                resolve(newComment);
            }, 300);
        })
    },

    getActivities: async (entityType: EntityType, entityId: string): Promise<Activity[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_ACTIVITIES.filter(a => a.entityType === entityType && a.entityId === entityId)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }, 400);
        });
    },

    getUsers: async (): Promise<User[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 200));
    },

    getCurrentUser: () => CURRENT_USER
};
