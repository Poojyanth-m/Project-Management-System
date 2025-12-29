import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authenticate } from '../../../middlewares/auth';
import { asyncHandler } from '../../../middlewares/asyncHandler';

const router = Router();

router.use(authenticate);

// Get Budget (by ?projectId=...)
router.get('/', asyncHandler(budgetController.getBudget.bind(budgetController)));

// Set or Update Project Budget
router.post('/', asyncHandler(budgetController.setBudget.bind(budgetController)));

// Add Expense
router.post('/expenses', asyncHandler(budgetController.addExpense.bind(budgetController)));

// Update Expense Status (Approve/Reject)
router.patch('/expenses/:id/status', asyncHandler(budgetController.updateExpenseStatus.bind(budgetController)));

// Delete Expense
router.delete('/expenses/:id', asyncHandler(budgetController.deleteExpense.bind(budgetController)));

export default router;
