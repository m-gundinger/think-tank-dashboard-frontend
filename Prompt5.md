You are an expert AI full-stack developer. Your mission is to implement a comprehensive set of new features into the provided frontend and backend codebases. You will first generate a complete, multi-step implementation plan based on the new functionality listed below. Then, you will execute that plan sequentially in large batches of files within this single conversation. I will simply say "continue" to receive the next batch. Do not stop until you have implemented all features.

### **1. Core Instructions & Constraints**

You must adhere to the following rules throughout the entire process:

1.  **Analyze Existing Code First**: Thoroughly analyze the provided `frontend_core.txt` and `backend_core.txt` files. All new code must be architecturally consistent with the existing patterns for data models (Prisma/Zod), API structure (Fastify), dependency injection (tsyringe), frontend components (Shadcn/UI, React Hook Form), and state management (React Query).
2.  **Holistic Implementation**: Implement **all** features from the plan below simultaneously across the codebase. Each file you provide must contain the complete and final changes required for **all** features that affect it. Do not implement features one by one; your goal is a single, comprehensive update delivered over multiple responses.
3.  **Full-Stack Scope**: Modifications are required on **both the frontend and backend**. Ensure changes are consistent across the stack.
4.  **Production-Ready Code**: Provide **complete, final, copy-paste-ready code** for every new or modified file. Do not use placeholders, summaries, comments like `// ... rest of the code`, or ellipses (`...`). Every file must be whole.
5.  **Strict File Formatting**: For each file, use the following format. Provide **only** the files that are new or have been changed.
    // FILE: path/to/the/file/filename.ext
    ```
    ... full, complete content of the file ...
    ```
6.  **Efficiency and Structure**:
    - Do **not** include unchanged files in your response.
    - Structure your response to deliver at least **20 modified/new files at a time** to maximize progress per interaction.
    - Execute the plan in the precise order laid out below. Do not mix file types from different phases in a single response (e.g., do not provide backend controller files and frontend component files in the same batch).
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

#### **Phase 1: Backend - Data Model & Foundation Overhaul**

1.  **Update Prisma Schema (`prisma/schema.prisma`):**
    - **Project Model Enhancements**: Add `taskCounter Int @default(0)` to the `Project` model.
    - **Task Model Enhancements**: Add `shortId String?` for the human-readable ID. Add a many-to-many relation `taskWatchers` to the `Auth` model for task subscriptions.
    - **View Model Enhancements**: Add `filters Json?`, `sorting Json?`, `grouping Json?`, and `isPublic Boolean @default(false)` to the `View` model. Add `WHITEBOARD` to the `ViewType` enum.
    - **Project Templates**: Create a `ProjectTemplate` model storing `name`, `description`, and `sourceProjectId`.
    - **User Home/Inbox**: Create a `UserDashboard` model with `layout Json?` and a relation to `Auth`. Create a `UserDashboardWidget` model to link widgets to user dashboards.
    - **Real-time Collaboration**:
      - Add `contentJson Json?` to `KnowledgePage` for structured collaborative content.
      - Create a `Whiteboard` model with `content Json?` and a one-to-one relation to a `View`.
      - Create `Channel` and `DirectMessageThread` models. Create a polymorphic `Message` model that can belong to either.
    - **Automation & Integrations**:
      - Add `SEND_WEBHOOK` to the `WorkflowActionType` enum.
      - Add a `condition Json?` field to the `WorkflowAction` model.
      - Create an `IncomingWebhook` model with `name`, `projectId`, and a unique `secret`.
      - Modify `TaskDocument` to support external links (e.g., `externalUrl String?`, `provider SocialProvider?`).
    - **CRM Enhancements**:
      - Create an `Interaction` model with `type (EMAIL, CALL, MEETING)`, `notes`, `date`, and relations to `Person`, `Company`, `Deal`, and `Auth` (actor).
      - Create a `LeadForm` model with `name`, `fields (Json)`, and a relation to `Project`.
2.  **Update Database Seeding (`prisma/seed.ts`):**
    - Update project seeding to include default `WHITEBOARD` views.
    - Ensure any new required relations or fields in existing seeded models are populated.

#### **Phase 2: Backend - API and Service Logic**

1.  **Implement Repositories, Services, and Controllers** for all new models: `ProjectTemplate`, `UserDashboard`, `Whiteboard`, `Channel`, `Message`, `IncomingWebhook`, `Interaction`, and `LeadForm`.
2.  **Enhance Core Services**:
    - **Task Service**: Modify the `create` method to generate and assign a `shortId` by atomically incrementing the `Project.taskCounter`. Implement logic for adding/removing task watchers and notifying them on updates.
    - **View Service**: Update `create` and `update` methods to handle saving `filters`, `sorting`, and `grouping` configurations.
    - **Workflow Service**: In the `executeAction` method, add logic to evaluate the new `condition` field before running an action.
    - **KnowledgePage Service**: Add a new WebSocket-based service for handling real-time collaborative editing updates (CRDTs or Operational Transforms) on the `contentJson` field.
