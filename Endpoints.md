### Development & Status Routes

These routes are for development, testing, and monitoring the application's health.

***

**GET `/api/v1/status`**
* **Description**: Returns the current status of the application and its core dependencies.
* **Authorization**: Public.
* **Success Response (200)**: An object detailing the overall status, timestamp, app name, version, metrics (uptime, memory usage), and the status of individual dependencies like the database and job queue.

**GET `/data`**
* **Description**: A development-only endpoint to retrieve sample data.
* **Authorization**: Public.
* **Success Response (200)**: Returns a JSON object with a message and a timestamp.

**GET `/error/generic`**
* **Description**: A development-only endpoint to test generic internal server errors.
* **Authorization**: Public.

**GET `/error/specific`**
* **Description**: A development-only endpoint to test specific "Not Found" errors.
* **Authorization**: Public.

**GET `/error/validation-sim`**
* **Description**: A development-only endpoint to test validation errors.
* **Authorization**: Public.

### User Management & Authentication

Endpoints for managing users, roles, permissions, and handling authentication.

***

#### Authentication

**POST `/api/v1/auth/login`**
* **Description**: Handles user login with email and password.
* **Authorization**: Public.
* **Request Body**: `LoginDtoSchema` requires an `email` (string) and `password` (string).
* **Success Response (200)**: `AccessTokenResponseSchema` returns a JSON object containing the `accessToken` (string). A `refreshToken` is also set as an HTTP-only cookie.

**POST `/api/v1/auth/refresh-token`**
* **Description**: Generates a new access token using a valid refresh token from cookies.
* **Authorization**: Public (requires `refreshToken` cookie).
* **Success Response (200)**: `AccessTokenResponseSchema` returns a new `accessToken`. A new `refreshToken` is also set as an HTTP-only cookie.

**POST `/api/v1/auth/logout`**
* **Description**: Logs out the user by revoking the refresh token.
* **Authorization**: Public (requires `refreshToken` cookie).
* **Success Response (204)**: No content.

#### Password Management

**POST `/api/v1/auth/forgot-password`**
* **Description**: Initiates the password reset process for a user.
* **Authorization**: Public.
* **Request Body**: `ForgotPasswordDtoSchema` requires an `email` (string).
* **Success Response (200)**: A confirmation message.

**GET `/api/v1/auth/reset-password/:token`**
* **Description**: Verifies the validity of a password reset token.
* **Authorization**: Public.
* **URL Params**: `token` (string).
* **Success Response (200)**: A confirmation message indicating the token is valid.

**POST `/api/v1/auth/reset-password`**
* **Description**: Resets the user's password using a valid token and a new password.
* **Authorization**: Public.
* **Request Body**: `ResetPasswordDtoSchema` requires a `token` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200)**: A confirmation message.

**POST `/api/v1/auth/setup-password`**
* **Description**: Allows a new user to set their initial password using an invitation token.
* **Authorization**: Public.
* **Request Body**: `SetupPasswordDtoSchema` requires a `token` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200)**: A confirmation message.

**POST `/api/v1/users/me/change-password`**
* **Description**: Allows an authenticated user to change their own password.
* **Authorization**: Authenticated User.
* **Request Body**: `ChangePasswordDtoSchema` requires `currentPassword` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200)**: A confirmation message.

#### User Profile (`/api/v1/users`)

**GET `/api/v1/users/me`**
* **Description**: Retrieves the complete profile for the currently authenticated user.
* **Authorization**: Authenticated User.
* **Success Response (200)**: A `SafeUser` object, which includes user and person details but omits the password.

**PUT `/api/v1/users/me/profile`**
* **Description**: Allows the authenticated user to update their own profile information.
* **Authorization**: Authenticated User.
* **Request Body**: `UpdateUserProfileDtoSchema` allows updating `firstName`, `lastName`, `email`, `avatarUrl`, `biography`, `phoneNumber`, `birthday`, `socialLinks`, and `skillIds`.
* **Success Response (200)**: The updated `SafeUser` object.

**PATCH `/api/v1/users/me/avatar`**
* **Description**: Uploads a new profile picture for the authenticated user.
* **Authorization**: Authenticated User.
* **Request Body**: Multipart form data containing the image file.
* **Success Response (200)**: The `SafeUser` object with the updated `avatarUrl`.

#### User Administration (`/api/v1/admin/users`)

**POST `/api/v1/admin/users`**
* **Description**: Creates a new user and sends an invitation email.
* **Authorization**: Admin with `create` permission on `User`.
* **Request Body**: `CreateUserDtoSchema` requires a `person` object (`firstName`, `lastName`, `email`) and an array of `roles`.
* **Success Response (201)**: A confirmation message and the new `SafeUser` object.

**GET `/api/v1/admin/users`**
* **Description**: Lists all users with pagination and filtering capabilities.
* **Authorization**: Admin with `read` permission on `User`.
* **Query Params**: Supports `page`, `limit`, `sortBy`, `sortOrder`, `search`, `isActive`, and `roleName`.
* **Success Response (200)**: A paginated response of `SafeUser` objects.

**DELETE `/api/v1/admin/users`**
* **Description**: Bulk deactivates (soft deletes) multiple users.
* **Authorization**: Admin with `delete` permission on `User`.
* **Request Body**: `BulkDeleteUsersDtoSchema` requires an array of `ids` (UUIDs).
* **Success Response (200)**: An object containing the `count` of deleted users.

**GET `/api/v1/admin/users/:userId`**
* **Description**: Retrieves a single user by their ID.
* **Authorization**: Admin with `read` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Success Response (200)**: The corresponding `SafeUser` object.

**PUT `/api/v1/admin/users/:userId`**
* **Description**: Updates a user's profile information.
* **Authorization**: Admin with `update` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Request Body**: `AdminUpdateUserDtoSchema` allows updating profile fields like `firstName`, `lastName`, `email`, etc..
* **Success Response (200)**: The updated `SafeUser` object.

**DELETE `/api/v1/admin/users/:userId`**
* **Description**: Deactivates (soft deletes) a user.
* **Authorization**: Admin with `delete` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Success Response (204)**: No content.

**DELETE `/api/v1/admin/users/:userId/hard`**
* **Description**: Permanently deletes a user from the database.
* **Authorization**: Admin with `hardDelete` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Success Response (204)**: No content.

**PATCH `/api/v1/admin/users/:userId/status`**
* **Description**: Sets a user's active or inactive status.
* **Authorization**: Admin with `manage` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Request Body**: `AdminSetUserStatusDtoSchema` requires `isActive` (boolean).
* **Success Response (200)**: The updated `SafeUser` object.

**PATCH `/api/v1/admin/users/:userId/avatar`**
* **Description**: Uploads or updates a specific user's avatar.
* **Authorization**: Admin with `update` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Request Body**: Multipart form data containing the image file.
* **Success Response (200)**: The `SafeUser` object with the new `avatarUrl`.

**POST `/api/v1/admin/users/:userId/roles`**
* **Description**: Assigns a role to a user.
* **Authorization**: Admin with `assignRoles` permission on `User`.
* **URL Params**: `userId` (UUID).
* **Request Body**: `AdminAssignRoleDtoSchema` requires a `roleId` (UUID).
* **Success Response (200)**: The updated `SafeUser` object.

**DELETE `/api/v1/admin/users/:userId/roles/:roleId`**
* **Description**: Removes a role from a user.
* **Authorization**: Admin with `assignRoles` permission on `User`.
* **URL Params**: `userId` (UUID) and `roleId` (UUID).
* **Success Response (200)**: The updated `SafeUser` object.

#### Roles & Permissions (`/api/v1/admin`)

