# Schema Quick Reference

## Models (13 Total)

```
1.  User             - Authentication & user management
2.  RefreshToken     - JWT refresh tokens
3.  Project          - Project management
4.  ProjectMember    - User-Project join table (with roles)
5.  Task             - Task management + Gantt support
6.  TaskDependency   - Task dependencies for Gantt
7.  TimeEntry        - Time tracking
8.  Comment          - Task comments
9.  File             - File attachments (polymorphic)
10. Budget           - Project budgets
11. Expense          - Budget expenses
12. ActivityLog      - Audit trail (polymorphic)
13. Notification     - User notifications
```

## Enums (7 Total)

```typescript
UserRole           → ADMIN | MANAGER | MEMBER
ProjectStatus      → PLANNED | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED
TaskStatus         → TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED
TaskPriority       → LOW | MEDIUM | HIGH
ExpenseStatus      → PENDING | APPROVED | REJECTED
EntityType         → PROJECT | TASK | USER
ActivityAction     → CREATED | UPDATED | DELETED | ASSIGNED | COMMENTED | STATUS_CHANGED | PRIORITY_CHANGED | COMPLETED | ARCHIVED
NotificationStatus → UNREAD | READ | ARCHIVED
```

## Key Relationships

```
User ↔ Project (many-to-many) via ProjectMember
Project → Task (one-to-many)
Task → User (assignee)
Task → Task (self-ref: parent/subtasks)
Task ↔ Task (dependencies) via TaskDependency
Task → TimeEntry (one-to-many)
Task → Comment (one-to-many)
Project ↔ Budget (one-to-one)
Budget → Expense (one-to-many)
File → Project/Task (polymorphic)
ActivityLog → Project/Task (polymorphic)
```

## Gantt Chart Support

```javascript
// Task fields for Gantt
{
  startDate: DateTime      // Timeline start
  dueDate: DateTime        // Timeline end
  duration: Int            // Hours
  progress: Int            // 0-100%
  parentTaskId: String     // Hierarchy
  orderIndex: Int          // Display order
}

// TaskDependency for critical path
{
  taskId: String              // Dependent task
  dependsOnTaskId: String     // Blocking task
}
```

## Time Tracking

```javascript
// TimeEntry
{
  userId: String
  taskId: String
  startTime: DateTime
  endTime: DateTime
  duration: Int         // minutes
  isBillable: Boolean
}

// Aggregations
- Total time per task
- Total time per project
- Total time per user
- Billable vs non-billable
```

## Budget Management

```javascript
// Budget (1:1 with Project)
{
  projectId: String
  totalBudget: Float
  currency: String
}

// Expense
{
  budgetId: String
  amount: Float
  category: String
  status: ExpenseStatus  // PENDING | APPROVED | REJECTED
  expenseDate: DateTime
}

// Calculations
- sum(expenses.amount) vs budget.totalBudget
- Budget utilization %
- Spending by category
```

## Analytics

```javascript
// ActivityLog - Complete audit trail
{
  userId: String
  action: ActivityAction
  entityType: EntityType
  entityId: String
  metadata: JSON
  createdAt: DateTime
}

// Use cases
- User activity reports
- Project timeline
- Task lifecycle
- Time tracking reports
- Budget analytics
```

## Indexes (30+)

All foreign keys indexed  
All status/enum fields indexed  
All date fields indexed  
Composite indexes for polymorphic relations  

## Common Queries

```typescript
// Get project with tasks and team
prisma.project.findUnique({
  where: { id },
  include: {
    tasks: { include: { assignee: true } },
    members: { include: { user: true } }
  }
})

// Get task with dependencies
prisma.task.findUnique({
  where: { id },
  include: {
    dependencies: { include: { dependsOnTask: true } },
    subtasks: true,
    timeEntries: true
  }
})

// Time tracking report
prisma.timeEntry.groupBy({
  by: ['userId', 'taskId'],
  _sum: { duration: true },
  where: {
    startTime: { gte: startDate, lte: endDate }
  }
})

// Activity log for analytics
prisma.activityLog.findMany({
  where: { entityType: 'PROJECT', entityId },
  include: { user: true },
  orderBy: { createdAt: 'desc' }
})
```

## Next Commands (After Approval)

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

---

**Schema Status:** ✅ Complete and Ready for Review
