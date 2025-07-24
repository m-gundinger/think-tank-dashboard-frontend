You are an expert AI full-stack developer. Your mission is to implement a comprehensive set of new features and architectural improvements into the provided frontend and backend codebases. You will first generate a complete, multi-step implementation plan based on the new functionality listed below. Then, you will execute that plan sequentially in large batches of files within this single conversation. I will simply say "continue" to receive the next batch. Do not stop until you have implemented all features.

### **1. Core Instructions & Constraints**

You must adhere to the following rules throughout the entire process:

1.  **Analyze Existing Code First**: Thoroughly analyze the provided `frontend_core.txt` and `backend_core.txt` files. All new code must be architecturally consistent with the existing patterns for data models (Prisma/Zod), API structure (Fastify), dependency injection (tsyringe), frontend components (Shadcn/UI, React Hook Form), and state management (React Query).
2.  **Holistic Implementation**: Implement **all** features from the plan below simultaneously across the codebase. Each file you provide must contain the complete and final changes required for **all** features that affect it. Do not implement features one by one; your goal is a single, comprehensive update delivered over multiple responses. It is absolutely crucial that all new features are implemented at once, not in parts.
3.  **Full-Stack Scope**: Modifications are required on **both the frontend and backend**. Ensure changes are consistent across the stack.
4.  **Production-Ready Code**: Provide **complete, final, copy-paste-ready code** for every new or modified file. Do not use placeholders, summaries, comments like `// ... rest of the code`, or ellipses (`...`). Every file must be whole.
5.  **Strict File Formatting**: For each file, use the following format. Provide **only** the files that are new or have been changed. Make the files copyable (by click on a button).
    // FILE: path/to/the/file/filename.ext
    ```
    ... full, complete content of the file ...
    ```
6.  **Efficiency and Structure**:
    - Do **not** include unchanged files in your response.
    - Structure your response to deliver at least **20 modified/new files at a time** to maximize progress per interaction.
    - Execute the plan in the precise order laid out below.
7.  **Backend Constraints**:
    - Begin with all database model changes in `prisma/schema.prisma`.
    - Immediately after, update the `prisma/seed.ts` file to populate necessary initial data for the new models and fields.
    - Ensure all new API endpoints are protected with authentication and authorization (`CASL`) and follow existing patterns for routing and validation (Zod).
8.  **Frontend Constraints**:
    - Adhere to the existing feature-based architecture (`src/features/...`).
    - Do **not** introduce new top-level `types` directories. Colocate new types within their feature files or add them to `src/types/index.ts` if they are globally applicable.

---

### **2. Feature Implementation Plan**

This is the definitive plan. Execute it sequentially without deviation.

#### **Phase 1: Backend - Critical Fixes, Data Models & Core Logic**

1.  **Update Prisma Schema (`prisma/schema.prisma`):**
    - **ViewColumn Model**: Add `status TaskStatus?` to link a Kanban column directly to a system task status.
2.  **Security: Granular Authorization for Standalone Tasks:**
    - **`ability.service.ts`**: Modify CASL rules for standalone tasks. Replace general `'Task'` permissions with conditional rules checking for `creatorId` or `assignee` on tasks where `projectId` is `null`.
      - `can('manage', 'Task', { creatorId: user.id, projectId: null })`
      - `can('manage', 'Task', { assignees: { $elemMatch: { id: user.id } }, projectId: null })`
    - **`subject.repository.ts`**: Ensure `getSubjectById` for `'Task'` fetches `creatorId` and `assignees` to enable conditional checks.
    - **`standalone-task.routes.ts` & `task.controller.ts`**: Verify all standalone task handlers use the `authHooks.perform` middleware with the `taskId` parameter to enforce instance-based authorization.
