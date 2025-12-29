import api from "./api";

export const getTasks = async (filters?: {
    projectId?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
}) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);

    const res = await api.get(`/tasks?${params.toString()}`);
    return res.data.data;
};

export const getTaskById = async (id: string) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data;
};

export const createTask = async (payload: {
    title: string;
    description?: string;
    projectId: string;
    assigneeId?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    dueDate?: string;
}) => {
    const res = await api.post("/tasks", payload);
    return res.data.data;
};

export const updateTask = async (id: string, payload: any) => {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data.data;
};

export const deleteTask = async (id: string) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
};