**GET `/api/v1/admin/roles`**
* **Description**: Lists all available roles and their assigned permissions.
* **Authorization**: Admin with `read` permission on `Role`.
* **Query Params**: Supports `page` and `limit`.
* **Success Response (200)**: A paginated list of `RoleWithPermissions` objects.

**GET `/api/v1/admin/roles/:roleId`**
* **Description**: Retrieves a single role and its permissions by ID.
* **Authorization**: Admin with `read` permission on `Role`.
* **URL Params**: `roleId` (UUID).
* **Success Response (200)**: A single `RoleWithPermissions` object.

**POST `/api/v1/admin/roles/:roleId/permissions`**
* **Description**: Assigns a permission to a role.
* **Authorization**: Admin with `manage` permission on `Role`.
* **URL Params**: `roleId` (UUID).
* **Request Body**: `AssignPermissionDtoSchema` requires `permissionId` (UUID).
* **Success Response (200)**: The updated `RoleWithPermissions` object.

**DELETE `/api/v1/admin/roles/:roleId/permissions/:permissionId`**
* **Description**: Revokes a permission from a role.
* **Authorization**: Admin with `manage` permission on `Role`.
* **URL Params**: `roleId` (UUID) and `permissionId` (UUID).
* **Success Response (200)**: The updated `RoleWithPermissions` object.

**GET `/api/v1/admin/permissions`**
* **Description**: Lists all available permissions.
* **Authorization**: Admin with `read` permission on `Permission`.
* **Query Params**: Supports `page`, `limit`, `sortBy`, `sortOrder`, and `search`.
* **Success Response (200)**: A paginated list of `Permission` objects.

### Workspaces & Teams

Endpoints for managing workspaces and the teams within them.

***

#### Workspaces (`/api/v1/workspaces`)

**POST `/api/v1/workspaces`**
* **Description**: Creates a new workspace.
* **Authorization**: Authenticated User with `create` permission on `Workspace`.
* **Request Body**: `CreateWorkspaceDtoSchema` requires a `name` (string) and an optional `description` (string).
* **Success Response (201)**: The newly created `Workspace` object.

**GET `/api/v1/workspaces`**
* **Description**: Lists all workspaces the current user is a member of.
* **Authorization**: Authenticated User.
* **Query Params**: Supports `page`, `limit`, `sortBy`, `sortOrder`, and `search`.
* **Success Response (200)**: A paginated list of `Workspace` objects.

**GET `/api/v1/workspaces/:workspaceId`**
* **Description**: Retrieves a single workspace by its ID.
* **Authorization**: Workspace Member with `read` permission.
* **URL Params**: `workspaceId` (UUID).
* **Success Response (200)**: The `Workspace` object.

**PUT `/api/v1/workspaces/:workspaceId`**
* **Description**: Updates a workspace's details.
* **Authorization**: Workspace Member with `update` permission.
* **URL Params**: `workspaceId` (UUID).
* **Request Body**: `UpdateWorkspaceDtoSchema` allows updating `name` and `description`.
* **Success Response (200)**: The updated `Workspace` object.

**DELETE `/api/v1/workspaces/:workspaceId`**
* **Description**: Deletes a workspace.
* **Authorization**: Workspace Member with `delete` permission.
* **URL Params**: `workspaceId` (UUID).
* **Success Response (204)**: No content.

#### Teams (`/api/v1/workspaces/:workspaceId/teams`)

**POST `/api/v1/workspaces/:workspaceId/teams`**
* **Description**: Creates a new team within a workspace.
* **Authorization**: Workspace Member with `manage` permission on `Team`.
* **URL Params**: `workspaceId` (UUID).
* **Request Body**: `CreateTeamDtoSchema` requires a `name` and optional `description` and `memberIds`.
* **Success Response (201)**: The new `Team` object.

**GET `/api/v1/workspaces/:workspaceId/teams`**
* **Description**: Lists all teams within a workspace.
* **Authorization**: Workspace Member with `read` permission on `Team`.
* **URL Params**: `workspaceId` (UUID).
* **Query Params**: Supports `page`, `limit`, `sortBy`, `sortOrder`, and `search`.
* **Success Response (200)**: A paginated list of `Team` objects.

**GET `/api/v1/teams/:teamId`**
* **Description**: Retrieves a single team by ID.
* **Authorization**: Workspace Member with `read` permission on `Team`.
* **URL Params**: `teamId` (UUID).
* **Success Response (200)**: The `Team` object.

**PUT `/api/v1/teams/:teamId`**
* **Description**: Updates a team's details.
* **Authorization**: Workspace Member with `manage` permission on `Team`.
* **URL Params**: `teamId` (UUID).
* **Request Body**: `UpdateTeamDtoSchema` allows updating `name`, `description`, and `memberIds`.
* **Success Response (200)**: The updated `Team` object.

**DELETE `/api/v1/teams/:teamId`**
* **Description**: Deletes a team.
* **Authorization**: Workspace Member with `manage` permission on `Team`.
* **URL Params**: `teamId` (UUID).
* **Success Response (204)**: No content.

**POST `/api/v1/teams/:teamId/members/:userId`**
* **Description**: Adds a user to a team.
* **Authorization**: Workspace Member with `manage` permission on `Team`.
* **URL Params**: `teamId` (UUID) and `userId` (UUID).
* **Success Response (200)**: The updated `Team` object.

**DELETE `/api/v1/teams/:teamId/members/:userId`**
* **Description**: Removes a user from a team.
* **Authorization**: Workspace Member with `manage` permission on `Team`.
* **URL Params**: `teamId` (UUID) and `userId` (UUID).
* **Success Response (200)**: The updated `Team` object.

### Global & System Endpoints

These endpoints provide system-wide functionality like search, announcements, and webhooks.

***

**GET `/api/v1/search`**
* **Description**: Performs a global search across various accessible entities.
* **Authorization**: Authenticated User.
* **Query Params**: `q` (string, min 2 chars), `limit` (number, default 5), and `type` (optional enum: `project`, `task`, etc.).
* **Success Response (200)**: `SearchResultsSchema` which is an object containing arrays of results for `projects`, `tasks`, `publications`, and `users`.

**POST `/api/v1/webhooks/in/:secret`**
* **Description**: An endpoint for receiving incoming webhooks to trigger actions, such as creating a task.
* **Authorization**: Public (requires secret in URL).
* **URL Params**: `secret` (string).
* **Request Body**: A flexible JSON payload, which is parsed by the corresponding job handler.

#### Announcements (`/api/v1/announcements`)

**GET `/api/v1/announcements/active`**
* **Description**: Retrieves currently published and non-expired announcements for the logged-in user.
* **Authorization**: Authenticated User.
* **Success Response (200)**: An array of `Announcement` objects.

**GET `/api/v1/announcements`**
* **Description**: Lists all announcements for administrative purposes.
* **Authorization**: Admin with `read` permission on `Announcement`.
* **Query Params**: Supports `page`, `limit`, `status`, `search`, `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `Announcement` objects.

**DELETE `/api/v1/announcements`**
* **Description**: Bulk deletes announcements.
* **Authorization**: Admin with `manage` permission on `Announcement`.
* **Request Body**: `BulkDeleteAnnouncementsDtoSchema` requires an array of `ids` (UUIDs).
* **Success Response (200)**: An object with the `count` of deleted announcements.

### System Administration

Endpoints for system-level administration, including background jobs, workflows, and system-wide notifications.

***

#### Jobs (`/api/v1/admin/jobs`)

**GET `/api/v1/admin/jobs`**
* **Description**: Lists all background jobs.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Query Params**: `JobListQuerySchema` supports `page`, `limit`, `type` (string), `status` (enum), `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `Job` objects.