3.  **Feature: Full Implementation of the Chat Module:**
    - **Create `chat.module.ts`, `chat.routes.ts`, `chat.service.ts`, `chat.repository.ts`:**
      - **Routes (`chat.routes.ts`):**
        - `GET /chat/channels`: List channels and direct messages for the current user.
        - `GET /chat/threads/:threadId/messages`: Get paginated messages for a channel/DM.
        - `POST /chat/threads/:threadId/messages`: Send a message to a channel/DM.
      - **Repository (`chat.repository.ts`):** Implement database logic for creating channels, fetching messages, and saving new messages using Prisma models (`Channel`, `Message`, etc.).
      - **Service (`chat.service.ts`):** Implement business logic, including user permissions for accessing channels and messages.
    - **Real-Time Logic (`socket-gateway.service.ts`):**
      - Define new socket events: `chat:join_thread`, `chat:leave_thread`, `chat:send_message`.
      - Manage socket rooms for each chat thread (e.g., `chat:thread:C1`).
      - Integrate with `ChatService`: When a message is sent via the POST endpoint, the service saves it and then emits a `chat:new_message` event to the correct room via `RealTimeEmitterService`.
4.  **Feature: Functional CRM Deals Pipeline:**
    - **Create `deal-stage.module.ts`, `deal-stage.service.ts`, `deal-stage.repository.ts`**: Implement logic to fetch and manage deal stages for specific projects.
    - **`deals.routes.ts`**: Add a new endpoint `PATCH /deals/:dealId/move` for reordering deals.
    - **`deal.service.ts`**: Implement a `move` method that updates a deal's `stageId` and `order` based on the target stage and position.
5.  **Architecture: Server-Side Kanban Logic:**
    - **`view.service.ts`**: Update the service to handle setting the new `status` field on `ViewColumn` when creating/updating Kanban views.
    - **`task.service.ts`**: Refactor the `moveTask` method. It should now derive the new `TaskStatus` from the `status` field of the target `ViewColumn` (if present), not from a client-provided parameter.
6.  **Feature: Persistent UI State (Announcements):**
    - **Create new API Endpoint**: `POST /users/me/announcements/:announcementId/dismiss`. This endpoint will create a record indicating a user has dismissed an announcement.
7.  **Feature: Configurable Home Dashboard:**
    - **Create `user-dashboard.module.ts`, `user-dashboard.controller.ts`, `user-dashboard.service.ts`, `user-dashboard.repository.ts`:**
      - Use existing Prisma models (`UserDashboard`, `UserDashboardWidget`).
      - **Endpoints:**
        - `GET /user/dashboard`: Get the current user's dashboard layout and widgets.
        - `PUT /user/dashboard`: Update the user's dashboard layout.
        - `POST /user/dashboard/widgets`: Add a new widget to the user's dashboard.
        - `DELETE /user/dashboard/widgets/:widgetId`: Remove a widget from the dashboard.
8.  **Feature: Implement Workflow Action Logic:**
    - **`workflow.dependencies.ts`**: Replace placeholder adapters (`WorkflowTaskCreatorAdapter`, `WorkflowEmailSenderAdapter`, etc.) with real service implementations (`TaskService`, a new `EmailService`, etc.).
    - **Implement New Services (`EmailService`, `TelegramService`):** Create the necessary services to handle sending emails (e.g., via Brevo) and Telegram messages as part of workflow actions.
9.  **Feature: Real-Time Whiteboard Collaboration:**
    - **`socket-gateway.service.ts`**: Add new socket handlers for `whiteboard:load` and `whiteboard:update`.
    - **Create `WhiteboardCollabService`:** This service will manage whiteboard state in memory (or a Redis cache) and broadcast updates. When a `whiteboard:update` event is received, it updates the state and emits changes to all users in the same whiteboard room (e.g., `whiteboard:view:viewId123`).
    - **`WhiteboardRepository`**: Implement logic for the `WhiteboardCollabService` to periodically persist whiteboard content to the database.
10. **Refactor: Code Cleanup and Consistency:**
    - **Address `FIXME`s**: Find and resolve all `FIXME` comments in the codebase, particularly in `SendWebhookHandler` to ensure errors are handled correctly for job retries.
    - **Standardize Deletes**: Enforce a soft-delete-first policy. Restrict the `hardDeleteUser` service method to a SuperAdmin-only endpoint.

