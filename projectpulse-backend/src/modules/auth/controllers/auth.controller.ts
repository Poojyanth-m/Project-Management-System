import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema } from '../validators/auth.schema';

export class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req: Request, res: Response): Promise<void> {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req: Request, res: Response): Promise<void> {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    async refresh(req: Request, res: Response): Promise<void> {
        const validatedData = refreshTokenSchema.parse(req.body);
        const result = await authService.refreshAccessToken(validatedData.refreshToken);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result,
        });
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    async logout(req: Request, res: Response): Promise<void> {
        const validatedData = refreshTokenSchema.parse(req.body);
        await authService.logout(validatedData.refreshToken);

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }

    /**
     * Forgot password request
     * POST /api/auth/forgot-password
     */
    async forgotPassword(req: Request, res: Response): Promise<void> {
        const validatedData = forgotPasswordSchema.parse(req.body);
        await authService.forgotPassword(validatedData.email);

        res.status(200).json({
            success: true,
            message: 'If the email exists, a password reset link has been sent.',
        });
    }
}

export const authController = new AuthController();
