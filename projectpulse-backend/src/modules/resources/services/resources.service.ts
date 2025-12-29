import prisma from '../../../config/database';
import { ResourceType } from '@prisma/client';

export class ResourcesService {
    /**
     * Get all resources with calculated utilization and project info
     */
    async getAllResources() {
        const resources = await prisma.resource.findMany({
            include: {
                allocations: {
                    where: {
                        endDate: { gte: new Date() }, // Active allocations only
                        startDate: { lte: new Date() }
                    },
                    include: {
                        project: true,
                        task: true
                    }
                }
            }
        });

        return resources.map(res => {
            const utilization = res.allocations.reduce((sum, alloc) => sum + alloc.allocationPercentage, 0);



            // Allow override if manually set to ACTIVE/INACTIVE? 
            // For now, computed status is better for the UI "Status" badge logic unless 'status' field is strictly 'ACTIVE'/'ARCHIVED'.
            // The DB 'status' field is Active/Archived/OnLeave. utilization is separate.
            // But frontend expects "BUSY", "OVERLOADED". 
            // I'll map DB status + utilization to Frontend Status string.
            // Actually, frontend uses 'ResourceStatus' type which matches DB enum?
            // DB Enum: ACTIVE, INACTIVE, ON_LEAVE, ARCHIVED.
            // Frontend UI Helper `getStatusColor` handles: OVERLOADED, BUSY, PARTIALLY_ALLOCATED, AVAILABLE.
            // So I should return a `computedStatus` or map it.
            // For this response, I'll update the `status` field in the return object to match UI expectations.

            let uiStatus = "AVAILABLE";
            if (utilization > 100) uiStatus = "OVERLOADED";
            else if (utilization === 100) uiStatus = "BUSY";
            else if (utilization > 0) uiStatus = "PARTIALLY_ALLOCATED";

            const projectNames = Array.from(
                new Set(
                    res.allocations
                        .map(a => a.project?.name)
                        .filter((name): name is string => name != null)
                )
            );
            const activeTasks = res.allocations.filter(a => a.taskId).length;

            return {
                userId: res.id, // Frontend uses userId as key
                name: res.name,
                role: "Team Member", // Default role, maybe add 'role' to Resource model? Assuming 'type' or Generic.
                avatar: "",
                status: uiStatus, // Mapped for UI
                utilization, // Percentage
                projectNames,
                activeTasks,
                type: res.type
            };
        });
    }

    /**
     * Get team statistics
     */
    async getStats() {
        const allResources = await this.getAllResources();

        const totalResources = allResources.length;
        const available = allResources.filter(r => r.utilization < 100).length;
        const overallocated = allResources.filter(r => r.utilization > 100).length;
        const avgUtilization = totalResources > 0
            ? Math.round(allResources.reduce((sum, r) => sum + r.utilization, 0) / totalResources)
            : 0;

        return {
            totalResources,
            available,
            overallocated,
            avgUtilization
        };
    }

    /**
     * Create a resource (Invite User -> creates Resource)
     * For now, standalone resource creation
     */
    async createResource(data: { name: string; type?: ResourceType; costPH?: number }) {
        return prisma.resource.create({
            data: {
                name: data.name,
                type: data.type || ResourceType.HUMAN,
                costPH: data.costPH,
                status: 'ACTIVE'
            }
        });
    }

    /**
     * Assign resource (Create Allocation)
     */
    async createAllocation(data: { resourceId: string; projectId: string; taskId?: string; percentage: number; startDate?: Date; endDate?: Date }) {
        return prisma.resourceAllocation.create({
            data: {
                resourceId: data.resourceId,
                projectId: data.projectId,
                taskId: data.taskId,
                allocationPercentage: data.percentage,
                startDate: data.startDate || new Date(),
                endDate: data.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month
            }
        });
    }

    /**
     * Update resource or allocation
     * Strictly, this updates the Resource entity.
     */
    async updateResource(id: string, data: any) {
        return prisma.resource.update({
            where: { id },
            data
        });
    }

    /**
     * Delete resource
     */
    async deleteResource(id: string) {
        // Cascade delete allocations? Prisma handles if configured, else manual.
        return prisma.resource.delete({
            where: { id }
        });
    }
}

export const resourcesService = new ResourcesService();