**POST `/api/v1/admin/jobs`**
* **Description**: Manually creates and enqueues a new background job.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Request Body**: `CreateJobDtoSchema` requires `type` (string) and allows for `payload`, `priority`, `maxAttempts`, `scheduledAt`, and `delay`.
* **Success Response (201)**: The created `Job` object.

**GET `/api/v1/admin/jobs/:jobId`**
* **Description**: Retrieves a single job by its ID, including its execution attempts.
* **Authorization**: Admin with `manage` permission on `Job`.
* **URL Params**: `jobId` (UUID).
* **Success Response (200)**: A `JobWithAttempts` object, which includes the job details and an array of its attempts.

**POST `/api/v1/admin/jobs/:jobId/retry`**
* **Description**: Manually retries a failed or cancelled job.
* **Authorization**: Admin with `manage` permission on `Job`.
* **URL Params**: `jobId` (UUID).
* **Success Response (200)**: A confirmation message and the `Job` object that was rescheduled.

**POST `/api/v1/admin/jobs/:jobId/cancel`**
* **Description**: Cancels a pending or running job.
* **Authorization**: Admin with `manage` permission on `Job`.
* **URL Params**: `jobId` (UUID).
* **Success Response (200)**: A confirmation message and the cancelled `Job` object.

#### Job Schedules (`/api/v1/admin/jobs/schedules`)

**GET `/api/v1/admin/jobs/schedules`**
* **Description**: Lists all scheduled (cron) jobs.
* **Authorization**: Admin with `manage` permission on `JobSchedule`.
* **Query Params**: Supports `page`, `limit`, `jobType`, `isActive`, `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `JobSchedule` objects.

**POST `/api/v1/admin/jobs/schedules`**
* **Description**: Creates a new scheduled job.
* **Authorization**: Admin with `manage` permission on `JobSchedule`.
* **Request Body**: `CreateJobScheduleDtoSchema` requires `name`, `jobType`, `cronExpression`, and allows for `payload` and `isActive`.
* **Success Response (201)**: The created `JobSchedule` object.

**GET `/api/v1/admin/jobs/schedules/:scheduleId`**
* **Description**: Retrieves a single scheduled job by its ID.
* **Authorization**: Admin with `manage` permission on `JobSchedule`.
* **URL Params**: `scheduleId` (UUID).
* **Success Response (200)**: The `JobSchedule` object.

**PUT `/api/v1/admin/jobs/schedules/:scheduleId`**
* **Description**: Updates a scheduled job.
* **Authorization**: Admin with `manage` permission on `JobSchedule`.
* **URL Params**: `scheduleId` (UUID).
* **Request Body**: `UpdateJobScheduleDtoSchema` allows updating `cronExpression`, `payload`, and `isActive`.
* **Success Response (200)**: The updated `JobSchedule` object.

**POST `/api/v1/admin/jobs/schedules/:scheduleId/trigger`**
* **Description**: Manually triggers a scheduled job to run immediately.
* **Authorization**: Admin with `manage` permission on `Job`.
* **URL Params**: `scheduleId` (UUID).
* **Success Response (200)**: A confirmation message and the ID of the newly created job.

#### Job Monitoring & Maintenance (`/api/v1/admin/jobs/system`)

**GET `/api/v1/admin/jobs/system/queue-stats`**
* **Description**: Retrieves statistics about the job queue (e.g., counts of pending, running, failed jobs).
* **Authorization**: Admin with `manage` permission on `Job`.
* **Success Response (200)**: A `QueueStats` object with detailed job counts and rates.

**GET `/api/v1/admin/jobs/system/job-types`**
* **Description**: Retrieves a list of all job types registered in the system.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Success Response (200)**: An object containing an array of `RegisteredJobTypeDto`.

**GET `/api/v1/admin/jobs/system/status`**
* **Description**: Gets the current operational status of the job processing system.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Success Response (200)**: A `JobSystemStatusResponse` object showing if the processor and scheduler are running.

**POST `/api/v1/admin/jobs/system/cleanup`**
* **Description**: Manually triggers a cleanup of old, completed, and failed job records from the database.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Success Response (200)**: A `JobCleanupResponse` object with counts of deleted jobs.

**POST `/api/v1/admin/jobs/system/emit-stats`**
* **Description**: Emits the current queue statistics over the real-time (WebSocket) channel.
* **Authorization**: Admin with `manage` permission on `Job`.
* **Success Response (200)**: A confirmation message.

#### Notifications (`/api/v1/notifications`)

**GET `/api/v1/notifications`**
* **Description**: Retrieves a paginated list of notifications for the authenticated user.
* **Authorization**: Authenticated User.
* **Query Params**: `GetNotificationsQuerySchema` supports `page`, `limit`, and `isRead` (boolean).
* **Success Response (200)**: `PaginatedNotificationsResponseSchema` containing notification data and an `unreadCount`.

**PATCH `/api/v1/notifications/:notificationId/read`**
* **Description**: Marks a specific notification as read.
* **Authorization**: Authenticated User.
* **URL Params**: `notificationId` (UUID).
* **Success Response (200)**: The updated `Notification` object.

**POST `/api/v1/notifications/mark-all-as-read`**
* **Description**: Marks all of the user's unread notifications as read.
* **Authorization**: Authenticated User.
* **Success Response (200)**: An object with the `count` of notifications that were updated.

**POST `/api/v1/notifications/broadcast`**
* **Description**: Sends a notification to all users or a targeted subset by role.
* **Authorization**: Admin with `manage` permission on `NotificationBroadcast`.
* **Request Body**: `BroadcastNotificationDtoSchema` requires a `message` and allows specifying `type`, `severity`, `actions`, and `target` roles.
* **Success Response (200)**: An object with the `count` of users who received the notification.

**GET `/api/v1/notifications/preferences`**
* **Description**: Gets the current user's notification preferences.
* **Authorization**: Authenticated User.
* **Success Response (200)**: A `UserNotificationPreferences` object.

**PUT `/api/v1/notifications/preferences`**
* **Description**: Updates the current user's notification preferences.
* **Authorization**: Authenticated User.
* **Request Body**: `UpdateUserNotificationPreferencesDtoSchema` allows updating channel preferences (`inApp`, `email`) and `emailDigestFrequency`.
* **Success Response (200)**: The updated `UserNotificationPreferences` object.

#### Workflows (`/api/v1/admin/workflows`)

**GET `/api/v1/admin/workflows`**
* **Description**: Lists all configured workflows.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **Query Params**: Supports `page`, `limit`, `enabled` (boolean), `triggerType` (enum), and `search`.
* **Success Response (200)**: A paginated list of `Workflow` objects.

**POST `/api/v1/admin/workflows`**
* **Description**: Creates a new workflow.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **Request Body**: `CreateWorkflowDtoSchema` requires `name`, `actions`, and either a `triggerType` or `cronExpression`.
* **Success Response (201)**: The created `Workflow` object.

**GET `/api/v1/admin/workflows/:workflowId`**
* **Description**: Retrieves a single workflow by its ID.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **URL Params**: `workflowId` (UUID).
* **Success Response (200)**: The `Workflow` object.

**PUT `/api/v1/admin/workflows/:workflowId`**
* **Description**: Updates an existing workflow.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **URL Params**: `workflowId` (UUID).
* **Request Body**: `UpdateWorkflowDtoSchema` allows updating all workflow properties.
* **Success Response (200)**: The updated `Workflow` object.

**POST `/api/v1/admin/workflows/:workflowId/toggle`**
* **Description**: Enables or disables a workflow.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **URL Params**: `workflowId` (UUID).
* **Request Body**: `ToggleWorkflowBodySchema` requires `enabled` (boolean).
* **Success Response (200)**: The updated `Workflow` object.

**GET `/api/v1/admin/workflows/:workflowId/runs`**
* **Description**: Lists the execution history (runs) for a specific workflow.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **URL Params**: `workflowId` (UUID).
* **Query Params**: Supports `page`, `limit`, and `status`.
* **Success Response (200)**: A paginated list of `WorkflowRun` objects.

**GET `/api/v1/admin/workflows/workflow-runs/:runId`**
* **Description**: Gets the details of a specific workflow run, including logs.
* **Authorization**: Admin with `manage` permission on `Workflow`.
* **URL Params**: `runId` (UUID).
* **Success Response (200)**: The `WorkflowRun` object.

### Project Management

Endpoints for managing projects, tasks, views, and related entities.

***

#### Projects (`/api/v1/projects`)

**POST `/api/v1/workspaces/:workspaceId/projects`**
* **Description**: Creates a new project within a specific workspace.
* **Authorization**: Workspace Member with `create` permission on `Project`.
* **URL Params**: `workspaceId` (UUID).
* **Request Body**: `CreateProjectDtoSchema` requires `name` and allows `description`, `status`, etc. `workspaceId` is taken from the URL.
* **Success Response (201)**: The newly created `Project` object.

**GET `/api/v1/workspaces/:workspaceId/projects`**
* **Description**: Lists all projects within a specific workspace.
* **Authorization**: Workspace Member with `read` permission on `Project`.
* **URL Params**: `workspaceId` (UUID).
* **Query Params**: Supports `page`, `limit`, `status`, `search`, `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `Project` objects.

