# Database Schema - Entity Relationship Diagram (ERD)

## ASCII Visual Representation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PROJECT PULSE PMS - DATABASE SCHEMA              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    USER      │
│──────────────│
│ id (PK)      │◄─┐
│ email        │  │
│ password     │  │
│ firstName    │  │
│ lastName     │  │
│ role         │  │
│ isActive     │  │
│ isArchived   │  │
└──────────────┘  │
       │          │
       │          │
       ▼          │
┌──────────────┐  │
│ REFRESH      │  │
│ TOKEN        │  │
│──────────────│  │
│ id (PK)      │  │
│ token        │  │
│ userId (FK)  ├──┘
│ expiresAt    │
└──────────────┘


┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   PROJECT    │◄────────│ PROJECT_MEMBER   │────────►│     USER     │
│──────────────│  1:M    │──────────────────│   M:1   │──────────────│
│ id (PK)      │         │ id (PK)          │         │ id (PK)      │
│ name         │         │ projectId (FK)   │         │ ...          │
│ description  │         │ userId (FK)      │         └──────────────┘
│ status       │         │ role             │
│ startDate    │         │ joinedAt         │
│ endDate      │         └──────────────────┘
│ isArchived   │
│ createdById  │
└──────────────┘
       │
       │ 1:1
       ▼
┌──────────────┐
│   BUDGET     │
│──────────────│
│ id (PK)      │
│ projectId(FK)│
│ totalBudget  │
│ currency     │
└──────────────┘
       │
       │ 1:M
       ▼
┌──────────────┐
│   EXPENSE    │
│──────────────│
│ id (PK)      │
│ budgetId(FK) │
│ description  │
│ amount       │
│ status       │
│ expenseDate  │
└──────────────┘


┌──────────────┐         ┌──────────────────┐
│   PROJECT    │         │      TASK        │
│──────────────│  1:M    │──────────────────│
│ id (PK)      │◄────────│ id (PK)          │
│ ...          │         │ title            │
└──────────────┘         │ description      │
                         │ status           │
                         │ priority         │
                         │ projectId (FK)   │
                         │ assigneeId (FK)  │◄─────┐
                         │ createdById (FK) │      │
                         │ startDate        │      │
                         │ dueDate          │      │
                         │ duration         │      │
                         │ progress         │      │
                         │ parentTaskId(FK) │──┐   │
                         └──────────────────┘  │   │
                                │              │   │
                                │ Self-Ref     │   │
                                └──────────────┘   │
                                                   │
                        ┌──────────────────────────┘
                        │
                        │
                 ┌──────────────┐
                 │     USER     │
                 │──────────────│
                 │ id (PK)      │
                 │ ...          │
                 └──────────────┘


┌──────────────────┐         ┌──────────────────┐
│      TASK        │  1:M    │ TASK_DEPENDENCY  │
│──────────────────│◄────────│──────────────────│
│ id (PK)          │         │ id (PK)          │
│ ...              │         │ taskId (FK)      │
└──────────────────┘         │ dependsOnTaskId  │
       ▲                     └──────────────────┘
       │                              │
       │                              │
       └──────────────────────────────┘


┌──────────────────┐         ┌──────────────┐
│      TASK        │  1:M    │  TIME_ENTRY  │
│──────────────────│◄────────│──────────────│
│ id (PK)          │         │ id (PK)      │
│ ...              │         │ userId (FK)  │──┐
└──────────────────┘         │ taskId (FK)  │  │
                             │ startTime    │  │
                             │ endTime      │  │
                             │ duration     │  │
                             │ isBillable   │  │
                             └──────────────┘  │
                                    │          │
                                    └──────────┼──────┐
                                               │      │
                                        ┌──────────────┐
                                        │     USER     │
                                        │──────────────│
                                        │ id (PK)      │
                                        └──────────────┘


┌──────────────────┐         ┌──────────────┐
│      TASK        │  1:M    │   COMMENT    │
│──────────────────│◄────────│──────────────│
│ id (PK)          │         │ id (PK)      │
│ ...              │         │ content      │
└──────────────────┘         │ taskId (FK)  │
                             │ userId (FK)  │──┐
                             └──────────────┘  │
                                    │          │
                                    └──────────┼──────┐
                                               │      │
                                        ┌──────────────┐
                                        │     USER     │
                                        │──────────────│
                                        │ id (PK)      │
                                        └──────────────┘


┌──────────────────┐
│      FILE        │ (Polymorphic)
│──────────────────│
│ id (PK)          │
│ name             │
│ url              │
│ entityType       │ ──► "PROJECT" or "TASK"
│ entityId (FK)    │ ──► projectId or taskId
│ uploadedBy       │
│ isArchived       │
└──────────────────┘


