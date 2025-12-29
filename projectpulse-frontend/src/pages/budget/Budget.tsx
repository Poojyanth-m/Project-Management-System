import { useState, useEffect } from "react";
import { Box, Typography, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import TopBar from "../../components/layout/TopBar";
import BudgetSummary from "../../components/budget/BudgetSummary";
import ExpenseList from "../../components/budget/ExpenseList";
import AddExpenseDrawer from "../../components/budget/AddExpenseDrawer"; // Changed from Dialog
import { budgetService } from "../../services/budgetService";
import { getProjects } from "../../services/projectService";
import { EmptyState } from "../../components/common/EmptyState";
import { Brand } from "../../theme/colors";
import type { ProjectBudget, Expense } from "../../types/budget";

const Budget = () => {
    // Replaced context with local fetch for better loading state control
    const [projects, setProjects] = useState<any[]>([]); // Using any for simplicity as we only need id/name
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    // Data
    const [budget, setBudget] = useState<ProjectBudget | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(true);

    // UI
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

    // Init project selection
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                const data = await getProjects();
                setProjects(data);
                if (data && data.length > 0) {
                    setSelectedProjectId(data[0].id.toString());
                }
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setProjectsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProjectId) return;
        fetchData();
    }, [selectedProjectId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [budgetData, expenseData] = await Promise.all([
                budgetService.getProjectBudget(selectedProjectId),
                budgetService.getExpenses(selectedProjectId)
            ]);
            setBudget(budgetData);
            setExpenses(expenseData);
        } catch (error) {
            console.error("Failed to fetch budget data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (newExpense: any) => {
        if (!budget?.id) {
            console.error("Budget ID not found");
            return;
        }
        const added = await budgetService.addExpense({
            ...newExpense,
            projectId: selectedProjectId,
            budgetId: budget.id
        });
        setExpenses([added, ...expenses]);
        // Update budget spent amount
        setBudget({ ...budget, spentAmount: (budget.spentAmount || 0) + added.amount });
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await budgetService.deleteExpense(id);
            const removed = expenses.find(e => e.id === id);
            setExpenses(expenses.filter(e => e.id !== id));
            // Update budget spent amount
            if (budget && removed) {
                setBudget({ ...budget, spentAmount: (budget.spentAmount || 0) - removed.amount });
            }
        } catch (error) {
            console.error("Failed to delete expense", error);
            alert("Failed to delete expense. You might not have permission.");
        }
    };

    if (projectsLoading) return (
        <Box sx={{ pb: 8 }}>
            <TopBar title="Budget & Expenses" />
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress sx={{ color: Brand.primary }} />
            </Box>
        </Box>
    );

    // If no projects, show empty state or just render minimal UI
    if (projects.length === 0) return (
        <Box sx={{ pb: 8 }}>
            <TopBar title="Budget & Expenses" />
            <EmptyState message="No projects found. Please create a project first." />
        </Box>
    );

    return (
        <Box sx={{ pb: 8 }}>
            <TopBar title="Budget & Expenses" />

            {/* Controls Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">Project:</Typography>
                    <Select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        size="small"
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.5)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "8px",
                            minWidth: "200px",
                            ".MuiSelect-select": { py: 1.5 }
                        }}
                    >
                        {projects.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setIsAddDrawerOpen(true)}
                    sx={{
                        bgcolor: Brand.primary,
                        borderRadius: "24px",
                        textTransform: "none",
                        px: 3,
                        fontWeight: 600,
                        "&:hover": { bgcolor: Brand.primary }
                    }}
                >
                    Add Expense
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Summary Cards */}
                    {budget && <Box sx={{ mb: 4 }}><BudgetSummary budget={budget} /></Box>}

                    {/* Expense List */}
                    <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontFamily: "'Aeonik Pro TRIAL', sans-serif" }}>
                        Expense History
                    </Typography>
                    <ExpenseList
                        expenses={expenses}
                        currency={budget?.currency || "INR"}
                        onDelete={handleDeleteExpense}
                    />
                </>
            )}

            <AddExpenseDrawer
                open={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                onSubmit={handleAddExpense}
                projectId={selectedProjectId}
            />
        </Box>
    );
};

export default Budget;
