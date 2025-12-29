import { useState } from "react";
import {
    Box, Button, TextField, Select, MenuItem,
    FormControl, InputLabel
} from "@mui/material";
import { Brand } from "../../theme/colors";
import type { Expense, ExpenseCategory, ExpenseStatus } from "../../types/budget";

import { RightDrawer } from "../common/RightDrawer";

interface AddExpenseDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (expense: Omit<Expense, "id">) => void;
    projectId: string;
}

const CATEGORIES: ExpenseCategory[] = ["Software", "Hardware", "Personnel", "Marketing", "Travel", "Other"];

const AddExpenseDrawer = ({ open, onClose, onSubmit, projectId }: AddExpenseDrawerProps) => {
    const [formData, setFormData] = useState({
        title: "",
        category: "Other" as ExpenseCategory,
        amount: "",
        date: new Date().toISOString().split("T")[0],
        status: "PENDING" as ExpenseStatus
    });

    const [errors, setErrors] = useState({
        title: false,
        amount: false,
        date: false
    });

    const handleSubmit = () => {
        const newErrors = {
            title: !formData.title,
            amount: !formData.amount,
            date: !formData.date
        };
        setErrors(newErrors);

        if (newErrors.title || newErrors.amount || newErrors.date) return;

        onSubmit({
            projectId,
            title: formData.title,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date,
            status: formData.status,
            createdBy: "Current User" // Mock
        });

        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: "",
            category: "Other",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            status: "PENDING"
        });
        setErrors({ title: false, amount: false, date: false });
        onClose();
    };

    return (
        <RightDrawer
            open={open}
            onClose={handleClose}
            title="Add New Expense"
            actions={
                <>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{ borderRadius: "8px", textTransform: "none", color: Brand.primary, borderColor: Brand.primary, fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: Brand.primary,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 4,
                            "&:hover": { bgcolor: Brand.primary }
                        }}
                    >
                        Save Expense
                    </Button>
                </>
            }
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <TextField
                    label="Expense Title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    fullWidth
                    error={errors.title}
                    helperText={errors.title ? "Title is required" : ""}
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                />

                <TextField
                    label="Amount (₹)"
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    fullWidth
                    error={errors.amount}
                    helperText={errors.amount ? "Amount is required" : ""}
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                />

                <TextField
                    label="Date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={errors.date}
                    helperText={errors.date ? "Date is required" : ""}
                    InputProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
                />

                <FormControl fullWidth>
                    <InputLabel>Category *</InputLabel>
                    <Select
                        value={formData.category}
                        label="Category *"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                        sx={{ borderRadius: "12px", bgcolor: "#fff" }}
                    >
                        {CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ExpenseStatus })}
                        sx={{ borderRadius: "12px", bgcolor: "#fff" }}
                    >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </RightDrawer>
    );
};

export default AddExpenseDrawer;