┌──────────────────┐
│  ACTIVITY_LOG    │ (Polymorphic)
│──────────────────│
│ id (PK)          │
│ userId (FK)      │──┐
│ action           │  │
│ entityType       │ ──► "PROJECT" or "TASK"
│ entityId (FK)    │ ──► projectId or taskId
│ metadata (JSON)  │  │
│ createdAt        │  │
└──────────────────┘  │
         │            │
         └────────────┼──────┐
                      │      │
               ┌──────────────┐
               │     USER     │
               │──────────────│
               │ id (PK)      │
               └──────────────┘


┌──────────────────┐
│  NOTIFICATION    │
│──────────────────│
│ id (PK)          │
│ userId (FK)      │──┐
│ title            │  │
│ message          │  │
│ type             │  │
│ status           │  │
│ metadata (JSON)  │  │
│ readAt           │  │
└──────────────────┘  │
         │            │
         └────────────┼──────┐
                      │      │
               ┌──────────────┐
               │     USER     │
               │──────────────│
               │ id (PK)      │
               └──────────────┘
```

---

## Relationship Summary

### Direct Relationships
| Parent | Child | Type | Notes |
|--------|-------|------|-------|
| User | RefreshToken | 1:M | Auth tokens |
| User | ProjectMember | 1:M | Project membership |
| User | Task | 1:M | Assigned tasks |
| User | TimeEntry | 1:M | Time logs |
| User | Comment | 1:M | Task comments |
| User | ActivityLog | 1:M | User actions |
| User | Notification | 1:M | User notifications |
| Project | ProjectMember | 1:M | Team members |
| Project | Task | 1:M | Project tasks |
| Project | Budget | 1:1 | Project budget |
| Budget | Expense | 1:M | Budget expenses |
| Task | Task | 1:M | Self-ref (subtasks) |
| Task | TaskDependency | 1:M | Task dependencies |
| Task | TimeEntry | 1:M | Task time logs |
| Task | Comment | 1:M | Task discussions |

### Polymorphic Relationships
| Model | Links To | Via | Notes |
|-------|----------|-----|-------|
| File | Project OR Task | entityType + entityId | File attachments |
| ActivityLog | Project OR Task | entityType + entityId | Audit trail |

### Many-to-Many
| Table A | Table B | Join Table | Notes |
|---------|---------|------------|-------|
| User | Project | ProjectMember | With role field |
| Task | Task | TaskDependency | Gantt dependencies |

---

## Indexes Overview

### Performance Indexes
- All foreign keys are indexed
- All enum fields (status, role, priority) indexed
- All timestamp fields indexed for sorting
- Composite indexes for polymorphic relations

### Unique Constraints
- User.email (unique)
- RefreshToken.token (unique)
- Budget.projectId (unique - 1:1 relation)
- ProjectMember (projectId, userId) (composite unique)
- TaskDependency (taskId, dependsOnTaskId) (composite unique)

---

## Data Flow Examples

### Creating a Task
1. User authenticated (RefreshToken)
2. User must be ProjectMember of target Project
3. Task created with projectId, assigneeId
4. ActivityLog entry created (action: CREATED)
5. Notification sent to assignee

### Tracking Time
1. User starts timer (create TimeEntry with startTime)
2. User stops timer (update TimeEntry with endTime)
3. Duration calculated
4. Aggregated for Task time tracking
5. Aggregated for Project time tracking
6. Used in analytics reports

### Budget Management
1. Project created
2. Budget created (1:1 with Project)
3. Expenses added to Budget
4. Status workflow: PENDING → APPROVED/REJECTED
5. Analytics: sum(expenses) vs totalBudget

### Gantt Rendering
1. Fetch all Tasks for Project
2. Load TaskDependencies
3. Render tree using parentTaskId
4. Draw dependencies using TaskDependency
5. Calculate critical path
6. Show progress bars using progress field

---

## Schema Statistics

- **Total Models:** 13
- **Total Enums:** 7
- **Total Relationships:** 30+
- **Polymorphic Relations:** 2 (File, ActivityLog)
- **Many-to-Many:** 2 (User↔Project, Task↔Task)
- **One-to-One:** 1 (Project↔Budget)
- **One-to-Many:** 20+
- **Self-Referencing:** 1 (Task subtasks)

---

## Frontend Integration Points

### Shared Enums
All enums can be exported and shared with frontend TypeScript:
- UserRole
- ProjectStatus
- TaskStatus
- TaskPriority
- ExpenseStatus
- EntityType
- ActivityAction
- NotificationStatus

### API Response Shapes
Prisma models directly map to API responses:
- `GET /api/projects/:id` → Project model + relations
- `GET /api/tasks/:id` → Task model + relations
- `GET /api/time-entries` → TimeEntry[] with user/task
- `GET /api/analytics/activity` → ActivityLog[] with aggregations

### Real-time Events (Socket.IO)
ActivityLog table feeds real-time updates:
- Task created → broadcast to ProjectMembers
- Comment added → notify Task assignee
- Status changed → update Gantt chart

---

This ERD provides a complete visual overview of the Project Pulse PMS database architecture.
