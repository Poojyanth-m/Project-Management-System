# Phase 2: Database Schema Documentation

## Overview

This document explains the complete Prisma schema design for **Project Pulse PMS**, supporting all 10 backend modules while maintaining frontend compatibility.

---

## ✅ Schema Completeness Checklist

### ✓ All Required Models Implemented
- ✅ User
- ✅ Project
- ✅ Task
- ✅ TimeEntry
- ✅ Comment
- ✅ ActivityLog
- ✅ File
- ✅ Budget
- ✅ Expense
- ✅ UserSettings (new)

### ✓ Additional Models for Complete Functionality
- ✅ RefreshToken (auth)
- ✅ ProjectMember (many-to-many join table)
- ✅ TaskDependency (gantt support)
- ✅ Notification (collaboration)

### ✓ All Required Enums Implemented
- ✅ UserRole → ADMIN | MANAGER | MEMBER
- ✅ ProjectStatus → PLANNED | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED
- ✅ TaskStatus → TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED
- ✅ TaskPriority → LOW | MEDIUM | HIGH
- ✅ ExpenseStatus → PENDING | APPROVED | REJECTED
- ✅ EntityType → PROJECT | TASK | USER

### ✓ Additional Enums for Robustness
- ✅ ActivityAction (analytics tracking)
- ✅ NotificationStatus (collaboration)

---

## 📋 Model-by-Model Explanation

### 1. **User** (Modules: users, auth)
**Purpose:** Central user management for authentication and authorization

**Key Fields:**
- `id` (UUID) - Primary key
- `email` (unique) - Login credential
- `password` - Hashed password (bcrypt)
- `firstName`, `lastName` - User profile
- `role` - ADMIN | MANAGER | MEMBER
- `isActive` - Account status
- `isArchived` - Soft delete support
- `lastLoginAt` - Analytics tracking

**Relations:**
- Many-to-many with Projects (via ProjectMember)
- One-to-many with Tasks (as assignee and creator)
- One-to-many with TimeEntries, Comments, ActivityLogs
- One-to-many with RefreshTokens (auth)
- One-to-one with UserSettings (settings)
- One-to-many with Notifications

**Indexes:**
- email, role, isActive (for fast queries)

---

### 2. **RefreshToken** (Module: auth)
**Purpose:** JWT refresh token management for secure authentication

**Key Fields:**
- `token` (unique) - Refresh token string
- `userId` - Foreign key to User
- `expiresAt` - Token expiration

**Relations:**
- Belongs to User (cascade delete)

**Indexes:**
- userId, token (for fast lookup)

---

### 3. **UserSettings** (Module: users)
**Purpose:** User preferences and notification settings

**Key Fields:**
- `userId` (unique) - Foreign key to User
- `marketingEmails`, `productUpdates` - Email preferences
- `commentsNotifications`, `assignmentsNotifications` - In-app/Email toggles
- `weeklyDigest` - Summary preference
- `theme` - light | dark
- `language` - en | es | etc.

**Relations:**
- Belongs to User (cascade delete)

---

### 4. **Project** (Module: projects)
**Purpose:** Core project management entity

**Key Fields:**
- `id` (UUID) - Primary key
- `name` - Project name
- `description` - Detailed description
- `status` - PLANNED | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED
- `startDate`, `endDate` - Timeline for Gantt
- `isArchived` - Soft delete
- `createdById` - Project owner

**Relations:**
- One-to-many with Tasks
- Many-to-many with Users (via ProjectMember)
- One-to-one with Budget
- One-to-many with Files (polymorphic)
- One-to-many with ActivityLogs (polymorphic)

**Indexes:**
- status, isArchived, startDate, endDate (for filtering and Gantt)

---

### 4. **ProjectMember** (Module: projects)
**Purpose:** Many-to-many join table for User ↔ Project with role

**Key Fields:**
- `projectId`, `userId` - Composite unique key
- `role` - Member role within project
- `joinedAt` - Timestamp

**Relations:**
- Belongs to Project (cascade delete)
- Belongs to User (cascade delete)

**Indexes:**
- projectId, userId (for fast joins)

---

### 5. **Task** (Modules: tasks, gantt)
**Purpose:** Task management with Gantt chart support

