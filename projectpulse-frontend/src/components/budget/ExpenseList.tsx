import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Typography, Menu, MenuItem
} from "@mui/material";
import { DeleteOutline, ReceiptLong, MoreHoriz, Close } from "@mui/icons-material";
import type { Expense } from "../../types/budget";
import { useState } from "react";
import StatusBadge from "../common/StatusBadge";

interface ExpenseListProps {
    expenses: Expense[];
    currency: string;
    onDelete: (id: string) => void;
}

const ExpenseList = ({ expenses, currency: _currency, onDelete }: ExpenseListProps) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, expense: Expense) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedExpense(expense);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        if (!showDeleteConfirm) {
            setSelectedExpense(null);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (selectedExpense) {
            onDelete(selectedExpense.id);
            setShowDeleteConfirm(false);
            handleMenuClose();
        }
    };

    // Glass styling common props
    const glassProps = {
        borderRadius: "16px",
        bgcolor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    };

    if (expenses.length === 0) {
        return (
            <Paper sx={{ ...glassProps, p: 4, textAlign: "center" }}>
                <ReceiptLong sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }} />
                <Typography color="text.secondary">No expenses recorded yet.</Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} sx={glassProps}>
            <Table>
                <TableHead sx={{ bgcolor: "rgba(255,255,255,0.3)" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Expense</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>By</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                {expense.title}
                            </TableCell>
                            <TableCell>
                                <StatusBadge label={expense.category} variant="grey" />
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>{expense.date}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.amount)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge
                                    label={expense.status}
                                    variant={expense.status === "APPROVED" ? "green" : "yellow"}
                                />
                            </TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>{expense.createdBy}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, expense)}
                                    sx={{ color: "#666", "&:hover": { color: "#333" } }}
                                >
                                    <MoreHoriz fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Delete Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        minWidth: 160,
                        borderRadius: "12px",
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        mt: 1
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {!showDeleteConfirm ? (
                    <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#D32F2F", py: 1 }}>
                        <DeleteOutline fontSize="small" />
                        Delete Expense
                    </MenuItem>
                ) : (
                    <>
                        <Typography variant="caption" sx={{ px: 2, py: 1, color: "#666", display: "block", fontWeight: 600 }}>
                            Delete "{selectedExpense?.title}"?
                        </Typography>
                        <MenuItem onClick={handleConfirmDelete} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 700, color: "#D32F2F", py: 1, bgcolor: "#FEF2F2" }}>
                            <DeleteOutline fontSize="small" />
                            Yes, Delete
                        </MenuItem>
                        <MenuItem onClick={() => setShowDeleteConfirm(false)} sx={{ gap: 1.5, fontSize: "14px", fontWeight: 500, color: "#666", py: 1 }}>
                            <Close fontSize="small" />
                            Cancel
                        </MenuItem>
                    </>
                )}
            </Menu>
        </TableContainer>
    );
};

export default ExpenseList;
