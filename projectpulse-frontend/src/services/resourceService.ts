import api from "./api";
import type { Resource, TeamStats } from "../types/resource";

export const resourceService = {
    getResources: async (): Promise<Resource[]> => {
        const response = await api.get("/resources");
        return response.data.data;
    },

    getTeamStats: async (): Promise<TeamStats> => {
        const response = await api.get("/resources/stats");
        return response.data.data;
    },

    createResource: async (data: any) => {
        const response = await api.post("/resources", data);
        return response.data.data;
    },

    assignResource: async (data: { resourceId: string, projectId: string, percentage: number, taskId?: string }) => {
        const response = await api.post("/resources/allocate", data);
        return response.data.data;
    },

    updateResource: async (id: string, data: any) => {
        const response = await api.put(`/resources/${id}`, data);
        return response.data.data;
    },

    deleteResource: async (id: string) => {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
};
