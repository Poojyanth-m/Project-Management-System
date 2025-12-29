# Authentication API Documentation

## Overview

The Authentication module provides JWT-based authentication with access and refresh tokens, role-based access control (RBAC), and secure password hashing.

---

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. Register User
Creates a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MEMBER"  // Optional: ADMIN | MANAGER | MEMBER (default: MEMBER)
}
```

**Validation Rules:**
- `email`: Valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters
- `role`: Optional, one of: ADMIN, MANAGER, MEMBER

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  ]
}
```

---

### 2. Login
Authenticate user and receive tokens.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "avatar": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

```json
{
  "success": false,
  "message": "Account is inactive"
}
```

---

### 3. Refresh Token
Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Access:** Public

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

```json
{
  "success": false,
  "message": "Refresh token expired"
}
```

---

### 4. Logout
Invalidate refresh token.

**Endpoint:** `POST /auth/logout`

**Access:** Public

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Users API

### 5. Get Current User Profile
Get authenticated user's profile.

**Endpoint:** `GET /users/me`

**Access:** Private (requires authentication)

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "role": "MEMBER",
    "isActive": true,
    "createdAt": "2025-12-27T10:30:00.000Z",
    "updatedAt": "2025-12-27T10:30:00.000Z",
    "lastLoginAt": "2025-12-27T10:35:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

### 6. Update Current User Profile
Update authenticated user's profile.

**Endpoint:** `PATCH /users/me`

**Access:** Private

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "avatar": "https://example.com/avatar.jpg",
    "role": "MEMBER",
    "updatedAt": "2025-12-27T11:00:00.000Z"
  }
}
```

---

### 7. Get User by ID
Get another user's public profile.

**Endpoint:** `GET /users/:id`

**Access:** Private

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "other@example.com",
    "firstName": "Alice",
    "lastName": "Johnson",
    "avatar": null,
    "role": "MANAGER"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Authentication Flow

### Registration Flow
1. Client sends POST request to `/api/auth/register`
2. Server validates input with Zod
3. Server checks if email already exists
4. Server hashes password with bcrypt
5. Server creates user in database
6. Server generates access + refresh tokens
7. Server stores refresh token in database
8. Server returns user data + tokens

### Login Flow
1. Client sends POST request to `/api/auth/login`
2. Server validates input
3. Server finds user by email
4. Server verifies password with bcrypt
5. Server updates lastLoginAt
6. Server generates new access + refresh tokens
7. Server stores refresh token in database
8. Server returns user data + tokens

### Protected Route Flow
1. Client sends request with `Authorization: Bearer <accessToken>` header
2. `authenticate` middleware verifies token
3. Middleware attaches user payload to `req.user`
4. Controller accesses `req.user.userId`, `req.user.role`, etc.
5. Controller returns response

### Token Refresh Flow
1. Client detects access token expired (401)
2. Client sends refresh token to `/api/auth/refresh`
3. Server verifies refresh token
4. Server checks if refresh token exists in database
5. Server generates new access + refresh tokens
6. Server deletes old refresh token
7. Server stores new refresh token
8. Server returns new tokens

---

## Authorization (Role-Based)

### Using `authorize` Middleware
```typescript
import { authenticate, authorize } from './middlewares/auth';

// Only ADMIN can access
router.delete('/users/:id', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  deleteUser
);

// ADMIN and MANAGER can access
router.post('/projects', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.MANAGER), 
  createProject
);
```

---

## JWT Payload Structure

**Access Token:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "MEMBER",
  "iat": 1703680800,
  "exp": 1704285600
}
```

**Expiration:**
- Access Token: 7 days (configurable in `.env`)
- Refresh Token: 30 days (configurable in `.env`)

---

## Client-Side Usage Example

### JavaScript/TypeScript
```typescript
// Register
const registerData = {
  email: "user@example.com",
  password: "SecurePass123",
  firstName: "John",
  lastName: "Doe"
};

const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registerData)
});

const { data } = await registerResponse.json();
const { accessToken, refreshToken } = data;

// Store tokens (localStorage, sessionStorage, or secure cookie)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Authenticated request
const profileResponse = await fetch('http://localhost:5000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const profile = await profileResponse.json();
```

---

## Error Codes Summary

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Login successful |
| 201 | Created | User registered |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Internal error |

---

## Security Features

1. **Password Hashing:** bcrypt with 10 salt rounds
2. **JWT Tokens:** Secure token generation with configurable expiration
3. **Refresh Token Rotation:** New tokens generated on refresh
4. **Token Invalidation:** Refresh tokens stored in database for revocation
5. **Role-Based Access:** ADMIN, MANAGER, MEMBER roles
6. **Email Normalization:** Emails stored in lowercase
7. **Account Status:** `isActive` flag for account suspension