**GET `/api/v1/projects/:projectId`**
* **Description**: Retrieves a single project by its ID.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Success Response (200)**: The `Project` object.

**PUT `/api/v1/projects/:projectId`**
* **Description**: Updates a project's details.
* **Authorization**: Project Member with `update` permission.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `UpdateProjectDtoSchema` allows updating fields like `name`, `description`, `status`, etc.
* **Success Response (200)**: The updated `Project` object.

**DELETE `/api/v1/projects/:projectId`**
* **Description**: Deletes a project.
* **Authorization**: Project Member with `delete` permission.
* **URL Params**: `projectId` (UUID).
* **Success Response (204)**: No content.

#### Tasks (`/api/v1/projects/:projectId/tasks`)

**POST `/api/v1/projects/:projectId/tasks`**
* **Description**: Creates a new task within a project.
* **Authorization**: Project Member with `read` permission (should likely be `create` on Task).
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateTaskBodySchema` requires `title` and allows for `description`, `status`, `priority`, `assigneeIds`, etc.
* **Success Response (201)**: The created `Task` object.

**GET `/api/v1/projects/:projectId/tasks`**
* **Description**: Lists all tasks within a project.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Query Params**: `ListTasksQuerySchema` supports extensive filtering and sorting (by status, priority, dates, etc.).
* **Success Response (200)**: A paginated list of `Task` objects.

**GET `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Retrieves a single task by its ID.
* **Authorization**: Project Member with `read` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Success Response (200)**: The `Task` object, including details like assignees, links, subtasks, and custom fields.

**PUT `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Updates a task's details.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: `UpdateTaskDtoSchema` allows updating any mutable task property.
* **Success Response (200)**: The updated `Task` object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Deletes a task.
* **Authorization**: Project Member with `delete` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Success Response (204)**: No content.

**PATCH `/api/v1/projects/:projectId/tasks/:taskId/move`**
* **Description**: Moves a task to a different column or position within a view (e.g., Kanban board).
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: `MoveTaskDtoSchema` requires `targetColumnId` and `orderInColumn`.
* **Success Response (200)**: The updated `Task` object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/assignees`**
* **Description**: Assigns a user to a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: `AssignUserToTaskDtoSchema` requires `userId`.
* **Success Response (200)**: The updated `Task` object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/assignees/:userId`**
* **Description**: Unassigns a user from a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `userId` (UUID).
* **Success Response (200)**: The updated `Task` object.

### Customer Relationship Management (CRM)

Endpoints for managing people, organizations, deals, and interactions.

***

#### People (`/api/v1/people`)

**GET `/api/v1/people`**
* **Description**: Retrieves a paginated list of people (contacts/users) in the CRM.
* **Authorization**: User with `read` permission on `Profile`.
* **Query Params**: `ListPeopleQuerySchema` supports `page`, `limit`, `sortBy`, `sortOrder`, and `search`.
* **Success Response (200)**: A paginated list of `Person` objects.

**POST `/api/v1/people`**
* **Description**: Creates a new person record.
* **Authorization**: User with `create` permission on `Profile`.
* **Request Body**: `CreatePersonDtoSchema` includes fields like `firstName`, `lastName`, `email`, `socialLinks`, and `skillIds`.
* **Success Response (201)**: The newly created `Person` object.

**DELETE `/api/v1/people`**
* **Description**: Bulk deletes people records.
* **Authorization**: User with `delete` permission on `Profile`.
* **Request Body**: `BulkDeletePeopleDtoSchema` requires an array of `ids` (UUIDs).
* **Success Response (200)**: An object containing the `count` of deleted people.

**GET `/api/v1/people/:personId`**
* **Description**: Retrieves a single person by their ID.
* **Authorization**: User with `read` permission on `Profile`.
* **URL Params**: `personId` (UUID).
* **Success Response (200)**: The `Person` object.

**PUT `/api/v1/people/:personId`**
* **Description**: Updates a person's details.
* **Authorization**: User with `update` permission on `Profile`.
* **URL Params**: `personId` (UUID).
* **Request Body**: `UpdatePersonDtoSchema` allows updating any of the person's fields.
* **Success Response (200)**: The updated `Person` object.

**DELETE `/api/v1/people/:personId`**
* **Description**: Deletes a person record.
* **Authorization**: User with `delete` permission on `Profile`.
* **URL Params**: `personId` (UUID).
* **Success Response (204)**: No content.

#### Organizations (`/api/v1/organizations`)

**GET `/api/v1/organizations`**
* **Description**: Lists all organizations.
* **Authorization**: User with `read` permission on `User` (likely should be `Organization`).
* **Query Params**: `ListOrganizationsQuerySchema` supports `page`, `limit`, `sortBy`, `sortOrder`, and `search`.
* **Success Response (200)**: A paginated list of `Organization` objects, including associated people.

**POST `/api/v1/organizations`**
* **Description**: Creates a new organization.
* **Authorization**: User with `create` permission on `User` (likely should be `Organization`).
* **Request Body**: `CreateOrganizationDtoSchema` requires `name` and allows `description`, `domain`, and `logoUrl`.
* **Success Response (201)**: The new `Organization` object.

**GET `/api/v1/organizations/:organizationId`**
* **Description**: Retrieves a single organization by ID.
* **Authorization**: User with `read` permission on `User` (likely should be `Organization`).
* **URL Params**: `organizationId` (UUID).
* **Success Response (200)**: The `Organization` object.

**PUT `/api/v1/organizations/:organizationId`**
* **Description**: Updates an organization's details.
* **Authorization**: User with `update` permission on `User` (likely should be `Organization`).
* **URL Params**: `organizationId` (UUID).
* **Request Body**: `UpdateOrganizationDtoSchema` allows updating `name`, `description`, etc.
* **Success Response (200)**: The updated `Organization` object.

**POST `/api/v1/organizations/:organizationId/people`**
* **Description**: Adds a person to an organization, creating a link between them.
* **Authorization**: Not specified, likely requires update permissions on Organization.
* **URL Params**: `organizationId` (UUID).
* **Request Body**: `AddPersonToOrganizationDtoSchema` requires `personId` and an optional `role`.
* **Success Response (201)**: The updated `Organization` object with the new person in its `people` list.

#### Skills (`/api/v1/skills`)

**GET `/api/v1/skills`**
* **Description**: Lists all available skills that can be assigned to people.
* **Authorization**: Authenticated User.
* **Success Response (200)**: An array of `Skill` objects.

### Analytics

Endpoints for dashboards, widgets, and reporting.

***

#### Dashboards (`/api/v1/dashboards`)

**GET `/api/v1/workspaces/:workspaceId/dashboards`**
* **Description**: Lists all dashboards for a specific workspace.
* **Authorization**: Workspace Member with `read` permission.
* **URL Params**: `workspaceId` (UUID).
* **Query Params**: Supports `page`, `limit`, `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `Dashboard` objects.