3.  **Implement New Feature Services**:
    - **ProjectTemplateService**: Implement a `createProjectFromTemplate` method that duplicates the structure of a source project.
    - **ChatService**: Implement logic for sending/receiving messages in channels and DMs using WebSockets.
    - **InteractionService**: Implement CRUD for logging CRM interactions.
    - **WebhookService**: Implement logic for `SEND_WEBHOOK` workflow action. Create a public controller to handle incoming webhooks, validate secrets, and trigger corresponding project workflows.
    - **IntegrationService**: Implement background jobs for two-way sync with Google Calendar and file providers using stored OAuth tokens.
4.  **Update Routes**: Expose all new functionality via Fastify routes. Ensure proper nesting (e.g., `/projects/:projectId/templates`), validation (Zod), and authorization (CASL).

#### **Phase 3: Frontend - UI/UX Foundation & Core Features**

1.  **Navigation & Routing (`src/App.tsx`, `src/routes/WorkspaceLayout.tsx`, `src/components/layout/Sidebar.tsx`):**
    - Add a "Home" link to the main navigation pointing to a new `/home` route.
    - Add a "Chat" link to the main navigation.
    - Add a "Workload" tab to the `WorkspaceLayout`.
2.  **Core UI Implementation**:
    - **Task IDs**: Replace UUIDs with the new `shortId` in all relevant UI components (`KanbanTaskCard`, `TaskList`, `TaskDetailModal`).
    - **Saved Views**: Add a "Save View" button and modal to project views, allowing users to name a new view and set its visibility (public/personal).
    - **Project Templates**: Add a "Save as Template" button in Project Settings. Modify the "New Project" dialog to allow creation from a template.
    - **Task Watching**: Add a "Watch" (eye) icon button to the `TaskDetailModal` to subscribe/unsubscribe from task updates.
    - **Home Page**: Create a new `HomePage` component with a widget-based layout (using `react-grid-layout`) displaying assigned tasks, mentions, and notifications.

#### **Phase 4: Frontend - Advanced Collaboration & CRM**

1.  **Collaboration Features**:
    - **Real-time Editor**: Replace the existing `RichTextEditor` for `KnowledgePage` with a collaborative version using a library like Tiptap, connected to the backend WebSocket service.
    - **Whiteboards**: Create a `WhiteboardView` component. Integrate a library like `tldraw` to create the collaborative canvas.
    - **Chat**: Implement a full chat interface with a channel/DM list, message display area, and a real-time message input box.
2.  **CRM Enhancements**:
    - **Activity Timeline**: On the `Person` and `Company` detail panels, build a new timeline component to display a chronological list of `Interaction` records.
    - **Interaction Logging**: Add a form to the CRM pages to manually log calls, meetings, or emails.
    - **Lead Capture**: Create a new section in Project Settings for building `LeadForms` and displaying the unique email forwarding address for the CRM.

#### **Phase 5: Frontend - Automation & Integrations**

1.  **Workflow Builder**:
    - Add a UI for the `SEND_WEBHOOK` action, including fields for URL, method, headers, and payload.
    - For each action in the workflow builder, add a "Conditions" section to allow users to define IF/THEN logic.
2.  **Integrations Settings**:
    - Enhance the `/settings/integrations` page. Add UI for managing two-way sync with Google Calendar and connecting file storage providers like Google Drive and Nextcloud.
3.  **File Linking**:
    - Modify the file attachment UI in `TaskDetailModal` to include "Link from Google Drive" / "Link from Nextcloud" options alongside the standard file upload.

---

### **Execution**

Analyze the attached codebases. Then, proceed directly with the full implementation of the plan above, adhering to all specified rules and constraints. Begin with **Phase 1**.

---

## **Wanted Functionality (Context information)**

### Core Project & Task Management

- **Human-Readable Task IDs:**
  - **Missing:** Tasks are identified by UUIDs . Users in tools like Jira are accustomed to short, human-readable IDs (e.g., `PROJ-123`).
  - **Suggestion:** Implement a project-level counter to assign sequential, prefixed IDs to tasks (e.g., `AUT-1`, `AUT-2`). Keep the UUID as the primary key internally but expose the short ID in the UI.

- **Saved & Sharable View Configurations:**
  - **Missing:** The current `View` model defines the _type_ of view (List, Kanban) but doesn't seem to support saving specific configurations (e.g., "My High-Priority Tasks" which is a List view with filters for `Priority=HIGH` and `Assignee=Me`).
  - **Suggestion:** Extend the `View` model to store filter, sort, and group-by settings. Add options to save views as "Personal" or "Public" to the project.

