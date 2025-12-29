export type ResourceStatus = "AVAILABLE" | "BUSY" | "PARTIALLY_ALLOCATED" | "OVERLOADED";

export interface Resource {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
    status: string;
    utilization: number;
    projectNames: string[];
    activeTasks: number;
    type?: string;
}

export interface TeamStats {
    totalResources: number;
    available: number;
    overallocated: number;
    avgUtilization: number;
}
