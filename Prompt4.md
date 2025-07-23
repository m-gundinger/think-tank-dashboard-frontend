You are an expert AI full-stack developer. Your mission is to implement a comprehensive set of new features into the provided frontend and backend codebases. You will first generate a complete, multi-step implementation plan. Then, you will execute that plan sequentially in large batches of files within this single conversation. I will simply say "continue" to receive the next batch. Do not stop until you have implemented all features.

### **1. Core Instructions & Constraints**

You must adhere to the following rules throughout the entire process:

1.  **Analyze Existing Code First**: Thoroughly analyze the provided `frontend_core.txt` and `backend_core.txt` files. All new code must be architecturally consistent with the existing patterns for data models (Prisma/Zod), API structure (Fastify), dependency injection (tsyringe), frontend components (Shadcn/UI, React Hook Form), and state management (React Query).
2.  **Execute the Full Plan**: Implement **all** features listed in the "Feature Implementation Plan" below. The goal is a single, comprehensive update that addresses all requirements without repeatedly giving me files already given. In other words: each file should only be given once, with all the changes needed for all the features to be implemented.
3.  **Full-Stack Scope**: Modifications are required on **both the frontend and backend**. Ensure changes are consistent across the stack.
4.  **Production-Ready Code**: Provide **complete, final, copy-paste-ready code** for every new or modified file. Do not use placeholders, summaries, comments like `// ... rest of the code`, or ellipses (`...`).
5.  **Strict File Formatting**: For each file, use the following format. Provide **only** the files that are new or have been changed.
    // FILE: path/to/the/file/filename.ext
    ```
    ... full, complete content of the file ...
    ```
6.  **Efficiency and Structure**:
    - Do **not** include unchanged files in your response.
    - Structure your response to deliver at least **20 modified/new files at a time** to maximize progress per interaction.
    - Execute the plan in the precise order laid out below: Backend Models -\> Backend Services/API -\> Frontend Implementation. Do not mix file types from different phases in a single response.
7.  **Backend Constraints**:
    - Begin with all database model changes in `prisma/schema.prisma`.
    - Immediately after, update the `prisma/seed.ts` file to populate necessary initial data for the new models and fields.
    - Ensure all new API endpoints are protected with authentication and authorization (`CASL`) and follow existing patterns for routing and validation (Zod).
8.  **Frontend Constraints**:
    - Adhere to the existing feature-based architecture (`src/features/...`).
    - Do **not** introduce new top-level `types` directories. Colocate new types within their feature files or add them to `src/types/index.ts` if they are globally applicable.

---

### **2. Feature Implementation Plan**

Execute the following phased implementation plan.

#### **Phase 1: Backend - Foundational Data Models**

1.  **Update Prisma Schema (`prisma/schema.prisma`):**
    - **Task Enhancements**:
      - Add `storyPoints: Int?` to the `Task` model.
      - Add `checklist: Json?` to the `Task` model for simple to-do items.
      - Add `recurrenceRule: String?` to the `Task` model to store iCalendar RRULE strings.
    - **Agile/Scrum Models**:
      - Create a `Sprint` model with fields: `name`, `goal`, `startDate`, `endDate`, `status (PLANNING, ACTIVE, COMPLETED)`, and a relation to `Project` and `Task`.
    - **Customization Models**:
      - Create a `TaskType` model with `name`, `icon`, `color`, and a relation to `Project`. Add a one-to-many relation from `TaskType` to `Task`.
      - Create a `TaskTemplate` model with `name`, `description`, `templateData (Json)`, and a relation to `Project`.
    - **Reporting & Goal Models**:
      - Create a `Goal` model with `name`, `description`, `status`, `startDate`, `endDate`, `ownerId`, and relations to `Project` and `Workspace`.
      - Create a `KeyResult` model with `name`, `type (NUMBER, PERCENTAGE, etc.)`, `startValue`, `targetValue`, `currentValue`, and a relation to `Goal`.
    - **CRM Models**:
      - Create a `Company` model with `name`, `description`, `domain`, etc.
      - Create a `PersonCompanyLink` join model to link `Person` and `Company` with a `role`.
      - Create a `DealStage` model with `name`, `order`, and a relation to `Project`.
      - Create a `Deal` model with `name`, `value`, and relations to `DealStage`, `Company`, `Person` (contacts), and `Auth` (owner).
    - **Collaboration Models**:
      - Create a `KnowledgeBase` model with `name`, `description`, and a relation to `Workspace`.
      - Create a `KnowledgePage` model with `title`, `content (Json)`, and relations to `KnowledgeBase`, `Project` (optional), and `Auth` (author).
