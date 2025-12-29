import { useState, useEffect, useRef } from "react";
import { Box, Typography, Select, MenuItem, ToggleButton, ToggleButtonGroup, Paper } from "@mui/material";
import { ViewWeek, CalendarViewMonth, CalendarViewDay } from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import { useProjectContext } from "../../context/ProjectContext";
import { getTasks } from "../../services/taskService";
import { adaptTasksForGantt } from "../../utils/ganttAdapter";
import type { ViewMode, GanttTaskData } from "../../types/gantt";

// Import Frappe Gantt and its CSS
// @ts-ignore
import Gantt from "frappe-gantt";
import "../../assets/frappe-gantt.css";

const Timeline = () => {
    const { projects } = useProjectContext();
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>("Week");
    const ganttRef = useRef<any>(null);

    const ganttContainerRef = useRef<HTMLDivElement>(null);

    // Initialize selected project
    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(String(projects[0].id));
        }
    }, [projects]);

    // Initial Load & Project Change
    useEffect(() => {
        if (selectedProjectId) {
            loadGantt();
        }
    }, [selectedProjectId]);

    // View Mode Change
    useEffect(() => {
        if (ganttRef.current) {
            ganttRef.current.change_view_mode(viewMode);
        }
    }, [viewMode]);

    const loadGantt = async () => {
        if (!ganttContainerRef.current) return;

        // Clear previous
        ganttContainerRef.current.innerHTML = "";

        try {
            const apiTasks = await getTasks({ projectId: selectedProjectId });

            const tasks: GanttTaskData[] = apiTasks.map((t: any) => {
                // Default dates if missing
                const startDate = t.startDate ? new Date(t.startDate) : new Date();
                const endDate = t.dueDate ? new Date(t.dueDate) : new Date(startDate.getTime() + 86400000); // +1 day

                return {
                    id: String(t.id),
                    name: t.title,
                    start: startDate.toISOString().split('T')[0],
                    end: endDate.toISOString().split('T')[0],
                    progress: t.progress || 0,
                    dependencies: [] // Backend currently doesn't provide dependencies in compatible format
                };
            });

            const adaptedTasks = adaptTasksForGantt(tasks);

            if (adaptedTasks.length === 0) {
                ganttContainerRef.current.innerHTML = `
                    <div style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 400px;
                        color: #666666;
                        font-family: 'Aeonik Pro TRIAL', sans-serif;
                        font-size: 1rem;
                    ">
                        No tasks found for this project.
                    </div>
                `;
                return;
            }

            ganttRef.current = new Gantt(ganttContainerRef.current, adaptedTasks, {
                header_height: 50,
                column_width: 30,
                step: 24,
                view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
                bar_height: 25,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                view_mode: viewMode,
                date_format: 'YYYY-MM-DD',
                custom_popup_html: function (task: any) {
                    // Custom tooltip matching our design system
                    return `
                        <div style="
                            width: 200px;
                            padding: 12px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            border: 1px solid #eee;
                            font-family: 'Inter', sans-serif;
                            z-index: 1000;
                        ">
                            <div style="font-weight: 700; color: #1A1A1A; margin-bottom: 4px;">${task.name}</div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                                ${task.start} - ${task.end}
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="flex: 1; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                                    <div style="width: ${task.progress}%; height: 100%; background: #E65F2B;"></div>
                                </div>
                                <div style="font-size: 11px; font-weight: 600; color: #E65F2B;">${task.progress}%</div>
                            </div>
                        </div>
                    `;
                }
            });

            // Scroll to the first task
            setTimeout(() => {
                const firstBar = ganttContainerRef.current?.querySelector(".bar-wrapper");
                if (firstBar) {
                    const container = ganttContainerRef.current?.parentElement;
                    if (container) {
                        const offset = (firstBar as HTMLElement).offsetLeft - 50;
                        container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
                    }
                }
            }, 300);

        } catch (error) {
            console.error("Failed to load Gantt data:", error);
            ganttContainerRef.current.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 400px;
                    color: #EF4444;
                    font-family: 'Aeonik Pro TRIAL', sans-serif;
                ">
                    Failed to load timeline data.
                </div>
            `;
        }
    };

    const handleViewChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
        if (newMode) setViewMode(newMode);
    };

    return (
        <Box sx={{ pb: 8, height: "100%", display: "flex", flexDirection: "column" }}>
            <TopBar title="Timeline" />

            {/* Unified Gantt Card */}
            <Box sx={{ flex: 1, p: 3, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <Paper sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    bgcolor: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    overflow: "hidden"
                }}>
                    {/* Controls Header */}
                    <Box sx={{
                        px: 3, py: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        bgcolor: "white"
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography variant="body2" fontWeight={600} color="text.secondary">Project:</Typography>
                            <Select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                size="small"
                                sx={{ bgcolor: "white", borderRadius: "8px", minWidth: "200px", ".MuiSelect-select": { py: 1 } }}
                            >
                                {projects.map(p => (
                                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Paper elevation={0} sx={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={handleViewChange}
                                size="small"
                                sx={{ height: 36 }}
                            >
                                <ToggleButton value="Day" sx={{ px: 2, textTransform: "none", fontWeight: 600 }}>
                                    <CalendarViewDay fontSize="small" sx={{ mr: 1 }} /> Day
                                </ToggleButton>
                                <ToggleButton value="Week" sx={{ px: 2, textTransform: "none", fontWeight: 600 }}>
                                    <ViewWeek fontSize="small" sx={{ mr: 1 }} /> Week
                                </ToggleButton>
                                <ToggleButton value="Month" sx={{ px: 2, textTransform: "none", fontWeight: 600 }}>
                                    <CalendarViewMonth fontSize="small" sx={{ mr: 1 }} /> Month
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Paper>
                    </Box>

                    {/* Gantt Scroll Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            overscrollBehaviorX: "none",
                            "&::-webkit-scrollbar": { width: 8, height: 8 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: 4 },
                            "& .gantt-container": {
                                height: "fit-content",
                                width: "fit-content"
                            }
                        }}
                    >
                        <div ref={ganttContainerRef} />
                    </Box>
                </Paper>
            </Box>

            {/* Global Style overrides for Frappe Gantt matching brand */}
            <style>{`
                .gantt .bar-progress { fill: #E65F2B !important; }
                .gantt .bar { fill: #FFDCC3 !important; }
                .bar-wrapper:hover .bar { fill: #FFC099 !important; }
                .bar-label { fill: #1A1A1A !important; font-weight: 500; font-family: 'Inter', sans-serif; }
                .gantt-container { overflow: visible !important; }
                .popup-wrapper { opacity: 0; transition: opacity 0.2s; z-index: 1000; }
                
                /* Hide the default scrollbar of frappe-gantt if it conflicts, or style it */
                .gantt-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .gantt-container::-webkit-scrollbar-thumb {
                    background-color: #ccc;
                    border-radius: 4px;
                }
            `}</style>
        </Box>
    );
};

export default Timeline;
