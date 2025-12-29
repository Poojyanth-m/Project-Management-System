import { UserRole } from '@prisma/client';

// JWT Payload
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

// Auth Responses
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        avatar?: string | null;
    };
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

// Request types for controllers
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}