**POST `/api/v1/workspaces/:workspaceId/dashboards`**
* **Description**: Creates a new dashboard within a workspace.
* **Authorization**: Workspace Member with `read` permission (likely should be `create`).
* **URL Params**: `workspaceId` (UUID).
* **Request Body**: `CreateDashboardDtoSchema` (omitting parent IDs) requires `name`.
* **Success Response (201)**: The created `Dashboard` object.

**GET `/api/v1/projects/:projectId/dashboards`**
* **Description**: Lists all dashboards for a specific project.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Query Params**: Supports `page`, `limit`, `sortBy`, and `sortOrder`.
* **Success Response (200)**: A paginated list of `Dashboard` objects.

**POST `/api/v1/projects/:projectId/dashboards`**
* **Description**: Creates a new dashboard within a project.
* **Authorization**: Project Member with `read` permission (likely should be `create`).
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateDashboardDtoSchema` (omitting parent IDs) requires `name`.
* **Success Response (201)**: The created `Dashboard` object.

**GET `/api/v1/dashboards/:dashboardId`**
* **Description**: Retrieves a single dashboard by ID.
* **Authorization**: User with `read` permission on `Project`.
* **URL Params**: `dashboardId` (UUID).
* **Success Response (200)**: The `Dashboard` object including its widgets.

**PUT `/api/v1/dashboards/:dashboardId`**
* **Description**: Updates a dashboard's details.
* **Authorization**: User with `update` permission on `Project`.
* **URL Params**: `dashboardId` (UUID).
* **Request Body**: `UpdateDashboardDtoSchema` allows updating `name` and `description`.
* **Success Response (200)**: The updated `Dashboard` object.

#### Widgets (`/api/v1/dashboards/:dashboardId/widgets`)

**POST `/api/v1/dashboards/:dashboardId/widgets`**
* **Description**: Creates a new widget and adds it to a dashboard.
* **Authorization**: User with `create` permission on `Project`.
* **URL Params**: `dashboardId` (UUID).
* **Request Body**: `CreateWidgetDtoSchema` requires `title`, `type`, `config`, and `layout`.
* **Success Response (201)**: The created `Widget` object.

**GET `/api/v1/dashboards/:dashboardId/widgets/:widgetId/data`**
* **Description**: Retrieves the processed data for a specific widget.
* **Authorization**: Authenticated User.
* **URL Params**: `dashboardId` (UUID), `widgetId` (UUID).
* **Success Response (200)**: A `ReportingWidgetData` object containing the widget's specific data payload.

#### Reports (`/api/v1/reports`)

**POST `/api/v1/reports`**
* **Description**: Creates a new report.
* **Authorization**: User with `create` permission on `Report`.
* **Request Body**: `CreateReportDtoSchema` requires `title` and can be associated with a workspace, project, or task.
* **Success Response (201)**: The created `Report` object.

**GET `/api/v1/reports`**
* **Description**: Lists all reports created by the user.
* **Authorization**: User with `read` permission on `Report`.
* **Query Params**: `ListReportsQuerySchema` supports filtering by `status`, `workspaceId`, `projectId`, `taskId`, and `search`.
* **Success Response (200)**: A paginated list of `Report` objects.

### Collaboration

Endpoints for collaborative features like comments, knowledge bases, and whiteboards.

***

#### Comments (`/api/v1/comments`)

**POST `/api/v1/comments`**
* **Description**: Creates a new comment on an entity (e.g., a Task).
* **Authorization**: User with `comment` permission on `Comment`.
* **Request Body**: `CreateCommentDtoSchema` requires `content`, `entityId`, and `entityType`.
* **Success Response (201)**: The created `Comment` object.

**GET `/api/v1/comments`**
* **Description**: Lists comments for a specific entity.
* **Authorization**: Authenticated User.
* **Query Params**: `ListCommentsQuerySchema` requires `entityId` and supports pagination.
* **Success Response (200)**: A paginated list of `Comment` objects.

**PUT `/api/v1/comments/:commentId`**
* **Description**: Updates an existing comment.
* **Authorization**: User with `update` permission on `Comment`.
* **URL Params**: `commentId` (UUID).
* **Request Body**: `UpdateCommentDtoSchema` allows updating the `content`.
* **Success Response (200)**: The updated `Comment` object.

**DELETE `/api/v1/comments/:commentId`**
* **Description**: Deletes a comment.
* **Authorization**: User with `delete` permission on `Comment`.
* **URL Params**: `commentId` (UUID).
* **Success Response (204)**: No content.

#### Knowledge Bases (`/api/v1/knowledge-bases`)

**POST `/api/v1/knowledge-bases`**
* **Description**: Creates a new knowledge base.
* **Authorization**: User with `create` permission on `KnowledgeBase`.
* **Request Body**: `CreateKnowledgeBaseDtoSchema` requires a `name`.
* **Success Response (201)**: The created `KnowledgeBase` object.

**GET `/api/v1/knowledge-bases`**
* **Description**: Lists all knowledge bases accessible to the user.
* **Authorization**: User with `read` permission on `KnowledgeBase`.
* **Query Params**: Supports `page`, `limit`, and `search`.
* **Success Response (200)**: A paginated list of `KnowledgeBase` objects.

**POST `/api/v1/knowledge-bases/:knowledgeBaseId/pages`**
* **Description**: Creates a new page within a knowledge base.
* **Authorization**: Authenticated User (permissions likely depend on KB membership).
* **URL Params**: `knowledgeBaseId` (UUID).
* **Request Body**: `CreateKnowledgePageDtoSchema` (omitting `knowledgeBaseId`) requires a `title`.
* **Success Response (201)**: The created `KnowledgePage` object.

Of course, here is the continuation of the API endpoint list.

### Publications

Endpoints for managing publications and their categories.

***

#### Publications (`/api/v1/publications`)

**POST `/api/v1/publications`**
* **Description**: Creates a new publication.
* **Authorization**: User with `create` permission on `Publication`.
* **Request Body**: `CreatePublicationDtoSchema` requires `title`, `slug`, `authorIds`, and allows for `status`, `excerpt`, and `categoryIds`.
* **Success Response (201)**: The created `Publication` object.

**GET `/api/v1/publications`**
* **Description**: Lists all publications.
* **Authorization**: User with `read` permission on `Publication`.
* **Query Params**: `ListPublicationsQuerySchema` supports pagination, sorting, search, and filtering by `status` or `categoryId`.
* **Success Response (200)**: A paginated list of `Publication` objects.

**GET `/api/v1/publications/:publicationId`**
* **Description**: Retrieves a single publication by its ID.
* **Authorization**: User with `read` permission on `Publication`.
* **URL Params**: `publicationId` (UUID).
* **Success Response (200)**: The `Publication` object.

**PUT `/api/v1/publications/:publicationId`**
* **Description**: Updates a publication's details.
* **Authorization**: User with `update` permission on `Publication`.
* **URL Params**: `publicationId` (UUID).
* **Request Body**: `UpdatePublicationDtoSchema` allows updating any of the publication's fields.
* **Success Response (200)**: The updated `Publication` object.

**DELETE `/api/v1/publications/:publicationId`**
* **Description**: Deletes a publication.
* **Authorization**: User with `delete` permission on `Publication`.
* **URL Params**: `publicationId` (UUID).
* **Success Response (204)**: No content.

#### Publication Categories (`/api/v1/publications/categories`)

**POST `/api/v1/publications/categories`**
* **Description**: Creates a new publication category.
* **Authorization**: User with `create` permission on `Publication`.
* **Request Body**: `CreatePublicationCategoryDtoSchema` requires a `name` (string, min 2 characters).
* **Success Response (201)**: The created `PublicationCategory` object.

**GET `/api/v1/publications/categories`**
* **Description**: Lists all publication categories.
* **Authorization**: User with `read` permission on `Publication`.
* **Query Params**: `ListPublicationCategoriesQuerySchema` supports pagination.
* **Success Response (200)**: A paginated list of `PublicationCategory` objects.

**GET `/api/v1/publications/categories/:categoryId`**
* **Description**: Retrieves a single publication category by ID.
* **Authorization**: User with `read` permission on `Publication`.
* **URL Params**: `categoryId` (UUID).
* **Success Response (200)**: The `PublicationCategory` object.

**PUT `/api/v1/publications/categories/:categoryId`**
* **Description**: Updates a publication category.
* **Authorization**: User with `update` permission on `Publication`.
* **URL Params**: `categoryId` (UUID).
* **Request Body**: `UpdatePublicationCategoryDtoSchema` allows updating the `name`.
* **Success Response (200)**: The updated `PublicationCategory` object.

**DELETE `/api/v1/publications/categories/:categoryId`**
* **Description**: Deletes a publication category.
* **Authorization**: User with `delete` permission on `Publication`.
* **URL Params**: `categoryId` (UUID).
* **Success Response (204)**: No content.

### Integrations

Endpoints for managing connections to third-party services.

***

#### Integration Configurations (`/api/v1/integrations`)

**POST `/api/v1/integrations`**
* **Description**: Creates a new integration configuration for a workspace.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **Request Body**: `CreateIntegrationConfigDtoSchema` requires `provider`, `category`, and `workspaceId`, with optional `settings` and credentials.
* **Success Response (201)**: The created `IntegrationConfiguration` object.

**GET `/api/v1/integrations`**
* **Description**: Lists integration configurations, typically filtered by workspace.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **Query Params**: `ListIntegrationConfigsQuerySchema` requires `workspaceId` and supports pagination and filtering.
* **Success Response (200)**: A paginated list of `IntegrationConfiguration` objects.

**GET `/api/v1/integrations/:integrationId`**
* **Description**: Retrieves a single integration configuration by ID.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **URL Params**: `integrationId` (UUID).
* **Success Response (200)**: The `IntegrationConfiguration` object.

**PUT `/api/v1/integrations/:integrationId`**
* **Description**: Updates an integration configuration.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **URL Params**: `integrationId` (UUID).
* **Request Body**: `UpdateIntegrationConfigDtoSchema` allows updating fields like `friendlyName`, `isActive`, and `settings`.
* **Success Response (200)**: The updated `IntegrationConfiguration` object.

**DELETE `/api/v1/integrations/:integrationId`**
* **Description**: Deletes an integration configuration.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **URL Params**: `integrationId` (UUID).
* **Success Response (204)**: No content.

#### OAuth Connections

**GET `/api/v1/integrations/connect/:provider`**
* **Description**: Initiates the OAuth 2.0 flow for a given provider (e.g., 'google', 'linkedin').
* **Authorization**: Authenticated User.
* **URL Params**: `provider` (string).
* **Query Params**: Requires `workspaceId` to associate the connection.
* **Success Response (302 Redirect)**: Redirects the user to the provider's authorization page.

**GET `/api/v1/integrations/connect/:provider/callback`**
* **Description**: Handles the OAuth 2.0 callback from the provider after user authorization.
* **Authorization**: Public.
* **URL Params**: `provider` (string).
* **Query Params**: Varies by provider, but typically includes `code` and `state`.
* **Success Response (200)**: A success message, and the page typically closes itself.

#### Integration Actions

**GET `/api/v1/integrations/:integrationId/health`**
* **Description**: Manually triggers a health check for a specific integration.
* **Authorization**: Admin with `manage` permission on `IntegrationConfiguration`.
* **URL Params**: `integrationId` (UUID).
* **Success Response (200)**: The `IntegrationConfiguration` object with updated health status.

**GET `/api/v1/integrations/google/calendars`**
* **Description**: Lists Google Calendars accessible to the user associated with the integration.
* **Authorization**: Authenticated User.
* **Query Params**: Requires `integrationId` (UUID).
* **Success Response (200)**: An array of `GoogleCalendar` objects.

**POST `/api/v1/integrations/google/watch-file`**
* **Description**: Sets up a webhook (watch) on a specific Google Drive file for real-time updates.
* **Authorization**: Authenticated User.
* **Request Body**: Requires `integrationId` and `fileId`.
* **Success Response (200)**: A confirmation message.

Of course. Here is the final part of the API endpoint list, covering all remaining project management, CRM, and collaboration routes from the codebase.

### Project Management (continued)

***

#### Project Members (`/api/v1/projects/:projectId/members`)

**GET `/api/v1/projects/:projectId/members`**
* **Description**: Lists all members of a specific project.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Success Response (200)**: An array of `ProjectMember` objects.

**POST `/api/v1/projects/:projectId/members`**
* **Description**: Adds a new member to a project.
* **Authorization**: Project Member with `manage` permission.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `AddProjectMemberDtoSchema` requires `userId`, `roleId`, and an optional `isGuest` boolean.
* **Success Response (201)**: The `ProjectMember` object for the newly added member.

**POST `/api/v1/projects/:projectId/members/team`**
* **Description**: Adds all members of a specified team to a project.
* **Authorization**: Project Member with `manage` permission.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `AddTeamToProjectDtoSchema` requires `teamId` and `roleId`.
* **Success Response (201)**: An object with the `count` of members added.

**PATCH `/api/v1/projects/:projectId/members/:userId`**
* **Description**: Updates a member's role or guest status within a project.
* **Authorization**: Project Member with `manage` permission.
* **URL Params**: `projectId` (UUID), `userId` (UUID).
* **Request Body**: `UpdateMemberRoleDtoSchema` allows updating `roleId` and `isGuest`.
* **Success Response (200)**: The updated `ProjectMember` object.

**DELETE `/api/v1/projects/:projectId/members/:userId`**
* **Description**: Removes a member from a project.
* **Authorization**: Project Member with `manage` permission.
* **URL Params**: `projectId` (UUID), `userId` (UUID).
* **Success Response (204)**: No content.

#### Project Views (`/api/v1/projects/:projectId/views`)

**POST `/api/v1/projects/:projectId/views`**
* **Description**: Creates a new view (e.g., Kanban, List, Calendar) for a project.
* **Authorization**: Project Member with `create` permission.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateViewDtoSchema` requires `name` and `type`, and allows for view-specific `config`, `columns`, and filter settings.
* **Success Response (201)**: The created `View` object.

