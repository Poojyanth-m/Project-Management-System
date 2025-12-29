import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { emailService } from '../../notifications/services/email.service';
import { UserRole } from '@prisma/client';
import prisma from '../../../config/database';
import config from '../../../config';
import { ConflictError, UnauthorizedError } from '../../../utils/errors';
import type { AuthResponse, JwtPayload, RefreshTokenResponse } from '../auth.types';
import type { RegisterInput, LoginInput } from '../validators/auth.schema';

const SALT_ROUNDS = 10;

export class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterInput): Promise<AuthResponse> {
        const { email, password, firstName, lastName, role } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user with default settings
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                role: role || UserRole.MEMBER,
                settings: {
                    create: {} // Uses defaults from schema
                }
            },
            include: {
                settings: true
            }
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login user
     */
    async login(data: LoginInput): Promise<AuthResponse> {
        const { email, password } = data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is inactive');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshTokenStr: string): Promise<RefreshTokenResponse> {
        // Verify refresh token
        let payload: JwtPayload;
        try {
            payload = jwt.verify(refreshTokenStr, config.jwt.refreshSecret) as JwtPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        // Check if refresh token exists in database
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token: refreshTokenStr },
        });

        if (!refreshToken) {
            throw new UnauthorizedError('Refresh token not found');
        }

        // Check if refresh token is expired
        if (refreshToken.expiresAt < new Date()) {
            // Delete expired token
            await prisma.refreshToken.delete({
                where: { id: refreshToken.id },
            });
            throw new UnauthorizedError('Refresh token expired');
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedError('User not found or inactive');
        }

        // Generate new tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        // Delete old refresh token
        await prisma.refreshToken.delete({
            where: { id: refreshToken.id },
        });

        return tokens;
    }

    /**
     * Logout user (invalidate refresh token)
     */
    async logout(refreshTokenStr: string): Promise<void> {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token: refreshTokenStr },
        });

        if (refreshToken) {
            await prisma.refreshToken.delete({
                where: { id: refreshToken.id },
            });
        }
    }

    /**
     * Generate access and refresh tokens
     */
    private async generateTokens(
        userId: string,
        email: string,
        role: UserRole
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: JwtPayload = {
            userId,
            email,
            role,
        };

        // Generate access token
        const accessToken = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        } as jwt.SignOptions);

        // Generate refresh token
        const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiresIn,
        } as jwt.SignOptions);

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt,
            },
        });

        return { accessToken, refreshToken };
    }

    /**
     * Verify JWT token and extract payload
     */
    verifyAccessToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, config.jwt.secret) as JwtPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    }

    /**
     * Initiate password reset flow
     */
    async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user || !user.isActive) {
            // Return silently to prevent email enumeration
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Token expires in 1 hour
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // DELETE existing tokens for this user first? Or just create new one?
        // Usually good practice to invalidate old ones or just let them expire.
        // Let's keeping it simple: just create new one. Use a cleanup job for old ones or delete old ones here.
        // To prevent clutter, let's delete existing tokens for this user.
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

        // Save hashed token to database
        await prisma.passwordResetToken.create({
            data: {
                token: tokenHash,
                userId: user.id,
                expiresAt,
            },
        });

        // Send email with plain token
        await emailService.sendPasswordResetEmail(user.email, resetToken);
    }
}

export const authService = new AuthService();
