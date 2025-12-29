import api from './api';

export interface UserSettings {
    id: string;
    userId: string;
    marketingEmails: boolean;
    productUpdates: boolean;
    commentsNotifications: boolean;
    assignmentsNotifications: boolean;
    weeklyDigest: boolean;
    theme: string;
    language: string;
}

export const settingsService = {
    getSettings: async () => {
        const response = await api.get('/users/me/settings');
        return response.data.data as UserSettings;
    },

    updateSettings: async (settings: Partial<UserSettings>) => {
        const response = await api.patch('/users/me/settings', settings);
        return response.data.data as UserSettings;
    },

    changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
        const response = await api.post('/users/me/change-password', passwords);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/users/me');
        return response.data;
    }
};