**GET `/api/v1/projects/:projectId/views`**
* **Description**: Lists all views for a project.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Query Params**: `ListViewsQuerySchema` supports pagination and sorting.
* **Success Response (200)**: A paginated list of `View` objects.

**GET `/api/v1/views/:viewId`**
* **Description**: Retrieves a single view by its ID.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `viewId` (UUID).
* **Success Response (200)**: The `View` object, including its columns.

**GET `/api/v1/views/:viewId/data`**
* **Description**: Fetches the tasks or other items to be displayed in a given view, with appropriate filtering and sorting.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `viewId` (UUID).
* **Query Params**: `ListTasksQuerySchema` for task-based views.
* **Success Response (200)**: A paginated list of `Task` objects.

**PUT `/api/v1/views/:viewId`**
* **Description**: Updates a view's configuration.
* **Authorization**: Project Member with `update` permission.
* **URL Params**: `viewId` (UUID).
* **Request Body**: `UpdateViewDtoSchema` allows updating `name`, `config`, `filters`, etc.
* **Success Response (200)**: The updated `View` object.

**DELETE `/api/v1/views/:viewId`**
* **Description**: Deletes a view.
* **Authorization**: Project Member with `delete` permission.
* **URL Params**: `viewId` (UUID).
* **Success Response (204)**: No content.

