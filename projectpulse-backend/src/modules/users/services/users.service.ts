import prisma from '../../../config/database';
import { NotFoundError, BadRequestError } from '../../../utils/errors';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UsersService {
    /**
     * Get user profile by ID
     */
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    /**
     * Get user by ID (used by other modules)
     */
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(
        userId: string,
        data: {
            firstName?: string;
            lastName?: string;
            avatar?: string;
        }
    ) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                updatedAt: true,
            },
        });

        return user;
    }
    /**
     * Get all users
     */
    async getAllUsers() {
        return prisma.user.findMany({
            where: { isArchived: false },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
                _count: {
                    select: {
                        projectMembers: true,
                        assignedTasks: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Update user (admin)
     */
    async updateUser(userId: string, data: any) {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
                isActive: true
            }
        });
    }

    /**
     * Soft delete/deactivate user
     */
    async deactivateUser(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
        });
    }

    /**
     * Get user settings
     */
    async getSettings(userId: string) {
        let settings = await prisma.userSettings.findUnique({
            where: { userId }
        });

        // Create if doesn't exist (for existing users)
        if (!settings) {
            settings = await prisma.userSettings.create({
                data: { userId }
            });
        }

        return settings;
    }

    /**
     * Update user settings
     */
    async updateSettings(userId: string, data: any) {
        return prisma.userSettings.update({
            where: { userId },
            data
        });
    }

    /**
     * Change user password
     */
    async changePassword(userId: string, currentPass: string, newPass: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw new NotFoundError('User not found');

        const isValid = await bcrypt.compare(currentPass, user.password);
        if (!isValid) throw new BadRequestError('Invalid current password');

        const hashedPassword = await bcrypt.hash(newPass, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }

    /**
     * Delete account (Soft delete)
     */
    async deleteAccount(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                isArchived: true
            }
        });
    }
}

export const usersService = new UsersService();
