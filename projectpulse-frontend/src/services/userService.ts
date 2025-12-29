import api from "./api";

export const userService = {
    getMe: async () => {
        const res = await api.get("/users/me");
        return res.data.data;
    },

    getUsers: async () => {
        const res = await api.get("/users");
        return res.data.data;
    },

    updateMe: async (data: any) => {
        const res = await api.patch("/users/me", data);
        return res.data.data;
    },

    updateUser: async (id: string, data: any) => {
        const res = await api.patch(`/users/${id}`, data);
        return res.data.data;
    },

    deleteUser: async (id: string) => {
        const res = await api.delete(`/users/${id}`);
        return res.data;
    }
};

export const getMe = userService.getMe;