2.  **Update Database Seeding (`prisma/seed.ts`):**
    - Add seed data for new models like default `DealStage`s (`Qualification`, `Proposal`, `Closed Won`, etc.).
    - Update project seeding to create default `View`s, including `BACKLOG`, `GANTT`, and `CALENDAR`.

#### **Phase 2: Backend - API and Service Logic**

1.  **Implement Repositories, Services, and Controllers** for all new models: `Sprint`, `Goal`, `KeyResult`, `Deal`, `DealStage`, `Company`, `PersonCompanyLink`, `TaskTemplate`, `TaskType`, `KnowledgeBase`, and `KnowledgePage`.
2.  **Enhance Task Service**: Add logic to handle `storyPoints`, `checklist`, and `recurrenceRule` fields.
3.  **Implement New Reporting Handlers**:
    - `WorkloadReportHandler`: Aggregate task counts, story points, and time estimates per user in a workspace/project.
    - `LeadCycleTimeChartHandler`: Calculate the time taken for tasks to move from creation to `DONE` status.
    - `GoalTrackingWidgetHandler`: Fetch a `Goal` and its `KeyResult`s to calculate overall progress.
    - `PieChartHandler`: Aggregate task counts grouped by status.
4.  **Update Routes**: Expose all new functionality via Fastify routes, ensuring they are properly nested under workspaces and projects where applicable.

#### **Phase 3: Frontend Implementation**

1.  **Navigation & Routing (`src/App.tsx`, `src/routes/WorkspaceLayout.tsx`):**
    - Add a "Workload" tab to the `WorkspaceLayout`.
    - Create a new route and page component for `WorkloadPage`.
2.  **Workload Page (`src/pages/WorkloadPage.tsx`, `src/features/reporting/components/WorkloadView.tsx`):**
    - Create a new page that fetches and displays the workload report using a table view, showing user avatars, names, open task counts, story points, and time estimates.
3.  **Project Detail View Enhancements (`src/features/views/components/ProjectDetailView.tsx`):**
    - Integrate new view types: `GANTT` and `CALENDAR`. Use `dhtmlx-gantt` for Gantt charts and `react-big-calendar` for Calendar views.
    - Add a "Sprints" tab to display the new `SprintBoardView`.
    - Modify the "New Task" button to be a dropdown, offering "New Blank Task" and "New from Template..." options.
4.  **New Components & Features:**
    - **Sprints**: Create a `SprintBoardView` component that shows the active sprint's Kanban board and a `SprintList` for planned/completed sprints.
    - **Goals**: Create a `ProjectGoalsPage` and `GoalCard` components to list and manage OKRs.
    - **Task Details**:
      - Integrate a `TaskChecklist` component into the `TaskDetailModal`.
      - Add a `RecurrenceSelector` component using `rrule` to set recurrence rules.
    - **CRM**: Enhance the `CrmPage` with tabs for "Deals", "People", and "Companies". Implement a `DealPipeline` component showing `DealCard`s in `DealColumn`s.
    - **Knowledge Base**: Create a `KnowledgeBasePage` to list knowledge bases and their articles.

---

### **Execution**

Analyze the attached codebases. Then, proceed directly with the full implementation of the plan above, adhering to all specified rules and constraints. Begin with **Phase 1**.