**Key Fields:**
- `id` (UUID) - Primary key
- `title`, `description` - Task details
- `status` - TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED
- `priority` - LOW | MEDIUM | HIGH
- `projectId` - Parent project
- `assigneeId` - Assigned user
- `startDate`, `dueDate`, `duration` - **Gantt timeline fields**
- `progress` - 0-100% completion
- `parentTaskId` - **Subtask hierarchy for Gantt**
- `orderIndex` - **Task ordering for Gantt**
- `completedAt` - Completion timestamp

**Relations:**
- Belongs to Project
- Belongs to User (assignee and creator)
- Self-referencing (parent/subtasks)
- Many-to-many with Tasks (via TaskDependency for Gantt)
- One-to-many with TimeEntries, Comments, Files
- One-to-many with ActivityLogs (polymorphic)

**Indexes:**
- projectId, assigneeId, status, priority, dueDate, parentTaskId

**Gantt Support:**
- `startDate`, `dueDate`, `duration` - Timeline visualization
- `parentTaskId` + `subtasks` - Task hierarchy
- `dependencies` - Critical path calculation
- `progress` - Visual progress bars
- `orderIndex` - Display order

---

### 6. **TaskDependency** (Module: gantt)
**Purpose:** Task dependencies for Gantt critical path

**Key Fields:**
- `taskId` - The dependent task
- `dependsOnTaskId` - The blocking task

**Relations:**
- Two Task references (cascade delete)

**Indexes:**
- Composite unique on (taskId, dependsOnTaskId)

**Gantt Support:**
- Enables "Finish-to-Start" dependencies
- Critical for Gantt chart rendering
- Supports dependency validation

---

### 7. **TimeEntry** (Module: time-tracking)
**Purpose:** Time tracking for tasks and billing

**Key Fields:**
- `userId`, `taskId` - Who worked on what
- `startTime`, `endTime` - Time range
- `duration` - Calculated minutes
- `isBillable` - Billing flag
- `description` - Work description

**Relations:**
- Belongs to User (cascade delete)
- Belongs to Task (cascade delete)

**Indexes:**
- userId, taskId, startTime, endTime (for reports)

**Analytics Support:**
- Enables time tracking reports
- Project time analysis
- User productivity metrics
- Billable hours calculation

---

### 8. **Comment** (Module: collaboration)
**Purpose:** Task comments and discussions

**Key Fields:**
- `content` - Comment text
- `taskId` - Associated task
- `userId` - Commenter

**Relations:**
- Belongs to Task (cascade delete)
- Belongs to User (cascade delete)

**Indexes:**
- taskId, userId, createdAt (for threaded display)

---

### 9. **File** (Module: files)
**Purpose:** File attachments with polymorphic support

**Key Fields:**
- `name`, `url` - File metadata
- `size`, `mimeType` - File properties
- `entityType` - PROJECT | TASK (polymorphic)
- `entityId` - Foreign key to Project or Task
- `uploadedBy` - Uploader user ID
- `isArchived` - Soft delete

**Relations:**
- Polymorphic: belongs to Project OR Task

**Indexes:**
- (entityType, entityId) - Polymorphic lookup
- uploadedBy

**Design Notes:**
- Supports both project-level and task-level files
- Can be extended to USER type if needed

---

### 10. **Budget** (Module: budget)
**Purpose:** Project budget management (one-to-one with Project)

**Key Fields:**
- `projectId` (unique) - One budget per project
- `totalBudget` - Budget amount
- `currency` - Currency code (default USD)
- `createdById` - Budget creator

**Relations:**
- Belongs to Project (cascade delete)
- One-to-many with Expenses

**Indexes:**
- projectId

**Analytics Support:**
- Budget vs. actual spending
- Cost tracking per project

---

### 11. **Expense** (Module: budget)
**Purpose:** Individual expenses against budget

**Key Fields:**
- `budgetId` - Parent budget
- `description`, `amount`, `category` - Expense details
- `status` - PENDING | APPROVED | REJECTED
- `receiptUrl` - Receipt attachment
- `expenseDate` - When expense occurred

**Relations:**
- Belongs to Budget (cascade delete)

**Indexes:**
- budgetId, status, expenseDate

**Analytics Support:**
- Expense categorization
- Approval workflows
- Spending trends

---

### 12. **ActivityLog** (Module: analytics)
**Purpose:** Comprehensive audit trail and analytics