#### Task Attachments & Links

**POST `/api/v1/projects/:projectId/tasks/:taskId/links`**
* **Description**: Links a task to another task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: `CreateTaskLinkDtoSchema` requires `targetTaskId` and a `type` (e.g., `RELATES_TO`, `BLOCKS`).
* **Success Response (200)**: The updated source `Task` object.

**PATCH `/api/v1/projects/:projectId/tasks/:taskId/links/:linkId`**
* **Description**: Updates the type of an existing task link.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `linkId` (UUID).
* **Request Body**: `UpdateTaskLinkDtoSchema` requires a new `type`.
* **Success Response (200)**: The updated `Task` object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/links/:linkId`**
* **Description**: Removes a link between two tasks.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `linkId` (UUID).
* **Success Response (200)**: The updated `Task` object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/documents`**
* **Description**: Attaches a new document by uploading a file to a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: Multipart form data with the file and a `type` field ('INPUT' or 'OUTPUT').
* **Success Response (200)**: The updated `Task` object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/documents/:documentId/:type`**
* **Description**: Detaches a document from a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `documentId` (UUID), `type` (enum).
* **Success Response (200)**: The updated `Task` object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/:plural`**
* **Description**: Attaches an existing entity (Knowledge Base, Whiteboard, or Publication) to a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `plural` (one of `knowledge-bases`, `whiteboards`, `publications`).
* **Request Body**: `AttachToTaskDtoSchema` requires `entityId`.
* **Success Response (200)**: The updated `Task` object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/:plural/:entityId`**
* **Description**: Detaches an entity from a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID), `plural` (as above), `entityId` (UUID).
* **Success Response (200)**: The updated `Task` object.

#### Task Time Logs (`/api/v1/projects/:projectId/tasks/:taskId/timelogs`)

**POST `/api/v1/projects/:projectId/tasks/:taskId/timelogs`**
* **Description**: Creates a new time log entry for a task.
* **Authorization**: Project Member with `update` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Request Body**: `CreateTimeLogDtoSchema` requires `duration` (integer) and `loggedAt` (date).
* **Success Response (201)**: The created `TimeLog` object.

**GET `/api/v1/projects/:projectId/tasks/:taskId/timelogs`**
* **Description**: Lists all time logs for a specific task.
* **Authorization**: Project Member with `read` permission on `Task`.
* **URL Params**: `projectId` (UUID), `taskId` (UUID).
* **Query Params**: `ListTimeLogsQuerySchema` supports pagination, sorting, and filtering by `userId`.
* **Success Response (200)**: A paginated list of `TimeLog` objects.

**GET `/api/v1/timelogs/:timeLogId`**
* **Description**: Retrieves a single time log entry by its ID.
* **Authorization**: User with appropriate task permissions.
* **URL Params**: `timeLogId` (UUID).
* **Success Response (200)**: The `TimeLog` object.

**PUT `/api/v1/timelogs/:timeLogId`**
* **Description**: Updates a time log entry.
* **Authorization**: User with appropriate task permissions.
* **URL Params**: `timeLogId` (UUID).
* **Request Body**: `UpdateTimeLogDtoSchema` allows updating `duration`, `description`, and `loggedAt`.
* **Success Response (200)**: The updated `TimeLog` object.

**DELETE `/api/v1/timelogs/:timeLogId`**
* **Description**: Deletes a time log entry.
* **Authorization**: User with appropriate task permissions.
* **URL Params**: `timeLogId` (UUID).
* **Success Response (204)**: No content.

### CRM (continued)

***

#### Deals (`/api/v1/deals`)

**POST `/api/v1/deals`**
* **Description**: Creates a new deal.
* **Authorization**: User with `create` permission on `Deal`.
* **Request Body**: `CreateDealDtoSchema` requires `name`, `value`, `stageId`, and `organizationId`.
* **Success Response (201)**: The created `Deal` object.

**GET `/api/v1/deals`**
* **Description**: Lists all deals.
* **Authorization**: User with `read` permission on `Deal`.
* **Query Params**: `ListDealsQuerySchema` supports pagination, sorting, search, and filtering by `stageId`.
* **Success Response (200)**: A paginated list of `Deal` objects.

**GET `/api/v1/deals/:dealId`**
* **Description**: Retrieves a single deal by its ID.
* **Authorization**: User with `read` permission on `Deal`.
* **URL Params**: `dealId` (UUID).
* **Success Response (200)**: The `Deal` object.

**PUT `/api/v1/deals/:dealId`**
* **Description**: Updates a deal's details.
* **Authorization**: User with `update` permission on `Deal`.
* **URL Params**: `dealId` (UUID).
* **Request Body**: `UpdateDealDtoSchema` allows updating `name`, `value`, `stageId`, etc.
* **Success Response (200)**: The updated `Deal` object.

**DELETE `/api/v1/deals/:dealId`**
* **Description**: Deletes a deal.
* **Authorization**: User with `delete` permission on `Deal`.
* **URL Params**: `dealId` (UUID).
* **Success Response (204)**: No content.

### Collaboration (continued)

***

#### Whiteboards (`/api/v1/whiteboards`)

**POST `/api/v1/whiteboards`**
* **Description**: Creates a new whiteboard.
* **Authorization**: User with `create` permission on `Whiteboard`.
* **Request Body**: `CreateWhiteboardDtoSchema` requires a `name` and allows for `content`.
* **Success Response (201)**: The created `Whiteboard` object.

**GET `/api/v1/whiteboards`**
* **Description**: Lists all whiteboards accessible to the user.
* **Authorization**: User with `read` permission on `Whiteboard`.
* **Query Params**: Supports pagination.
* **Success Response (200)**: A paginated list of `Whiteboard` objects.

**GET `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Retrieves a single whiteboard by its ID.
* **Authorization**: User with `read` permission on `Whiteboard`.
* **URL Params**: `whiteboardId` (UUID).
* **Success Response (200)**: The `Whiteboard` object.

**PUT `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Updates a whiteboard's details.
* **Authorization**: User with `update` permission on `Whiteboard`.
* **URL Params**: `whiteboardId` (UUID).
* **Request Body**: `UpdateWhiteboardDtoSchema` allows updating `name` and `content`.
* **Success Response (200)**: The updated `Whiteboard` object.

**DELETE `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Deletes a whiteboard.
* **Authorization**: User with `delete` permission on `Whiteboard`.
* **URL Params**: `whiteboardId` (UUID).
* **Success Response (204)**: No content.

Of course. Here is the final section of the API endpoint list, completing the documentation for all remaining routes in the codebase.

### Project Management (continued)

***

#### Project & Task Attachments

**POST `/api/v1/workspaces/:workspaceId/:plural`**
* **Description**: Attaches an existing entity (Knowledge Base, Whiteboard, or Publication) to a workspace.
* **Authorization**: User with `update` permission on `Workspace`.
* **URL Params**: `workspaceId` (UUID), `plural` (one of `knowledge-bases`, `whiteboards`, `publications`).
* **Request Body**: `AttachToWorkspaceDtoSchema` requires `entityId` (UUID).
* **Success Response (200)**: The updated `Workspace` object.

