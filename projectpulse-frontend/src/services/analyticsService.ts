import api from "./api";

export const getDashboardStats = async () => {
    const res = await api.get("/analytics/dashboard");
    return res.data.data;
};

// --- Additions for Analytics Page ---

export const getDashboard = async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await api.get("/analytics/dashboard", { params });
    return res.data.data;
};

export const exportReport = async (startDate: string, endDate: string) => {
    // Client-side export for demo purposes
    // 1. Fetch data
    const data = await getDashboard(startDate, endDate);

    // 2. Convert to CSV
    const rows = [
        ["Metric", "Value"],
        ["Total Projects", data.projects.total],
        ["Completed Projects", data.projects.completed],
        ["Total Hours Logged", data.time.loggedHours],
        ["Budget Spent", data.budget.spent],
        ["Tasks Completed", data.tasks.completed]
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

    // 3. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
};

export const downloadSummary = async (startDate: string, endDate: string) => {
    // Reuse export logic for summary
    return exportReport(startDate, endDate);
};
