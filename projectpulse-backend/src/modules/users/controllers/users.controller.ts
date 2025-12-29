import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { z } from 'zod';
import { BadRequestError } from '../../../utils/errors';

// Update profile schema
const updateProfileSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    avatar: z.string().optional(),
});

export class UsersController {
    /**
     * Get current user profile
     * GET /api/users/me
     */
    async getMe(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId; // Set by auth middleware
        const user = await usersService.getProfile(userId);

        res.status(200).json({
            success: true,
            data: user,
        });
    }

    /**
     * Update current user profile
     * PATCH /api/users/me
     */
    async updateMe(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const validatedData = updateProfileSchema.parse(req.body);
        const user = await usersService.updateProfile(userId, validatedData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    }

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const user = await usersService.getUserById(id);

        res.status(200).json({
            success: true,
            data: user,
        });
    }
    /**
     * Get all users
     * GET /api/users
     */
    async getUsers(_req: Request, res: Response): Promise<void> {
        const users = await usersService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    }

    /**
     * Update user (admin)
     * PATCH /api/users/:id
     */
    async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const user = await usersService.updateUser(id, req.body);
        res.status(200).json({
            success: true,
            data: user,
        });
    }

    /**
     * Deactivate user (admin)
     * DELETE /api/users/:id
     */
    async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await usersService.deactivateUser(id);
        res.status(200).json({
            success: true,
            message: 'User deactivated successfully'
        });
    }

    /**
     * Get current user settings
     * GET /api/users/me/settings
     */
    async getMySettings(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const settings = await usersService.getSettings(userId);
        res.status(200).json({
            success: true,
            data: settings
        });
    }

    /**
     * Update current user settings
     * PATCH /api/users/me/settings
     */
    async updateMySettings(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const settings = await usersService.updateSettings(userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    }

    /**
     * Change current user password
     * POST /api/users/me/change-password
     */
    async changePassword(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new BadRequestError('Current and new password are required');
        }

        await usersService.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }

    /**
     * Delete self account
     * DELETE /api/users/me
     */
    async deleteMe(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        await usersService.deleteAccount(userId);
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    }
}

export const usersController = new UsersController();