---

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d
```

---

**Module Status:** ✅ Complete and Ready for Testing

---

## Time Tracking API

### 18. Start Timer
Start a timer for a task.

**Endpoint:** `POST /time-tracking/start`
**Access:** Private
**Request Body:**
```json
{ "taskId": "uuid", "description": "Working on header", "isBillable": true }
```

### 19. Stop Timer
Stop the currently running timer.

**Endpoint:** `POST /time-tracking/stop`
**Access:** Private

### 20. Get Time Entries
Get filtered time entries.

**Endpoint:** `GET /time-tracking`
**Query Params:** `projectId`, `taskId`, `from` (date), `to` (date)

---

## File Management API

### 21. Get Upload URL
Get a signed URL for uploading.

**Endpoint:** `POST /files/upload-url`
**Access:** Private
**Request Body:**
```json
{ "fileName": "spec.pdf", "fileType": "application/pdf", "fileSize": 1024, "entityType": "PROJECT", "entityId": "uuid" }
```

### 22. Confirm Upload
Save file metadata after upload.

**Endpoint:** `POST /files/confirm`

### 23. Get Files
List files.

**Endpoint:** `GET /files`
**Query Params:** `entityType` (PROJECT|TASK), `entityId`

---

## Gantt Chart API

### 24. Get Gantt Data
Get tasks and dependencies for a project.

**Endpoint:** `GET /gantt?projectId=uuid`
**Access:** Private

### 25. Add Dependency
Task A blocks Task B.

**Endpoint:** `POST /gantt/dependencies`
**Request Body:**
```json
{ "taskId": "task_B_uuid", "dependsOnTaskId": "task_A_uuid" }
```

---

## Budget API

### 26. Get Budget
Get project budget.

**Endpoint:** `GET /budget?projectId=uuid`

### 27. Set Budget
Set/Update budget (Admin/Manager only).

**Endpoint:** `POST /budget`
**Request Body:**
```json
{ "projectId": "uuid", "totalBudget": 5000, "currency": "USD" }
```

### 28. Add Expense
Submit an expense.

**Endpoint:** `POST /budget/expenses`
```json
{ "budgetId": "uuid", "amount": 100, "description": "Server costs", "expenseDate": "2025-01-01" }
```

### 29. Update Expense Status
Approve/Reject (Admin/Manager only).

**Endpoint:** `PATCH /budget/expenses/:id/status`
```json
{ "status": "APPROVED" }
```

---

## Projects API

### 8. Create Project
Create a new project.

**Endpoint:** `POST /projects`

**Access:** Private

**Request Body:**
```json
{
  "name": "Frontend Redesign",
  "description": "Redesigning the user dashboard",
  "status": "PLANNED",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-03-31T00:00:00Z",
  "memberIds": ["uuid1", "uuid2"]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "uuid",
    "name": "Frontend Redesign",
    "status": "PLANNED",
    "createdById": "user_uuid",
    "createdAt": "2025-01-01T10:00:00Z",
    "_count": {
      "tasks": 0,
      "members": 3
    }
  }
}
```

### 9. Get Projects
Get all projects for the authenticated user.

**Endpoint:** `GET /projects`

**Access:** Private

**Query Parameters:**
- `status`: Filter by status (PLANNED, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED)
- `includeArchived`: true/false (default false)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Frontend Redesign",
      "status": "ACTIVE",
      "_count": {
        "tasks": 5,
        "members": 3
      }
    }
  ]
}
```

### 10. Get Project Details
Get a specific project by ID.

**Endpoint:** `GET /projects/:id`

**Access:** Private (must be member)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Frontend Redesign",
    "description": "Redesigning the user dashboard",
    "status": "ACTIVE",
    "members": [
      {
        "id": "member_uuid",
        "user": {
          "id": "user_uuid",
          "firstName": "John",
          "lastName": "Doe"
        },
        "role": "ADMIN"
      }
    ]
  }
}
```

### 11. Update Project
Update project details.

**Endpoint:** `PATCH /projects/:id`

**Access:** Private (Owner or Manager)

**Request Body:**
```json
{
  "name": "New Project Name",
  "status": "ACTIVE"
}
```

### 12. Archive Project
Soft delete a project.

**Endpoint:** `DELETE /projects/:id`

**Access:** Private (Owner or Admin)

---

## Tasks API

### 13. Create Task
Create a new task in a project.

**Endpoint:** `POST /tasks`

**Access:** Private (must be project member)

**Request Body:**
```json
{
  "title": "Design Homepage",
  "description": "Create high-fidelity mockups",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": "project_uuid",
  "assigneeId": "user_uuid",
  "startDate": "2025-01-05T00:00:00Z",
  "dueDate": "2025-01-10T00:00:00Z"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_uuid",
    "title": "Design Homepage",
    "status": "TODO",
    "priority": "HIGH",
    "projectId": "project_uuid"
  }
}
```

### 14. Get Tasks
Get tasks with filtering.

**Endpoint:** `GET /tasks`

**Access:** Private

**Query Parameters:**
- `projectId`: uuid
- `status`: TODO, IN_PROGRESS, DONE
- `priority`: LOW, MEDIUM, HIGH
- `assigneeId`: uuid
- `includeArchived`: boolean

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task_uuid",
      "title": "Design Homepage",
      "status": "TODO",
      "priority": "HIGH",
      "assignee": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

### 15. Get Task Details
Get detailed task info including subtasks.

**Endpoint:** `GET /tasks/:id`

**Access:** Private (must be project member)

### 16. Update Task
Update task details and status.

**Endpoint:** `PATCH /tasks/:id`

**Access:** Private (must be project member)

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "progress": 50
}
```

### 17. Delete Task
Soft delete a task.

**Endpoint:** `DELETE /tasks/:id`

**Access:** Private (must be project member)