**Key Fields:**
- `userId` - Who performed action
- `action` - CREATED | UPDATED | DELETED | etc.
- `entityType` - PROJECT | TASK | USER
- `entityId` - Affected entity
- `metadata` (JSON) - Additional context
- `createdAt` - When it happened

**Relations:**
- Belongs to User (cascade delete)
- Polymorphic: belongs to Project OR Task

**Indexes:**
- userId, (entityType, entityId), action, createdAt

**Analytics Support:**
- User activity tracking
- Project timeline
- Task history
- Audit trails
- Custom analytics queries

---

### 13. **Notification** (Module: collaboration)
**Purpose:** Real-time user notifications

**Key Fields:**
- `userId` - Recipient
- `title`, `message` - Notification content
- `type` - Notification category (e.g., TASK_ASSIGNED)
- `status` - UNREAD | READ | ARCHIVED
- `metadata` (JSON) - Additional data
- `readAt` - Read timestamp

**Relations:**
- Belongs to User (cascade delete)

**Indexes:**
- userId, status, createdAt

---

## 🔗 Relationship Summary

### User Relationships
- User ↔ Project (many-to-many via ProjectMember) ✅
- User → Task (one-to-many as assignee) ✅
- User → TimeEntry (one-to-many) ✅
- User → Comment (one-to-many) ✅
- User → ActivityLog (one-to-many) ✅
- User → RefreshToken (one-to-many) ✅
- User → Notification (one-to-many) ✅

### Project Relationships
- Project ↔ User (many-to-many via ProjectMember) ✅
- Project → Task (one-to-many) ✅
- Project → Budget (one-to-one) ✅
- Project → File (one-to-many, polymorphic) ✅
- Project → ActivityLog (one-to-many, polymorphic) ✅

### Task Relationships
- Task → Project (many-to-one) ✅
- Task → User (many-to-one as assignee) ✅
- Task ↔ Task (self-referencing for subtasks) ✅
- Task ↔ Task (many-to-many via TaskDependency) ✅
- Task → TimeEntry (one-to-many) ✅
- Task → Comment (one-to-many) ✅
- Task → File (one-to-many, polymorphic) ✅
- Task → ActivityLog (one-to-many, polymorphic) ✅

### Budget Relationships
- Budget → Project (one-to-one) ✅
- Budget → Expense (one-to-many) ✅

---

## 📊 How Schema Supports Key Features

### 1. **Gantt Chart Support** ✅

**Task Model Fields:**
- `startDate`, `dueDate` → Timeline visualization
- `duration` → Task length in hours
- `progress` → Visual progress bars (0-100%)
- `parentTaskId` → Task hierarchy (parent/child)
- `orderIndex` → Display ordering

**TaskDependency Model:**
- `taskId` + `dependsOnTaskId` → Dependency links
- Enables critical path calculation
- Supports "Finish-to-Start" relationships

**Project Model Fields:**
- `startDate`, `endDate` → Project timeline

**Frontend Benefits:**
- Can render Gantt chart from `tasks` with dependencies
- Hierarchy visualization via `parentTaskId`
- Critical path from `TaskDependency`
- Progress tracking via `progress` field

---

### 2. **Time Tracking Support** ✅

**TimeEntry Model:**
- `userId`, `taskId` → Who worked on what
- `startTime`, `endTime` → Time range
- `duration` → Minutes worked (calculated)
- `isBillable` → Billing status
- `description` → Work description

**Analytics Queries:**
- Total time per task
- Total time per user
- Total time per project (via task aggregation)
- Billable vs. non-billable hours
- Time distribution reports

**Frontend Benefits:**
- Timer functionality (start/end tracking)
- Daily/weekly time sheets
- Project time summaries
- User productivity reports

---

### 3. **Budget & Expense Tracking** ✅

**Budget Model:**
- `totalBudget` → Project budget
- `currency` → Multi-currency support
- One-to-one with Project

**Expense Model:**
- `amount` → Expense value
- `category` → Expense categorization
- `status` → Approval workflow (PENDING | APPROVED | REJECTED)
- `expenseDate` → When expense occurred
- `receiptUrl` → Receipt attachment

**Analytics Queries:**
- Budget vs. actual spending
- Expenses by category
- Approval status reports
- Spending trends over time
- Budget utilization percentage

**Frontend Benefits:**
- Budget overview dashboard
- Expense submission forms
- Approval workflows
- Spending charts
- Budget alerts (spent > 80%)

---

### 4. **Analytics & Reporting** ✅

