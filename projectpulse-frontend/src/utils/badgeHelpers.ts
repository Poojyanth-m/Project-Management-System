import type { BadgeVariant } from "../components/common/StatusBadge";

// Map project/task status to badge variant
export const getStatusBadgeVariant = (status: string): BadgeVariant => {
    const statusLower = status.toLowerCase();

    // Red - High priority, Delayed, Blocked, At Risk
    if (statusLower.includes("high") ||
        statusLower.includes("delayed") ||
        statusLower.includes("blocked") ||
        statusLower.includes("at risk")) {
        return "red";
    }

    // Yellow - Medium priority, In Progress, On going
    if (statusLower.includes("medium") ||
        statusLower.includes("in progress") ||
        statusLower.includes("on going") ||
        statusLower.includes("ongoing")) {
        return "yellow";
    }

    // Green - Low priority, Completed, Done
    if (statusLower.includes("low") ||
        statusLower.includes("completed") ||
        statusLower.includes("done")) {
        return "green";
    }

    // Grey - To Do, Pending, default
    return "grey";
};

// Map priority to badge variant
export const getPriorityBadgeVariant = (priority: string): BadgeVariant => {
    const priorityLower = priority.toLowerCase();

    if (priorityLower === "high") return "red";
    if (priorityLower === "medium") return "yellow";
    if (priorityLower === "low") return "green";

    return "grey";
};