**DELETE `/api/v1/workspaces/:workspaceId/:plural/:entityId`**
* **Description**: Detaches an entity from a workspace.
* **Authorization**: User with `update` permission on `Workspace`.
* **URL Params**: `workspaceId` (UUID), `plural` (as above), `entityId` (UUID).
* **Success Response (200)**: The updated `Workspace` object.

**POST `/api/v1/projects/:projectId/:plural`**
* **Description**: Attaches an existing entity (Knowledge Base, Whiteboard, or Publication) to a project.
* **Authorization**: User with `update` permission on `Project`.
* **URL Params**: `projectId` (UUID), `plural` (one of `knowledge-bases`, `whiteboards`, `publications`).
* **Request Body**: `AttachToProjectDtoSchema` requires `entityId` (UUID).
* **Success Response (200)**: The updated `Project` object.

**DELETE `/api/v1/projects/:projectId/:plural/:entityId`**
* **Description**: Detaches an entity from a project.
* **Authorization**: User with `update` permission on `Project`.
* **URL Params**: `projectId` (UUID), `plural` (as above), `entityId` (UUID).
* **Success Response (200)**: The updated `Project` object.

#### Project Custom Fields (`/api/v1/projects/:projectId/custom-fields`)

**POST `/api/v1/projects/:projectId/custom-fields`**
* **Description**: Creates a new custom field definition for a project.
* **Authorization**: User with appropriate project permissions.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateCustomFieldDefinitionBodySchema` requires `name` (string) and `type` (enum), with optional `options` for 'SELECT' types.
* **Success Response (201)**: The created `CustomFieldDefinition` object.

**GET `/api/v1/projects/:projectId/custom-fields`**
* **Description**: Lists all custom field definitions for a project.
* **Authorization**: User with appropriate project permissions.
* **URL Params**: `projectId` (UUID).
* **Query Params**: `ListCustomFieldDefinitionsQuerySchema` supports pagination and sorting.
* **Success Response (200)**: A paginated list of `CustomFieldDefinition` objects.

**PATCH `/api/v1/tasks/:taskId/custom-fields`**
* **Description**: Updates the custom field values for a specific task.
* **Authorization**: User with `update` permission on `Task`.
* **URL Params**: `taskId` (UUID).
* **Request Body**: `UpdateTaskCustomValuesDtoSchema` requires an `updates` array, where each object has a `fieldId` and `value`.
* **Success Response (200)**: The updated `Task` object with new custom field values.

#### Project Task Types (`/api/v1/projects/:projectId/task-types`)

**POST `/api/v1/projects/:projectId/task-types`**
* **Description**: Creates a new task type (e.g., Bug, Feature, Story) for a project.
* **Authorization**: User with appropriate project permissions.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateTaskTypeDtoSchema` requires `name` and allows for `icon` and `color`.
* **Success Response (201)**: The created `TaskType` object.

**GET `/api/v1/projects/:projectId/task-types`**
* **Description**: Lists all task types for a project.
* **Authorization**: User with appropriate project permissions.
* **URL Params**: `projectId` (UUID).
* **Success Response (200)**: A paginated (effectively all) list of `TaskType` objects.

#### Project Task Templates (`/api/v1/projects/:projectId/task-templates`)

**POST `/api/v1/projects/:projectId/task-templates`**
* **Description**: Creates a new task template for a project.
* **Authorization**: User with appropriate project permissions.
* **URL Params**: `projectId` (UUID).
* **Request Body**: `CreateTaskTemplateDtoSchema` requires a `name` and `templateData` object with default task values.
* **Success Response (201)**: The created `TaskTemplate` object.

**POST `/api/v1/task-templates/:templateId/instantiate`**
* **Description**: Creates a new task from a template.
* **Authorization**: Authenticated User.
* **URL Params**: `templateId` (UUID).
* **Success Response (201)**: The newly created `Task` object.

### Collaboration (continued)

***

#### Knowledge Base Pages (`/api/v1/knowledge-bases/:knowledgeBaseId/pages`)

**GET `/api/v1/knowledge-bases/:knowledgeBaseId/pages`**
* **Description**: Lists all pages within a specific knowledge base.
* **Authorization**: User with access to the Knowledge Base.
* **URL Params**: `knowledgeBaseId` (UUID).
* **Query Params**: `ListKnowledgePagesQuerySchema` supports pagination and `search`.
* **Success Response (200)**: A paginated list of `KnowledgePage` objects.

**GET `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Retrieves a single knowledge page by its ID.
* **Authorization**: User with access to the Knowledge Base.
* **URL Params**: `knowledgeBaseId` (UUID), `pageId` (UUID).
* **Success Response (200)**: The `KnowledgePage` object.

**PUT `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Updates a knowledge page.
* **Authorization**: User with appropriate permissions on the Knowledge Base.
* **URL Params**: `knowledgeBaseId` (UUID), `pageId` (UUID).
* **Request Body**: `UpdateKnowledgePageDtoSchema` allows updating `title`, `content`, etc.
* **Success Response (200)**: The updated `KnowledgePage` object.

**DELETE `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Deletes a knowledge page.
* **Authorization**: User with appropriate permissions on the Knowledge Base.
* **URL Params**: `knowledgeBaseId` (UUID), `pageId` (UUID).
* **Success Response (204)**: No content.

#### Comment Attachments (`/api/v1/comments/:commentId`)

**POST `/api/v1/comments/:commentId/:plural`**
* **Description**: Attaches an existing entity (Publication, Whiteboard, or Knowledge Base) to a comment.
* **Authorization**: User with `update` permission on `Comment`.
* **URL Params**: `commentId` (UUID), `plural` (one of `publications`, `whiteboards`, `knowledge-bases`).
* **Request Body**: `AttachToCommentDtoSchema` requires `entityId`.
* **Success Response (200)**: The updated `Comment` object.

**DELETE `/api/v1/comments/:commentId/:plural/:entityId`**
* **Description**: Detaches an entity from a comment.
* **Authorization**: User with `update` permission on `Comment`.
* **URL Params**: `commentId` (UUID), `plural` (as above), `entityId` (UUID).
* **Success Response (200)**: The updated `Comment` object.

### Analytics (continued)

***

#### Activities (`/api/v1/activities`)

**GET `/api/v1/activities`**
* **Description**: Lists activities for the current authenticated user.
* **Authorization**: Authenticated User.
* **Query Params**: `ListActivitiesQuerySchema` supports pagination.
* **Success Response (200)**: A paginated list of `Activity` objects.

**GET `/api/v1/workspaces/:workspaceId/activities`**
* **Description**: Lists all activities for a specific workspace.
* **Authorization**: Workspace Member with `read` permission.
* **URL Params**: `workspaceId` (UUID).
* **Query Params**: `ListActivitiesQuerySchema` supports pagination.
* **Success Response (200)**: A paginated list of `Activity` objects.

**GET `/api/v1/projects/:projectId/activities`**
* **Description**: Lists all activities for a specific project.
* **Authorization**: Project Member with `read` permission.
* **URL Params**: `projectId` (UUID).
* **Query Params**: `ListActivitiesQuerySchema` supports pagination.
* **Success Response (200)**: A paginated list of `Activity` objects.

#### Reporting (`/api/v1/workspaces/:workspaceId/reporting`)

**GET `/api/v1/workspaces/:workspaceId/reporting/workload`**
* **Description**: Retrieves a workload report for a workspace, showing task distribution among users.
* **Authorization**: Workspace Member with `read` permission.
* **URL Params**: `workspaceId` (UUID).
* **Query Params**: `GetWorkloadQuerySchema` allows filtering by a comma-separated list of `projectIds`.
* **Success Response (200)**: A `WorkloadResponse` array, with each object containing user details and their task/story point counts.