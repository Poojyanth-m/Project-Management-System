import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { authService } from '../modules/auth/services/auth.service';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import type { JwtPayload } from '../modules/auth/auth.types';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = authService.verifyAccessToken(token);

        // Attach user to request
        req.user = payload;

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            if (!allowedRoles.includes(req.user.role)) {
                throw new ForbiddenError('Insufficient permissions');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Optional authentication - attach user if token exists but don't fail if not
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = authService.verifyAccessToken(token);
            req.user = payload;
        }

        next();
    } catch (error) {
        // Ignore auth errors for optional auth
        next();
    }
};
