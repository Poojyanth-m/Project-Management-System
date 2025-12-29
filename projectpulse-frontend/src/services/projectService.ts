import api from "./api";

export const getProjects = async () => {
    const res = await api.get("/projects");
    return res.data.data;
};

export const createProject = async (payload: {
    name: string;
    description?: string;
    status?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    memberIds?: number[]; // Added this to match usage
}) => {
    const res = await api.post("/projects", payload);
    return res.data.data;
};

export const deleteProject = async (id: string | number) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
};
