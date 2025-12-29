import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { getProjects, createProject, deleteProject as deleteProjectService } from "../services/projectService";

export interface Project {
    id: string | number;
    name: string;
    description?: string; // Added to match backend
    category: string;
    progress: number;
    status: "Active" | "Completed" | "On Hold" | string; // Loosened for backend compatibility
    dueDate: string;
    members: number;
    startDate?: string;
}

// Simple Task interface for dashboard stats
export interface Task {
    id: number;
    title: string;
    status: "To Do" | "In Progress" | "Done";
}

interface ProjectContextType {
    projects: Project[];
    tasks: Task[];
    addProject: (project: any) => Promise<void>;
    updateProjectStatus: (id: string | number, status: Project["status"]) => void;
    updateProject: (id: string | number, updatedFields: Partial<Project>) => void;
    deleteProject: (id: string | number) => Promise<void>;
    // Derived stats could be calculated in components or here. 
    // Let's keep it simple and calculate in components for flexibility or provide helper getters.
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);



const initialTasks: Task[] = [
    { id: 1, title: "Design System", status: "In Progress" },
    { id: 2, title: "API Integration", status: "To Do" },
    { id: 3, title: "Unit Tests", status: "Done" },
    // Mocking a few more for stats
    ...Array(83).fill(null).map((_, i) => ({ id: i + 4, title: `Task ${i}`, status: i % 3 === 0 ? "Done" : "In Progress" } as Task))
];

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks] = useState<Task[]>(initialTasks);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                const savedCounts = JSON.parse(localStorage.getItem('project_member_counts') || '{}');
                // Map backend data to frontend model if necessary, or just set it
                // Backend fields might slightly differ, ensuring compatibility:
                // Backend: id, name, description, status, startDate, endDate...
                // Frontend expects: category, progress, members (which might be missing or different)
                const mappedProjects: Project[] = data.map((p: any) => ({
                    ...p,
                    category: p.category || "General", // Default if missing
                    progress: p.progress || 0,
                    members: savedCounts[p.id] || p.members?.length || 0, // Prefer saved mock count
                    dueDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : "",
                }));
                setProjects(mappedProjects);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        fetchProjects();
    }, []);

    const addProject = async (projectData: any) => {
        try {
            // Remove mock integer memberIds before sending to backend
            const { memberIds, ...apiPayload } = projectData;

            // Only attach memberIds if they are valid UUID strings (real users)
            if (Array.isArray(memberIds) && memberIds.some(id => typeof id === 'string')) {
                (apiPayload as any).memberIds = memberIds.filter(id => typeof id === 'string');
            }

            const newProject = await createProject(apiPayload);

            // Persist mock member count to LocalStorage
            const mockMemberCount = projectData.memberIds?.length;
            if (mockMemberCount) {
                const savedCounts = JSON.parse(localStorage.getItem('project_member_counts') || '{}');
                savedCounts[newProject.id] = mockMemberCount;
                localStorage.setItem('project_member_counts', JSON.stringify(savedCounts));
            }

            // Re-fetch or append
            const mappedProject: Project = {
                ...newProject,
                category: projectData.category || "General",
                progress: 0,
                members: mockMemberCount || 1, // Default to 1 (creator) if no members passed
                dueDate: newProject.endDate ? new Date(newProject.endDate).toISOString().split('T')[0] : "",
            };
            setProjects((prev) => [mappedProject, ...prev]);
        } catch (error) {
            console.error("Failed to create project", error);
            throw error;
        }
    };

    const updateProjectStatus = (id: string | number, status: Project["status"]) => {
        setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
    };

    const updateProject = (id: string | number, updatedFields: Partial<Project>) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    };

    const deleteProject = async (id: string | number) => {
        try {
            await deleteProjectService(id);
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, tasks, addProject, updateProjectStatus, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjectContext must be used within a ProjectProvider");
    }
    return context;
};