#### **Phase 2: Frontend - UI Implementation & Feature Integration**

1.  **Feature: Full Implementation of the Chat Module:**
    - **`src/features/chat/api/`**: In `useGetChannels`, `useGetMessages`, and `useSendMessage`, replace all mocked API calls with `api.get` and `api.post` calls to the newly created backend endpoints.
    - **Create `src/features/chat/hooks/useChatSocket.ts`**:
      - This hook should manage the socket connection.
      - On selecting a thread, it emits `chat:join_thread`.
      - It must listen for `chat:new_message` events and update the local React Query cache optimistically using `queryClient.setQueryData`.
      - On component unmount or thread change, it emits `chat:leave_thread`.
2.  **Feature: Functional CRM Deals Pipeline:**
    - **`src/features/crm/components/DealPipeline.tsx`**:
      - Remove the hardcoded `projectId` and pass it as a prop from the parent page (via URL params).
      - Update the `onDragEnd` handler to call the new `PATCH /deals/:dealId/move` endpoint, sending the `dealId`, `targetStageId`, and the new `order`.
3.  **Architecture: Server-Side Kanban Logic:**
    - **`src/features/tasks/components/KanbanBoard.tsx`**:
      - Delete the client-side `mapColumnNameToStatus` function and all related logic.
      - Modify the `onDragEnd` handler to only send `targetColumnId` and `orderInColumn` to the `moveTask` endpoint, removing the `newStatus` parameter.
4.  **Feature: Persistent UI State & Robust Modals:**
    - **Create `src/components/ui/ConfirmationDialog.tsx`**: Implement a reusable confirmation modal using a library like `@radix-ui/react-dialog`.
    - **Code-wide Refactor**: Replace all instances of `window.confirm()` (`AnnouncementList.tsx`, `PermissionList.tsx`, `RoleCard.tsx`, `UserList.tsx`, etc.) with the new `ConfirmationDialog` component.
    - **`src/features/announcements/components/ActiveAnnouncements.tsx`**:
      - Remove the local `dismissedIds` state.
      - When the dismiss button is clicked, call the new `POST /users/me/announcements/:announcementId/dismiss` backend endpoint.
      - Refetch the active announcements list to get the persisted state from the backend.
5.  **Feature: Responsive and Configurable Home Dashboard:**
    - **`src/pages/HomeDashboard.tsx`**:
      - Make the layout responsive using `ResponsiveGridLayout` from `react-grid-layout`, removing fixed widths and defining breakpoints.
      - Create `useGetUserDashboard.ts` and `useUpdateUserDashboard.ts` hooks to fetch/save the dashboard layout from/to the new backend endpoints.
      - Use the `onLayoutChange` callback to trigger the `updateUserDashboard` mutation.
      - Replace the placeholder `RecentMentionsWidget` with a real implementation that fetches data from the notifications API.
6.  **Refactor: Code Cleanup and Consistency:**
    - **Consolidate `ActionRepeater.tsx`**: Merge the two `ActionRepeater` components in the `workflows` feature into a single, reusable component.
    - **`src/features/admin/users/components/UserList.tsx`**: Update the UI to reflect the new soft-delete policy. The "Hard Delete" action should be moved or removed to be consistent with the backend changes.
7.  **Feature: Real-Time Whiteboard Collaboration:**
    - **`src/features/views/components/WhiteboardView.tsx`**:
      - Create a `useWhiteboardSocket` hook to manage the socket connection.
      - On mount, emit `whiteboard:load` to fetch the initial state.
      - Use Tldraw's `onchange` event to emit `whiteboard:update` events with local changes.
      - Listen for incoming `whiteboard:update` events from the server and apply them to the local Tldraw instance.

---

### **Execution**

Analyze the attached codebases. Then, proceed directly with the full implementation of the plan above, adhering to all specified rules and constraints. Begin with **Phase 1**.

---