- **Project Templates:**
  - **Missing:** While you have task templates , there is no concept of a project template. Setting up a new project with the same set of views, custom fields, and task types is manual.
  - **Suggestion:** Create a feature to "Save Project as Template". This would copy the project's structure (views, custom fields, task types, project roles) without its tasks and epics, allowing for quick setup of new, standardized projects.

- **Task Subscriptions / Watching:**
  - **Missing:** Users are notified about assignments or mentions, but there is no explicit feature to "watch" or "subscribe" to a task to receive all updates, regardless of whether they are assigned.
  - **Suggestion:** Add a many-to-many relation between `Auth` and `Task` called `TaskWatchers`. In the UI, add a "Watch" button (eye icon) to tasks. When a watched task is updated, notify all watchers.

- **Configurable "Home" or "Inbox" View:**
  - **Missing:** The `MyTasksPage` is a good start , but tools like ClickUp and Asana offer a highly configurable "Home" or "Inbox" that acts as a personal command center, showing assigned tasks, mentions, reminders, and followed items.
  - **Suggestion:** Create a new "Home" page that aggregates assigned tasks, comments where the user is mentioned, and notifications. Allow users to add widgets to this page for further personalization.

### Collaboration & Communication

- **Real-time Collaborative Document Editing:**
  - **Missing:** You have a `KnowledgeBase` , which is excellent. However, the `RichTextEditor` on the frontend likely relies on simple state updates, not true real-time collaborative editing like Google Docs or Miro.
  - **Suggestion:** Integrate a library like Tiptap with a real-time backend (e.g., Liveblocks, or a custom WebSocket solution using Operational Transforms/CRDTs) for the `KnowledgePage` content. This would allow multiple users to edit a document simultaneously.

- **Integrated Whiteboards (Miro-like):**
  - **Missing:** There is no functionality for freeform visual collaboration (mind mapping, diagramming, sticky notes).
  - **Suggestion:** Add a new `ViewType` called `WHITEBOARD`. Integrate a library like `tldraw` or `fabric.js` to create an infinite canvas where users can collaborate visually. These whiteboards could be linked to projects or exist at the workspace level.

- **Team Chat / Direct Messaging:**
  - **Missing:** Communication is limited to task comments. There's no space for general project discussion or direct messages between users.
  - **Suggestion:** Implement a chat feature. This could be a new model for `Channels` (linked to projects or teams) and `DirectMessages`. Leverage your existing WebSocket infrastructure to deliver messages in real-time.

### Automation & Integrations

- **Webhooks (Incoming/Outgoing):**
  - **Missing:** The workflow engine is powerful but internal. It cannot easily connect to external services like GitHub, GitLab, or Zapier.
  - **Suggestion:**
    - **Outgoing Webhooks:** Add a new `WorkflowActionType` called `SEND_WEBHOOK`. The config would include a URL, method, headers, and a payload template.
    - **Incoming Webhooks:** Create a generic endpoint (e.g., `/api/v1/webhooks/:projectId/:secret`) that can receive data from external services and trigger project workflows.

- **Deeper Calendar, Email, & File Storage Integrations:**
  - **Missing:** You have OAuth for Google but it appears to be primarily for authentication and email sending. There's no two-way sync with Google Calendar or Drive.
  - **Suggestion:** Use the stored OAuth tokens to implement two-way sync. For example, tasks with due dates in your app could appear on a user's Google Calendar, and updates in either system would sync. Allow linking files directly from Google Drive/Nextcloud instead of only uploading.

- **Advanced Workflow Conditions:**
  - **Missing:** The current workflow system seems to be a direct `Trigger -> Action` model. There's no apparent support for conditional logic (if/then).
  - **Suggestion:** Enhance the `WorkflowAction` model. Allow actions to have a `condition` field that must be met for them to execute. This would enable more complex automations, like "IF `Task Status` is changed to `Done` AND `Story Points` is greater than 5, THEN post a message to a specific channel."

### CRM & Sales Functionality

- **Activity Logging (Emails, Calls, Meetings):**
  - **Missing:** The CRM tracks deals and contacts but lacks a timeline for interactions. A core feature of HubSpot is logging every email, call, and meeting associated with a contact or deal.
  - **Suggestion:** Create a new `Interaction` model that can be linked to a `Person` or `Company`. It would have a `type` (Email, Call, Meeting), a `date`, and `notes`. Build a timeline view on the Person and Company detail pages.

- **Lead Capture (Forms & Email Forwarding):**
  - **Missing:** There is no way for new leads to enter the CRM automatically. This is a primary function of tools like HubSpot.
  - **Suggestion:**
    - **Forms:** Create a `Form` builder feature that generates public forms. Submissions would automatically create a new `Person` and optionally a `Deal` in the CRM.
    - **Email Forwarding:** Provide a unique email address for the CRM. When users forward emails to this address, the system should parse the sender to create a new `Person` and log the email content as an interaction.