**ActivityLog Model:**
- `action` → What happened (CREATED, UPDATED, etc.)
- `entityType` + `entityId` → What entity (polymorphic)
- `userId` → Who did it
- `metadata` (JSON) → Additional context
- `createdAt` → When it happened

**Analytics Capabilities:**

**User Analytics:**
- Tasks created/completed by user
- Time logged per user
- Activity frequency
- Productivity metrics

**Project Analytics:**
- Project timeline (start → completion)
- Task completion rate
- Budget utilization
- Team activity

**Task Analytics:**
- Task lifecycle (created → completed)
- Status change history
- Assignment history
- Comment frequency

**Time Analytics:**
- Total time per project/task/user
- Billable vs. non-billable
- Time trends (daily/weekly/monthly)

**Budget Analytics:**
- Spending by category
- Budget burn rate
- Expense approval rate

**Indexes for Fast Queries:**
- All `createdAt` fields indexed
- Status fields indexed
- Foreign keys indexed
- Composite indexes on (entityType, entityId)

**Frontend Benefits:**
- Dashboard widgets
- Custom reports
- Charts and graphs
- Export capabilities

---

## 🔍 Schema Quality Features

### ✅ UUIDs for All IDs
- All models use `String @id @default(uuid())`
- No auto-increment integers
- Better for distributed systems
- Frontend-friendly

### ✅ Soft Deletes
- `isArchived` on User, Project, Task, File
- Preserves data integrity
- Enables restore functionality
- Analytics on historical data

### ✅ Timestamps
- `createdAt` on all models
- `updatedAt` on mutable models
- Specific timestamps (completedAt, readAt, lastLoginAt)

### ✅ Indexes
- Foreign keys indexed
- Status/role enums indexed
- Date fields indexed
- Composite indexes for polymorphic relations

### ✅ Cascade Deletes
- RefreshToken → User (cascade)
- ProjectMember → Project/User (cascade)
- Task → Project (cascade)
- TimeEntry → User/Task (cascade)
- Comment → Task/User (cascade)
- Expense → Budget (cascade)
- Notification → User (cascade)

### ✅ Polymorphic Relations
- File → Project OR Task
- ActivityLog → Project OR Task
- Uses `entityType` + `entityId` pattern
- Indexed for performance

### ✅ Enums for Type Safety
- Shared between frontend and backend
- Prevents invalid states
- Type-safe queries

---

## 🎯 Module Coverage

| Module | Models Used | Status |
|--------|-------------|--------|
| 1. auth | User, RefreshToken | ✅ |
| 2. users | User, Notification | ✅ |
| 3. projects | Project, ProjectMember | ✅ |
| 4. tasks | Task, TaskDependency | ✅ |
| 5. time-tracking | TimeEntry | ✅ |
| 6. collaboration | Comment, Notification | ✅ |
| 7. files | File | ✅ |
| 8. gantt | Task, TaskDependency | ✅ |
| 9. budget | Budget, Expense | ✅ |
| 10. analytics | ActivityLog, all models | ✅ |

---

## ✅ Confirmation

### What Was Done:
- ✅ Created complete `schema.prisma` with 13 models
- ✅ All required models implemented
- ✅ All required enums implemented
- ✅ All required relationships configured
- ✅ Indexes added for performance
- ✅ UUIDs used for all IDs
- ✅ Soft deletes implemented
- ✅ Polymorphic relations for File and ActivityLog
- ✅ Gantt support via Task fields and TaskDependency
- ✅ Time tracking via TimeEntry
- ✅ Budget tracking via Budget and Expense
- ✅ Analytics via ActivityLog and indexed timestamps

### What Was NOT Done (Per Instructions):
- ❌ NO controllers created
- ❌ NO services created
- ❌ NO routes created
- ❌ NO business logic written
- ❌ NO migrations run
- ❌ NO sample data added
- ❌ ONLY `schema.prisma` modified

---

## 🚀 Ready for Review

The schema is:
- **Complete** - All 10 modules supported
- **Frontend-compatible** - Enums and structure align with frontend
- **Analytics-ready** - ActivityLog and indexes for reporting
- **Gantt-ready** - Task dependencies and timeline fields
- **Production-ready** - Indexes, soft deletes, cascades

**Next steps after approval:**
- Generate Prisma Client
- Run migrations
- Begin Phase 3: Module implementation
