### **Activities**
These endpoints provide access to activity logs for different scopes like users, workspaces, projects, and tasks.

---
**GET `/api/v1/activities/`**
* **Description**: Lists the activities for the currently authenticated user.
* **Request**:
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 50)
* **Success Response (200 OK)**:
    * A paginated response object containing an array of **Activity** objects. Each object includes: `id`, `workspaceId`, `projectId`, `taskId`, `actionType`, `details`, `actorId`, `actor` (with `id`, `name`, `avatarUrl`), and `createdAt`.

**GET `/api/v1/workspaces/:workspaceId/activities`**
* **Description**: Lists all activities within a specific workspace.
* **Request**:
    * **URL Parameters**:
        * `workspaceId` (string, UUID)
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 50)
* **Success Response (200 OK)**:
    * A paginated list of **Activity** objects, same structure as the user activities endpoint.

**GET `/api/v1/projects/:projectId/activities`**
* **Description**: Lists all activities within a specific project.
* **Request**:
    * **URL Parameters**:
        * `projectId` (string, UUID)
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 50)
* **Success Response (200 OK)**:
    * A paginated list of **Activity** objects, same structure as the user activities endpoint.

**GET `/api/v1/tasks/:taskId/activities`**
* **Description**: Lists all activities for a specific task.
* **Request**:
    * **URL Parameters**:
        * `taskId` (string, UUID)
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 50)
* **Success Response (200 OK)**:
    * A paginated list of **Activity** objects, same structure as the user activities endpoint.

### **Dashboards & Widgets**
These endpoints manage dashboards and the widgets within them.

---
**POST `/api/v1/dashboards/`**
* **Description**: Creates a new dashboard. It can be associated with a user, project, or workspace, but only one of them.
* **Request**:
    * **Body**: A JSON object with `name` (string), optional `description` (string), and an optional `projectId`, `workspaceId`, or `userId` (string, UUID).
* **Success Response (201 Created)**:
    * A **Dashboard** object containing `id`, `name`, `description`, associated IDs (`projectId`, `workspaceId`, `userId`), an array of `widgets`, and timestamps.

**GET `/api/v1/dashboards/`**
* **Description**: Lists the dashboards for the currently authenticated user.
* **Request**:
    * **Query Parameters**: `page`, `limit`, `sortBy` (e.g., 'createdAt'), `sortOrder` ('asc' or 'desc').
* **Success Response (200 OK)**:
    * A paginated response object containing an array of **Dashboard** objects.

**GET `/api/v1/dashboards/:dashboardId`**
* **Description**: Retrieves a single dashboard by its ID.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Dashboard** object.

**PUT `/api/v1/dashboards/:dashboardId`**
* **Description**: Updates a dashboard's details, such as its name or description.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID).
    * **Body**: A JSON object with optional `name` (string) and `description` (string).
* **Success Response (200 OK)**:
    * The updated **Dashboard** object.

**DELETE `/api/v1/dashboards/:dashboardId`**
* **Description**: Deletes a dashboard.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/dashboards/:dashboardId/widgets/`**
* **Description**: Adds a new widget to a specified dashboard.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID).
    * **Body**: A JSON object with `title` (string), `type` (enum, e.g., 'STATS_COUNTER'), `config` (JSON), and `layout` (JSON with x, y, w, h coordinates).
* **Success Response (201 Created)**:
    * The newly created **Widget** object.

**GET `/api/v1/dashboards/:dashboardId/widgets/`**
* **Description**: Lists all widgets for a specific dashboard.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID).
    * **Query Parameters**: `page` (number, optional) and `limit` (number, optional).
* **Success Response (200 OK)**:
    * A paginated list of **Widget** objects.

**GET `/api/v1/dashboards/:dashboardId/widgets/:widgetId`**
* **Description**: Retrieves a single widget by its ID.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID) and `widgetId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Widget** object.

**PUT `/api/v1/dashboards/:dashboardId/widgets/:widgetId`**
* **Description**: Updates a widget's configuration or layout.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID) and `widgetId` (string, UUID).
    * **Body**: A JSON object with optional `title`, `config`, or `layout`.
* **Success Response (200 OK)**:
    * The updated **Widget** object.

**DELETE `/api/v1/dashboards/:dashboardId/widgets/:widgetId`**
* **Description**: Deletes a widget from a dashboard.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID) and `widgetId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**GET `/api/v1/dashboards/:dashboardId/widgets/:widgetId/data`**
* **Description**: Retrieves the processed data to be displayed within a widget.
* **Request**:
    * **URL Parameters**: `dashboardId` (string, UUID) and `widgetId` (string, UUID).
* **Success Response (200 OK)**:
    * A **ReportingWidgetData** object containing the widget `type`, the processed `payload`, and a `generatedAt` timestamp.

### **Reporting & Overviews**
These endpoints provide high-level aggregated data and reports.

---
**GET `/api/v1/reporting/global`**
* **Description**: Provides a global analytics overview across all workspaces and projects.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A **GlobalAnalyticsOverview** object with counts of total workspaces, projects, users, and tasks, plus breakdowns of tasks and projects by their status.

**GET `/api/v1/reporting/workspaces/:workspaceId`**
* **Description**: Provides an analytics overview for a specific workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
* **Success Response (200 OK)**:
    * A **WorkspaceAnalyticsOverview** object with counts of total projects, members, and tasks, a breakdown of tasks by status, and total time logged in seconds.

**GET `/api/v1/reporting/projects/:projectId`**
* **Description**: Provides an analytics overview for a specific project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (200 OK)**:
    * A **ProjectAnalyticsOverview** object with counts of tasks and members, breakdowns of tasks by status and priority, and totals for time logged, time estimated, and story points.

### **Reports**
These endpoints manage savable, shareable reports.

---
**POST `/api/v1/reports/`**
* **Description**: Creates a new report.
* **Request**:
    * **Body**: A JSON object with `title`, optional `summary`, `content`, `isPublic`, `status`, and associated IDs (`workspaceId`, `projectId`, `taskId`).
* **Success Response (201 Created)**:
    * A **Report** object containing the report's details.

**GET `/api/v1/reports/`**
* **Description**: Lists all reports accessible to the user.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), and filtering (`search`, `status`, `workspaceId`, etc.).
* **Success Response (200 OK)**:
    * A paginated list of **Report** objects.

**GET `/api/v1/reports/public`**
* **Description**: Lists all reports that have been marked as public.
* **Request**:
    * **Query Parameters**: Same as the primary list endpoint.
* **Success Response (200 OK)**:
    * A paginated list of public **Report** objects.

**GET `/api/v1/reports/:reportId`**
* **Description**: Retrieves a single report by its ID.
* **Request**:
    * **URL Parameters**: `reportId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Report** object.

**PUT `/api/v1/reports/:reportId`**
* **Description**: Updates an existing report.
* **Request**:
    * **URL Parameters**: `reportId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Report** object.

**DELETE `/api/v1/reports/:reportId`**
* **Description**: Deletes a report.
* **Request**:
    * **URL Parameters**: `reportId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Chat & Messaging**
These endpoints manage real-time chat channels and messages within workspaces and projects.

---
**POST `/api/v1/workspaces/:workspaceId/channels`**
* **Description**: Creates a new chat channel within a specific workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Body**: A JSON object with `name` (string, min 2 chars), `isPrivate` (boolean, default: false), and an optional array of `memberIds` (UUIDs).
* **Success Response (201 Created)**:
    * A **Channel** object containing its `id`, `name`, `isPrivate`, associated IDs (`workspaceId`, `projectId`), timestamps, and a list of `members` (with `userId`, `role`, `name`, and `avatarUrl`).

**GET `/api/v1/workspaces/:workspaceId/channels`**
* **Description**: Lists all chat channels for a specific workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
* **Success Response (200 OK)**:
    * An array of **Channel** objects.

**POST `/api/v1/projects/:projectId/channels`**
* **Description**: Creates a new chat channel within a specific project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name` (string, min 2 chars), `isPrivate` (boolean, default: false), and an optional array of `memberIds` (UUIDs).
* **Success Response (201 Created)**:
    * A **Channel** object.

**GET `/api/v1/projects/:projectId/channels`**
* **Description**: Lists all chat channels for a specific project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (200 OK)**:
    * An array of **Channel** objects.

**POST `/api/v1/chats/:channelId/members`**
* **Description**: Adds a new member to a chat channel.
* **Request**:
    * **URL Parameters**: `channelId` (string, UUID).
    * **Body**: A JSON object with `userId` (string, UUID) and an optional `role` (enum: 'OWNER', 'EDITOR', 'VIEWER', default: 'VIEWER').
* **Success Response (200 OK)**:
    * The updated **Channel** object, including the new member.

**DELETE `/api/v1/chats/:channelId/members/:userId`**
* **Description**: Removes a member from a chat channel.
* **Request**:
    * **URL Parameters**: `channelId` (string, UUID) and `userId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Channel** object.

**POST `/api/v1/chats/:channelId/messages`**
* **Description**: Sends a message to a chat channel.
* **Request**:
    * **URL Parameters**: `channelId` (string, UUID).
    * **Body**: A JSON object with `content` (string, min 1 char).
* **Success Response (201 Created)**:
    * A **Message** object containing its `id`, `content`, `authorId`, `channelId`, and timestamps.

**GET `/api/v1/chats/:channelId/messages`**
* **Description**: Lists the messages in a chat channel.
* **Request**:
    * **URL Parameters**: `channelId` (string, UUID).
    * **Query Parameters**: `page` (number, optional, default: 1) and `limit` (number, optional, default: 50).
* **Success Response (200 OK)**:
    * A paginated response containing an array of **Message** objects.

### **Comments**
These endpoints manage comments and their attachments to other entities.

---
**PUT `/api/v1/comments/:commentId`**
* **Description**: Updates the content of an existing comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID).
    * **Body**: A JSON object with an optional `content` (string).
* **Success Response (200 OK)**:
    * The updated **Comment** object, which includes `id`, `content`, `author`, associated entities (`publications`, `whiteboards`, etc.), and timestamps.

**DELETE `/api/v1/comments/:commentId`**
* **Description**: Deletes a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/comments/:commentId/publications`**
* **Description**: Attaches a publication to a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID).
    * **Body**: A JSON object with `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

**DELETE `/api/v1/comments/:commentId/publications/:entityId`**
* **Description**: Detaches a publication from a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID) and `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

**POST `/api/v1/comments/:commentId/whiteboards`**
* **Description**: Attaches a whiteboard to a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID).
    * **Body**: A JSON object with `entityId` (string, UUID of the whiteboard).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

**DELETE `/api/v1/comments/:commentId/whiteboards/:entityId`**
* **Description**: Detaches a whiteboard from a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID) and `entityId` (string, UUID of the whiteboard).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

**POST `/api/v1/comments/:commentId/knowledge-bases`**
* **Description**: Attaches a knowledge base to a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID).
    * **Body**: A JSON object with `entityId` (string, UUID of the knowledge base).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

**DELETE `/api/v1/comments/:commentId/knowledge-bases/:entityId`**
* **Description**: Detaches a knowledge base from a comment.
* **Request**:
    * **URL Parameters**: `commentId` (string, UUID) and `entityId` (string, UUID of the knowledge base).
* **Success Response (200 OK)**:
    * The updated **Comment** object.

### **Knowledge Base**
These endpoints are for managing knowledge bases and their internal pages.

---
**POST `/api/v1/knowledge-bases/`**
* **Description**: Creates a new knowledge base.
* **Request**:
    * **Body**: A JSON object with `name` (string, min 2 chars), and optional `description`, `isPublic` flag, and `parentKnowledgeBaseId`.
* **Success Response (201 Created)**:
    * A **KnowledgeBase** object containing its details, `ownerId`, and an optional list of `members`.

**GET `/api/v1/knowledge-bases/`**
* **Description**: Lists all accessible knowledge bases.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`) and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **KnowledgeBase** objects.

**GET `/api/v1/knowledge-bases/:knowledgeBaseId`**
* **Description**: Retrieves a single knowledge base by its ID.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **KnowledgeBase** object.

**PUT `/api/v1/knowledge-bases/:knowledgeBaseId`**
* **Description**: Updates a knowledge base's details.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **KnowledgeBase** object.

**DELETE `/api/v1/knowledge-bases/:knowledgeBaseId`**
* **Description**: Deletes a knowledge base.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/knowledge-bases/:knowledgeBaseId/pages`**
* **Description**: Creates a new page within a knowledge base.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID).
    * **Body**: A JSON object with `title` (string, min 1 char), and optional `content` (JSON) or `contentJson` (JSON).
* **Success Response (201 Created)**:
    * A **KnowledgePage** object containing its `id`, `title`, content, and authoring information.

**GET `/api/v1/knowledge-bases/:knowledgeBaseId/pages`**
* **Description**: Lists all pages within a knowledge base.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID).
    * **Query Parameters**: Includes pagination (`page`, `limit`) and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **KnowledgePage** objects.

**GET `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Retrieves a single knowledge page by its ID.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID) and `pageId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **KnowledgePage** object.

**PUT `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Updates a knowledge page.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID) and `pageId` (string, UUID).
    * **Body**: A JSON object with optional `title`, `content`, or `contentJson`.
* **Success Response (200 OK)**:
    * The updated **KnowledgePage** object.

**DELETE `/api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`**
* **Description**: Deletes a knowledge page.
* **Request**:
    * **URL Parameters**: `knowledgeBaseId` (string, UUID) and `pageId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Whiteboards**
These endpoints manage collaborative whiteboards.

---
**POST `/api/v1/whiteboards/`**
* **Description**: Creates a new whiteboard.
* **Request**:
    * **Body**: A JSON object with `name` (string, min 2 chars) and optional `parentWhiteboardId` and `content`.
* **Success Response (201 Created)**:
    * A **Whiteboard** object containing its details and `ownerId`.

**GET `/api/v1/whiteboards/`**
* **Description**: Lists all whiteboards accessible to the user.
* **Request**:
    * **Query Parameters**: `page` (number, optional) and `limit` (number, optional).
* **Success Response (200 OK)**:
    * A paginated list of **Whiteboard** objects.

**GET `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Retrieves a single whiteboard by its ID.
* **Request**:
    * **URL Parameters**: `whiteboardId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Whiteboard** object.

**PUT `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Updates a whiteboard's details or content.
* **Request**:
    * **URL Parameters**: `whiteboardId` (string, UUID).
    * **Body**: A JSON object with optional `name`, `parentWhiteboardId`, or `content`.
* **Success Response (200 OK)**:
    * The updated **Whiteboard** object.

**DELETE `/api/v1/whiteboards/:whiteboardId`**
* **Description**: Deletes a whiteboard.
* **Request**:
    * **URL Parameters**: `whiteboardId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Deals**
These endpoints are for managing sales or funding deals, tracking their value, stage, and associated contacts.

---
**POST `/api/v1/deals/`**
* **Description**: Creates a new deal.
* **Request**:
    * **Body**: A JSON object containing `name` (string), `value` (number), `stageId` (UUID), `organizationId` (UUID), and optional `ownerId` (UUID), `projectId` (UUID), and `contactIds` (array of UUIDs).
* **Success Response (201 Created)**:
    * A **Deal** object, which includes `id`, `name`, `value`, `stage`, `organization`, `ownerName`, `contacts`, and timestamps.

**GET `/api/v1/deals/`**
* **Description**: Lists all deals.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), a `search` term, and an optional `stageId` (UUID) for filtering.
* **Success Response (200 OK)**:
    * A paginated list of **Deal** objects.

**GET `/api/v1/deals/:dealId`**
* **Description**: Retrieves a single deal by its ID.
* **Request**:
    * **URL Parameters**: `dealId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Deal** object.

**PUT `/api/v1/deals/:dealId`**
* **Description**: Updates an existing deal.
* **Request**:
    * **URL Parameters**: `dealId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request (except `organizationId`).
* **Success Response (200 OK)**:
    * The updated **Deal** object.

**DELETE `/api/v1/deals/:dealId`**
* **Description**: Deletes a deal.
* **Request**:
    * **URL Parameters**: `dealId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Deal Stages**
These endpoints manage the customizable stages that a deal can move through (e.g., "Lead," "Negotiation," "Closed").

---
**POST `/api/v1/deal-stages/`**
* **Description**: Creates a new deal stage for a project.
* **Request**:
    * **Body**: A JSON object with `name` (string), `order` (integer), and `projectId` (UUID).
* **Success Response (201 Created)**:
    * A **DealStage** object with `id`, `name`, `order`, `projectId`, and timestamps.

**GET `/api/v1/deal-stages/`**
* **Description**: Lists all deal stages for a specific project.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`) and a required `projectId` (UUID).
* **Success Response (200 OK)**:
    * A paginated list of **DealStage** objects.

**GET `/api/v1/deal-stages/:stageId`**
* **Description**: Retrieves a single deal stage by its ID.
* **Request**:
    * **URL Parameters**: `stageId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **DealStage** object.

**PUT `/api/v1/deal-stages/:stageId`**
* **Description**: Updates an existing deal stage.
* **Request**:
    * **URL Parameters**: `stageId` (string, UUID).
    * **Body**: A JSON object with an optional `name` and `order`.
* **Success Response (200 OK)**:
    * The updated **DealStage** object.

**DELETE `/api/v1/deal-stages/:stageId`**
* **Description**: Deletes a deal stage.
* **Request**:
    * **URL Parameters**: `stageId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Interactions**
These endpoints log interactions (e.g., emails, calls, meetings) with people, organizations, or deals.

---
**POST `/api/v1/interactions/`**
* **Description**: Creates a new interaction record.
* **Request**:
    * **Body**: A JSON object with `type` (enum: 'EMAIL', 'CALL', 'MEETING', 'SOCIAL'), `notes` (string), `date` (datetime), and at least one of an optional `personId`, `organizationId`, or `dealId`.
* **Success Response (201 Created)**:
    * An **Interaction** object with its details and associated IDs.

**GET `/api/v1/interactions/`**
* **Description**: Lists all interactions.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and optional filters for `personId`, `organizationId`, or `dealId`.
* **Success Response (200 OK)**:
    * A paginated list of **Interaction** objects.

**GET `/api/v1/interactions/:interactionId`**
* **Description**: Retrieves a single interaction by its ID.
* **Request**:
    * **URL Parameters**: `interactionId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Interaction** object.

**PUT `/api/v1/interactions/:interactionId`**
* **Description**: Updates an existing interaction.
* **Request**:
    * **URL Parameters**: `interactionId` (string, UUID).
    * **Body**: A JSON object with any of the optional fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Interaction** object.

**DELETE `/api/v1/interactions/:interactionId`**
* **Description**: Deletes an interaction.
* **Request**:
    * **URL Parameters**: `interactionId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Organizations**
These endpoints manage organizations or companies within the CRM.

---
**POST `/api/v1/organizations/`**
* **Description**: Creates a new organization.
* **Request**:
    * **Body**: A JSON object with `name` (string) and optional `description`, `domain`, and `logoUrl`.
* **Success Response (201 Created)**:
    * An **Organization** object with its details, an empty array for `people`, and timestamps.

**GET `/api/v1/organizations/`**
* **Description**: Lists all organizations.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **Organization** objects.

**GET `/api/v1/organizations/:organizationId`**
* **Description**: Retrieves a single organization by its ID.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Organization** object.

**PUT `/api/v1/organizations/:organizationId`**
* **Description**: Updates an existing organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Organization** object.

**DELETE `/api/v1/organizations/:organizationId`**
* **Description**: Deletes an organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/organizations/:organizationId/publications`**
* **Description**: Attaches a publication to an organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID).
    * **Body**: A JSON object with `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Organization** object.

**DELETE `/api/v1/organizations/:organizationId/publications/:entityId`**
* **Description**: Detaches a publication from an organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID) and `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Organization** object.

### **People**
These endpoints manage individual contacts or people within the CRM.

---
**POST `/api/v1/people/`**
* **Description**: Creates a new person.
* **Request**:
    * **Body**: A JSON object with `firstName`, `lastName`, and optional details like `email`, `avatarUrl`, `biography`, `socialLinks`, and `skillIds`.
* **Success Response (201 Created)**:
    * A **Person** object with all their details.

**GET `/api/v1/people/`**
* **Description**: Lists all people in the CRM.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **Person** objects.

**DELETE `/api/v1/people/`**
* **Description**: Deletes multiple people in a single request.
* **Request**:
    * **Body**: A JSON object with an `ids` array of user UUIDs.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of people deleted.

**GET `/api/v1/people/:personId`**
* **Description**: Retrieves a single person by their ID.
* **Request**:
    * **URL Parameters**: `personId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Person** object.

**PUT `/api/v1/people/:personId`**
* **Description**: Updates an existing person.
* **Request**:
    * **URL Parameters**: `personId` (string, UUID).
    * **Body**: A JSON object with any of the optional fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Person** object.

**DELETE `/api/v1/people/:personId`**
* **Description**: Deletes a person.
* **Request**:
    * **URL Parameters**: `personId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/people/:personId/publications`**
* **Description**: Attaches a publication to a person.
* **Request**:
    * **URL Parameters**: `personId` (string, UUID).
    * **Body**: A JSON object with `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Person** object.

**DELETE `/api/v1/people/:personId/publications/:entityId`**
* **Description**: Detaches a publication from a person.
* **Request**:
    * **URL Parameters**: `personId` (string, UUID) and `entityId` (string, UUID of the publication).
* **Success Response (200 OK)**:
    * The updated **Person** object.

### **Person-Organization Links**
These endpoints manage the relationship between people and organizations.

---
**POST `/api/v1/organizations/:organizationId/people/`**
* **Description**: Links a person to an organization, optionally defining their role.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID).
    * **Body**: A JSON object with `personId` (string, UUID) and an optional `role` (string).
* **Success Response (201 Created)**:
    * The updated **Organization** object, with the new person included in its `people` array.

**DELETE `/api/v1/organizations/:organizationId/people/:personId`**
* **Description**: Unlinks a person from an organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID) and `personId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Organization** object.

**PATCH `/api/v1/organizations/:organizationId/people/:personId`**
* **Description**: Updates a person's role within an organization.
* **Request**:
    * **URL Parameters**: `organizationId` (string, UUID) and `personId` (string, UUID).
    * **Body**: A JSON object with an optional `role` (string).
* **Success Response (200 OK)**:
    * The updated **Organization** object.

### **Skills**
This endpoint manages the list of skills that can be associated with people.

---
**GET `/api/v1/skills/`**
* **Description**: Retrieves a list of all available skills.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * An array of **Skill** objects, each with `id`, `name`, `description`, `category`, and timestamps.

### **Custom Field Definitions**
These endpoints are nested under a specific project and manage the custom fields available for tasks within that project. The base URL is `/api/v1/projects/:projectId/custom-fields`.

---
**POST `/api/v1/projects/:projectId/custom-fields/`**
* **Description**: Creates a new custom field definition for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name` (string), `type` (enum: 'TEXT', 'NUMBER', 'DATE', 'SELECT'), and an optional `options` object for 'SELECT' types which contains a `values` array of strings.
* **Success Response (201 Created)**:
    * A **CustomFieldDefinition** object, including `id`, `name`, `type`, `projectId`, `options`, and timestamps.

**GET `/api/v1/projects/:projectId/custom-fields/`**
* **Description**: Lists all custom field definitions for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page` (number, optional), `limit` (number, optional), `sortBy` (enum, optional), `sortOrder` (enum, optional).
* **Success Response (200 OK)**:
    * A paginated list of **CustomFieldDefinition** objects.

**GET `/api/v1/projects/:projectId/custom-fields/:customFieldId`**
* **Description**: Retrieves a single custom field definition by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `customFieldId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **CustomFieldDefinition** object.

**PUT `/api/v1/projects/:projectId/custom-fields/:customFieldId`**
* **Description**: Updates an existing custom field definition.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `customFieldId` (string, UUID).
    * **Body**: A JSON object with optional `name`, `type`, or `options`.
* **Success Response (200 OK)**:
    * The updated **CustomFieldDefinition** object.

**DELETE `/api/v1/projects/:projectId/custom-fields/:customFieldId`**
* **Description**: Deletes a custom field definition.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `customFieldId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Goals**
These endpoints manage Goals (OKRs) for a specific project. The base URL is `/api/v1/projects/:projectId/goals`.

---
**POST `/api/v1/projects/:projectId/goals/`**
* **Description**: Creates a new goal within a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name`, `status`, `ownerId`, and optional `description`, `startDate`, `endDate`, and an array of `keyResults`.
* **Success Response (201 Created)**:
    * A **Goal** object, including its details and the nested **KeyResult** objects.

**GET `/api/v1/projects/:projectId/goals/`**
* **Description**: Lists all goals for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page`, `limit`, `sortBy`, `sortOrder`, `search`, `status`.
* **Success Response (200 OK)**:
    * A paginated list of **Goal** objects.

**GET `/api/v1/projects/:projectId/goals/:goalId`**
* **Description**: Retrieves a single goal by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `goalId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Goal** object.

**PUT `/api/v1/projects/:projectId/goals/:goalId`**
* **Description**: Updates an existing goal.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `goalId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Goal** object.

**DELETE `/api/v1/projects/:projectId/goals/:goalId`**
* **Description**: Deletes a goal.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `goalId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Lead Forms**
These endpoints manage lead capture forms for a project. The base URL is `/api/v1/projects/:projectId/lead-forms`.

---
**POST `/api/v1/projects/:projectId/lead-forms/`**
* **Description**: Creates a new lead form for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name` (string) and a `fields` array defining the form structure.
* **Success Response (201 Created)**:
    * A **LeadForm** object with `id`, `name`, `fields`, `projectId`, and timestamps.

**GET `/api/v1/projects/:projectId/lead-forms/`**
* **Description**: Lists all lead forms for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page` and `limit`.
* **Success Response (200 OK)**:
    * A paginated list of **LeadForm** objects.

**GET `/api/v1/projects/:projectId/lead-forms/:leadFormId`**
* **Description**: Retrieves a single lead form by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `leadFormId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **LeadForm** object.

**PUT `/api/v1/projects/:projectId/lead-forms/:leadFormId`**
* **Description**: Updates an existing lead form.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `leadFormId` (string, UUID).
    * **Body**: A JSON object with an optional `name` or `fields` array.
* **Success Response (200 OK)**:
    * The updated **LeadForm** object.

**DELETE `/api/v1/projects/:projectId/lead-forms/:leadFormId`**
* **Description**: Deletes a lead form.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `leadFormId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Project Members**
Endpoints for managing user membership within a project. The base URL is `/api/v1/projects/:projectId/members`.

---
**GET `/api/v1/projects/:projectId/members/`**
* **Description**: Lists all members of a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (200 OK)**:
    * An array of **ProjectMember** objects, each containing user details (`userId`, `name`, `email`, `avatarUrl`) and their role information (`roleId`, `roleName`, `isGuest`).

**POST `/api/v1/projects/:projectId/members/`**
* **Description**: Adds a single user to a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `userId` (UUID), `roleId` (UUID), and `isGuest` (boolean, default: false).
* **Success Response (201 Created)**:
    * The newly created **ProjectMember** object.

**POST `/api/v1/projects/:projectId/members/team`**
* **Description**: Adds all members of a specified team to a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `teamId` (UUID), `roleId` (UUID), and `isGuest` (boolean, default: false).
* **Success Response (201 Created)**:
    * A JSON object with a `count` of the number of members added.

**PATCH `/api/v1/projects/:projectId/members/:userId`**
* **Description**: Updates a member's role or guest status within a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `userId` (string, UUID).
    * **Body**: A JSON object with a `roleId` (UUID) and an optional `isGuest` (boolean).
* **Success Response (200 OK)**:
    * The updated **ProjectMember** object.

**DELETE `/api/v1/projects/:projectId/members/:userId`**
* **Description**: Removes a member from a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `userId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Project Roles**
Endpoints for managing roles and their permissions within a project. The base URL is `/api/v1/projects/:projectId/roles`.

---
**GET `/api/v1/projects/:projectId/roles/`**
* **Description**: Lists all roles for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page` and `limit`.
* **Success Response (200 OK)**:
    * A paginated list of **ProjectRole** objects, each with `id`, `name`, `projectId`, and an array of `permissions`.

**POST `/api/v1/projects/:projectId/roles/`**
* **Description**: Creates a new role for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name` (string, min 2 chars).
* **Success Response (201 Created)**:
    * The newly created **ProjectRole** object.

**GET `/api/v1/projects/:projectId/roles/:roleId`**
* **Description**: Retrieves a single project role by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `roleId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **ProjectRole** object.

**PUT `/api/v1/projects/:projectId/roles/:roleId`**
* **Description**: Updates an existing project role.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `roleId` (string, UUID).
    * **Body**: A JSON object with an optional `name`.
* **Success Response (200 OK)**:
    * The updated **ProjectRole** object.

**DELETE `/api/v1/projects/:projectId/roles/:roleId`**
* **Description**: Deletes a project role.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `roleId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Project Templates**
Endpoints for managing project templates. Base URL: `/api/v1/project-templates`.

---
**POST `/api/v1/project-templates/`**
* **Description**: Creates a new project template from an existing project.
* **Request**:
    * **Body**: A JSON object with `name` (string), `sourceProjectId` (UUID), and optional `description`.
* **Success Response (201 Created)**:
    * A **ProjectTemplate** object.

**GET `/api/v1/project-templates/`**
* **Description**: Lists all available project templates.
* **Request**:
    * **Query Parameters**: `page`, `limit`, and `search`.
* **Success Response (200 OK)**:
    * A paginated list of **ProjectTemplate** objects.

**POST `/api/v1/project-templates/:templateId/create-project`**
* **Description**: Creates a new project from a template.
* **Request**:
    * **URL Parameters**: `templateId` (string, UUID).
    * **Body**: A JSON object with a `name` for the new project.
* **Success Response (201 Created)**:
    * A full **Project** object.

**GET `/api/v1/project-templates/:templateId`**
* **Description**: Retrieves a single project template by its ID.
* **Request**:
    * **URL Parameters**: `templateId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **ProjectTemplate** object.

**PUT `/api/v1/project-templates/:templateId`**
* **Description**: Updates an existing project template.
* **Request**:
    * **URL Parameters**: `templateId` (string, UUID).
    * **Body**: A JSON object with an optional `name` and `description`.
* **Success Response (200 OK)**:
    * The updated **ProjectTemplate** object.

**DELETE `/api/v1/project-templates/:templateId`**
* **Description**: Deletes a project template.
* **Request**:
    * **URL Parameters**: `templateId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Projects**
Core endpoints for managing projects and attaching other entities to them. Base URL: `/api/v1/projects`.

---
**GET `/api/v1/projects/:projectId`**
* **Description**: Retrieves a single project by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (200 OK)**:
    * A **Project** object containing `id`, `name`, `description`, `status`, and arrays of attached `knowledgeBases`, `whiteboards`, and `publications`.

**PUT `/api/v1/projects/:projectId`**
* **Description**: Updates an existing project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with any of the project's editable fields (e.g., `name`, `description`, `status`).
* **Success Response (200 OK)**:
    * The updated **Project** object.

**DELETE `/api/v1/projects/:projectId`**
* **Description**: Deletes a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST/DELETE `/api/v1/projects/:projectId/{knowledge-bases|whiteboards|publications}`**
* **Description**: Attaches an entity to a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: `{ "entityId": "..." }`
* **Success Response (200 OK)**: The updated **Project** object.

**DELETE `/api/v1/projects/:projectId/{knowledge-bases|whiteboards|publications}/:entityId`**
* **Description**: Detaches an entity from a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `entityId` (string, UUID).
* **Success Response (200 OK)**: The updated **Project** object.

### **Task Templates**
Endpoints for managing task templates within a project. Base URL: `/api/v1/projects/:projectId/task-templates`.

---
**POST `/api/v1/projects/:projectId/task-templates/`**
* **Description**: Creates a new task template within a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name`, optional `description`, and `templateData` (a JSON object with task properties).
* **Success Response (201 Created)**:
    * A **TaskTemplate** object.

**POST `/api/v1/task-templates/:templateId/instantiate`**
* **Description**: Creates a new task instance from a template.
* **Request**:
    * **URL Parameters**: `templateId` (string, UUID).
* **Success Response (201 Created)**:
    * A new **Task** object.

**GET `/api/v1/projects/:projectId/task-templates/`**
* **Description**: Lists all task templates for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page` and `limit`.
* **Success Response (200 OK)**:
    * A paginated list of **TaskTemplate** objects.

**GET `/api/v1/projects/:projectId/task-templates/:templateId`**
* **Description**: Retrieves a single task template by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `templateId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **TaskTemplate** object.

**DELETE `/api/v1/projects/:projectId/task-templates/:templateId`**
* **Description**: Deletes a task template.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `templateId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Task Types**
Endpoints for managing task types within a project. Base URL: `/api/v1/projects/:projectId/task-types`.

---
**POST `/api/v1/projects/:projectId/task-types/`**
* **Description**: Creates a new task type for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name` (string) and optional `icon` and `color`.
* **Success Response (201 Created)**:
    * A **TaskType** object.

**GET `/api/v1/projects/:projectId/task-types/`**
* **Description**: Lists all task types for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
* **Success Response (200 OK)**:
    * A paginated list of **TaskType** objects.

**GET `/api/v1/projects/:projectId/task-types/:taskTypeId`**
* **Description**: Retrieves a single task type by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskTypeId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **TaskType** object.

**PUT `/api/v1/projects/:projectId/task-types/:taskTypeId`**
* **Description**: Updates an existing task type.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskTypeId` (string, UUID).
    * **Body**: A JSON object with an optional `name`, `icon`, or `color`.
* **Success Response (200 OK)**:
    * The updated **TaskType** object.

**DELETE `/api/v1/projects/:projectId/task-types/:taskTypeId`**
* **Description**: Deletes a task type.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskTypeId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Views**
Endpoints for managing project views (e.g., Kanban, List, Calendar). The base URL is `/api/v1/projects/:projectId/views`.

---
**POST `/api/v1/projects/:projectId/views/`**
* **Description**: Creates a new view for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object with `name`, `type` (enum), and optional `config`, `columns`, `filters`, `sorting`, `grouping`, and `isPublic`.
* **Success Response (201 Created)**:
    * A **View** object.

**GET `/api/v1/projects/:projectId/views/`**
* **Description**: Lists all views for a project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: `page`, `limit`, `sortBy`, `sortOrder`, `startDate`, `endDate`.
* **Success Response (200 OK)**:
    * A paginated list of **View** objects.

**GET `/api/v1/projects/:projectId/views/:viewId`**
* **Description**: Retrieves a single view by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `viewId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **View** object.

**GET `/api/v1/projects/:projectId/views/:viewId/data`**
* **Description**: Fetches the data (usually tasks) to be displayed in a view.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `viewId` (string, UUID).
    * **Query Parameters**: Task-specific query parameters for filtering and sorting.
* **Success Response (200 OK)**:
    * A paginated list of **Task** objects.

**PUT `/api/v1/projects/:projectId/views/:viewId`**
* **Description**: Updates an existing view.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `viewId` (string, UUID).
    * **Body**: A JSON object with optional `name`, `config`, `columns`, etc.
* **Success Response (200 OK)**:
    * The updated **View** object.

**DELETE `/api/v1/projects/:projectId/views/:viewId`**
* **Description**: Deletes a view.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `viewId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Project Tasks**
These endpoints are nested under a specific project and manage the tasks within that project's context. The base URL is `/api/v1/projects/:projectId/tasks`.

---
**POST `/api/v1/projects/:projectId/tasks/`**
* **Description**: Creates a new task within a specific project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Body**: A JSON object containing a `title` (string) and optional fields like `description`, `status`, `priority`, `dueDate`, `assigneeIds`, `parentId`, etc.
* **Success Response (201 Created)**:
    * A **Task** object with all its details, including the provided data plus generated fields like `id`, timestamps, and resolved nested data like `assignees`.

**GET `/api/v1/projects/:projectId/tasks/`**
* **Description**: Lists tasks for a specific project.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID).
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), and filtering (`search`, `status`, `priority`, dates, etc.).
* **Success Response (200 OK)**:
    * A paginated list of **Task** objects.

**GET `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Retrieves a single task by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
* **Success Response (200 OK)**:
    * A single, detailed **Task** object.

**PUT `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Updates an existing task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with any of the task's editable fields.
* **Success Response (200 OK)**:
    * The updated **Task** object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId`**
* **Description**: Deletes a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**GET `/api/v1/projects/:projectId/tasks/:taskId/subtasks`**
* **Description**: Retrieves the subtasks for a specific parent task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Query Parameters**: Standard task listing query parameters.
* **Success Response (200 OK)**:
    * A paginated list of **Task** objects that are subtasks of the parent.

**PATCH `/api/v1/projects/:projectId/tasks/:taskId/move`**
* **Description**: Moves a task to a different column or position, typically in a Kanban view.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with `targetColumnId` (UUID) and `orderInColumn` (integer).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/links`**
* **Description**: Creates a link (e.g., "blocks", "relates to") between two tasks.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID of the source task).
    * **Body**: A JSON object with `targetTaskId` (UUID) and `type` (enum: 'RELATES_TO', 'BLOCKS', 'IS_BLOCKED_BY').
* **Success Response (200 OK)**:
    * The updated source **Task** object, now containing the new link.

**PATCH `/api/v1/projects/:projectId/tasks/:taskId/links/:linkId`**
* **Description**: Updates the type of an existing task link.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `linkId` (string, UUID).
    * **Body**: A JSON object with the new `type` (enum).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/links/:linkId`**
* **Description**: Removes a link between tasks.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `linkId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/assignees`**
* **Description**: Assigns a user to a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with `userId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Task** object with the new assignee.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/assignees/:userId`**
* **Description**: Unassigns a user from a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `userId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**PATCH `/api/v1/projects/:projectId/tasks/:taskId/custom-fields`**
* **Description**: Updates one or more custom field values for a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with an `updates` array, where each item contains a `fieldId` and its new `value`.
* **Success Response (200 OK)**:
    * The updated **Task** object with the new custom field values.

**POST `/api/v1/projects/:projectId/tasks/:taskId/documents`**
* **Description**: Attaches a document (file) to a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: `multipart/form-data` containing the file and a `type` field ('INPUT' or 'OUTPUT').
* **Success Response (200 OK)**:
    * The updated **Task** object with the new document attached.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/documents/:documentId/:type`**
* **Description**: Detaches a document from a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), `documentId` (string, UUID), and `type` (enum).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/{knowledge-bases|whiteboards|publications}`**
* **Description**: Attaches a knowledge base, whiteboard, or publication to a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID). The final path segment is `knowledge-bases`, `whiteboards`, or `publications`.
    * **Body**: A JSON object with `entityId` (string, UUID of the item to attach).
* **Success Response (200 OK)**:
    * The updated **Task** object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/{knowledge-bases|whiteboards|publications}/:entityId`**
* **Description**: Detaches a knowledge base, whiteboard, or publication from a task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `entityId` (string, UUID of the item to detach). The middle path segment is `knowledge-bases`, `whiteboards`, or `publications`.
* **Success Response (200 OK)**:
    * The updated **Task** object.

**POST `/api/v1/projects/:projectId/tasks/:taskId/comments`**
* **Description**: Creates a comment on a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with `content` (string).
* **Success Response (201 Created)**:
    * A **Comment** object with its details.

**GET `/api/v1/projects/:projectId/tasks/:taskId/comments`**
* **Description**: Lists all comments for a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Query Parameters**: Standard pagination (`page`, `limit`).
* **Success Response (200 OK)**:
    * A paginated list of **Comment** objects.

### **Standalone Tasks**
These endpoints manage tasks that are not associated with a project. The base URL is `/api/v1/standalone-tasks`.

---
**POST `/api/v1/standalone-tasks/`**
* **Description**: Creates a new standalone task, not associated with any project.
* **Request**:
    * **Body**: A JSON object with `title` and other optional task fields, similar to creating a project task but without a `projectId`.
* **Success Response (201 Created)**:
    * A new **Task** object where `projectId` is null.

**GET `/api/v1/standalone-tasks/my-tasks`**
* **Description**: Lists all tasks (both standalone and project-based) that are either created by or assigned to the current user.
* **Request**:
    * **Query Parameters**: Standard task list query parameters (`page`, `limit`, `status`, `search`, etc.).
* **Success Response (200 OK)**:
    * A paginated list of **Task** objects.

**DELETE `/api/v1/standalone-tasks/`**
* **Description**: Deletes multiple tasks in a single request.
* **Request**:
    * **Body**: A JSON object with an `ids` array of task UUIDs.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of tasks deleted.

**The following standalone task endpoints mirror their project-nested counterparts but operate on tasks where `projectId` is null.**

* **GET `/api/v1/standalone-tasks/:taskId`**: Retrieves a single standalone task.
* **PUT `/api/v1/standalone-tasks/:taskId`**: Updates a standalone task.
* **DELETE `/api/v1/standalone-tasks/:taskId`**: Deletes a standalone task.
* **POST `/api/v1/standalone-tasks/:taskId/assignees`**: Assigns a user to a standalone task.
* **DELETE `/api/v1/standalone-tasks/:taskId/assignees/:userId`**: Unassigns a user from a standalone task.
* **POST `/api/v1/standalone-tasks/:taskId/documents`**: Attaches a document to a standalone task.
* **DELETE `/api/v1/standalone-tasks/:taskId/documents/:documentId/:type`**: Detaches a document from a standalone task.
* **PATCH `/api/v1/standalone-tasks/:taskId/custom-fields`**: Updates custom field values for a standalone task.
* **POST `/api/v1/standalone-tasks/:taskId/comments`**: Creates a comment on a standalone task.
* **GET `/api/v1/standalone-tasks/:taskId/comments`**: Lists comments for a standalone task.

### **Time Logs**
These endpoints manage time tracking entries for tasks. Based on the application's routing structure, these endpoints are nested under tasks. The following routes are explicitly defined for **standalone tasks** and are logically intended for **project tasks** as well, though the latter registration is missing in the provided code.

#### **Standalone Task Time Logs**
Base URL: `/api/v1/standalone-tasks/:taskId/timelogs`

---
**POST `/api/v1/standalone-tasks/:taskId/timelogs/`**
* **Description**: Creates a new time log for a standalone task.
* **Request**:
    * **URL Parameters**: `taskId` (string, UUID).
    * **Body**: A JSON object with `duration` (integer representing seconds), `loggedAt` (a valid date string), and an optional `description` (string).
* **Success Response (201 Created)**:
    * A **TimeLog** object, which includes `id`, `userId`, `taskId`, `duration`, `description`, `loggedAt`, and timestamps.

**GET `/api/v1/standalone-tasks/:taskId/timelogs/`**
* **Description**: Lists all time logs for a standalone task.
* **Request**:
    * **URL Parameters**: `taskId` (string, UUID).
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 10)
        * `sortBy` (enum: 'createdAt' or 'loggedAt', default: 'loggedAt')
        * `sortOrder` (enum: 'asc' or 'desc', default: 'desc')
        * `userId` (string, UUID, optional) to filter by a specific user.
* **Success Response (200 OK)**:
    * A paginated response object containing an array of **TimeLog** objects.

**GET `/api/v1/standalone-tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Retrieves a single time log by its ID.
* **Request**:
    * **URL Parameters**: `taskId` (string, UUID) and `timeLogId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **TimeLog** object.

**PUT `/api/v1/standalone-tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Updates an existing time log.
* **Request**:
    * **URL Parameters**: `taskId` (string, UUID) and `timeLogId` (string, UUID).
    * **Body**: A JSON object with optional `duration`, `loggedAt`, or `description`.
* **Success Response (200 OK)**:
    * The updated **TimeLog** object.

**DELETE `/api/v1/standalone-tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Deletes a time log.
* **Request**:
    * **URL Parameters**: `taskId` (string, UUID) and `timeLogId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

#### **Project Task Time Logs**
Base URL: `/api/v1/projects/:projectId/tasks/:taskId/timelogs`

---
**POST `/api/v1/projects/:projectId/tasks/:taskId/timelogs/`**
* **Description**: Creates a new time log for a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Body**: A JSON object with `duration` (integer representing seconds), `loggedAt` (a valid date string), and an optional `description` (string).
* **Success Response (201 Created)**:
    * A **TimeLog** object.

**GET `/api/v1/projects/:projectId/tasks/:taskId/timelogs/`**
* **Description**: Lists all time logs for a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID) and `taskId` (string, UUID).
    * **Query Parameters**:
        * `page` (number, optional, default: 1)
        * `limit` (number, optional, default: 10)
        * `sortBy` (enum: 'createdAt' or 'loggedAt', default: 'loggedAt')
        * `sortOrder` (enum: 'asc' or 'desc', default: 'desc')
        * `userId` (string, UUID, optional) to filter by a specific user.
* **Success Response (200 OK)**:
    * A paginated response object containing an array of **TimeLog** objects.

**GET `/api/v1/projects/:projectId/tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Retrieves a single time log for a project task by its ID.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `timeLogId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **TimeLog** object.

**PUT `/api/v1/projects/:projectId/tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Updates an existing time log on a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `timeLogId` (string, UUID).
    * **Body**: A JSON object with optional `duration`, `loggedAt`, or `description`.
* **Success Response (200 OK)**:
    * The updated **TimeLog** object.

**DELETE `/api/v1/projects/:projectId/tasks/:taskId/timelogs/:timeLogId`**
* **Description**: Deletes a time log from a project task.
* **Request**:
    * **URL Parameters**: `projectId` (string, UUID), `taskId` (string, UUID), and `timeLogId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Announcements**
These endpoints manage system-wide announcements that can be displayed to users. The base URL is `/api/v1/announcements`.

---
**POST `/api/v1/announcements/`**
* **Description**: Creates a new announcement.
* **Request**:
    * **Body**: A JSON object with `title` (string), `content` (JSON), `status` (enum: 'DRAFT', 'PUBLISHED', 'ARCHIVED'), `severity` (enum), `isPinned` (boolean), an optional `expiresAt` date, and an optional array of `targetRoleIds`.
* **Success Response (201 Created)**:
    * An **Announcement** object containing all its details, including the `id`, `author` information, and timestamps.

**GET `/api/v1/announcements/`**
* **Description**: Lists all announcements for administrative purposes.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), a `search` term, and a `status` filter.
* **Success Response (200 OK)**:
    * A paginated list of **Announcement** objects.

**GET `/api/v1/announcements/active`**
* **Description**: Lists announcements that are currently active (published and not expired) and targeted to the authenticated user's roles.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * An array of **Announcement** objects.

**DELETE `/api/v1/announcements/`**
* **Description**: Deletes multiple announcements in a single request.
* **Request**:
    * **Body**: A JSON object with an `ids` array of announcement UUIDs.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of announcements deleted.

**GET `/api/v1/announcements/:id`**
* **Description**: Retrieves a single announcement by its ID.
* **Request**:
    * **URL Parameters**: `id` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Announcement** object.

**PUT `/api/v1/announcements/:id`**
* **Description**: Updates an existing announcement.
* **Request**:
    * **URL Parameters**: `id` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Announcement** object.

**DELETE `/api/v1/announcements/:id`**
* **Description**: Deletes a single announcement.
* **Request**:
    * **URL Parameters**: `id` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Background Jobs & Scheduling**
These admin-only endpoints are for monitoring and managing the background job processing system. The base URL is `/api/v1/admin/jobs`.

---
**POST `/api/v1/admin/jobs/`**
* **Description**: Manually creates and queues a new background job.
* **Request**:
    * **Body**: A JSON object with `type` (string), `payload` (JSON), and optional `priority`, `maxAttempts`, `scheduledAt`, or `delay`.
* **Success Response (201 Created)**:
    * A **Job** object with its details, `id`, and initial 'PENDING' status.

**GET `/api/v1/admin/jobs/`**
* **Description**: Lists all background jobs.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and filtering by `type` or `status`.
* **Success Response (200 OK)**:
    * A paginated list of **Job** objects.

**DELETE `/api/v1/admin/jobs/:jobId`**
* **Description**: Deletes a job from the queue.
* **Request**:
    * **URL Parameters**: `jobId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**GET `/api/v1/admin/jobs/:jobId`**
* **Description**: Retrieves a single job by its ID, including its attempt history.
* **Request**:
    * **URL Parameters**: `jobId` (string, UUID).
* **Success Response (200 OK)**:
    * A **Job** object that includes an `attempts_log` array.

**POST `/api/v1/admin/jobs/:jobId/retry`**
* **Description**: Manually retries a failed or cancelled job.
* **Request**:
    * **URL Parameters**: `jobId` (string, UUID).
* **Success Response (200 OK)**:
    * A JSON object with a success `message` and the updated **Job** object.

**POST `/api/v1/admin/jobs/:jobId/cancel`**
* **Description**: Cancels a pending or running job.
* **Request**:
    * **URL Parameters**: `jobId` (string, UUID).
* **Success Response (200 OK)**:
    * A JSON object with a success `message` and the updated **Job** object.

**POST `/api/v1/admin/jobs/schedules/`**
* **Description**: Creates a new scheduled (cron) job.
* **Request**:
    * **Body**: A JSON object with `name`, `jobType`, `cronExpression`, `payload` (JSON), and `isActive`.
* **Success Response (201 Created)**:
    * A **JobSchedule** object.

**GET `/api/v1/admin/jobs/schedules/`**
* **Description**: Lists all scheduled jobs.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and filtering by `jobType` or `isActive`.
* **Success Response (200 OK)**:
    * A paginated list of **JobSchedule** objects.

**DELETE `/api/v1/admin/jobs/schedules/:scheduleId`**
* **Description**: Deletes a scheduled job.
* **Request**:
    * **URL Parameters**: `scheduleId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**GET `/api/v1/admin/jobs/schedules/:scheduleId`**
* **Description**: Retrieves a single scheduled job by its ID.
* **Request**:
    * **URL Parameters**: `scheduleId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **JobSchedule** object.

**PUT `/api/v1/admin/jobs/schedules/:scheduleId`**
* **Description**: Updates a scheduled job.
* **Request**:
    * **URL Parameters**: `scheduleId` (string, UUID).
    * **Body**: A JSON object with an optional `cronExpression`, `payload`, or `isActive` status.
* **Success Response (200 OK)**:
    * The updated **JobSchedule** object.

**POST `/api/v1/admin/jobs/schedules/:scheduleId/trigger`**
* **Description**: Manually triggers a scheduled job to run immediately.
* **Request**:
    * **URL Parameters**: `scheduleId` (string, UUID).
* **Success Response (200 OK)**:
    * A JSON object with a success `message` and the `jobId` of the newly created job instance.

**GET `/api/v1/admin/jobs/system/queue-stats`**
* **Description**: Retrieves statistics about the job queue (e.g., pending, running, failed counts).
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A **QueueStats** object with detailed counts and rates.

**GET `/api/v1/admin/jobs/system/job-types`**
* **Description**: Gets a list of all job types registered in the system.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * An object containing a `jobTypes` array, where each item has a `type`, `handlerClass`, `description`, etc.

**GET `/api/v1/admin/jobs/system/status`**
* **Description**: Gets the current operational status of the job processor and scheduler.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * An object with `processor` and `scheduler` status details.

**POST `/api/v1/admin/jobs/system/cleanup`**
* **Description**: Manually triggers the cleanup process for old, completed jobs.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * An object with `deletedCompleted` and `deletedFailed` counts.

**POST `/api/v1/admin/jobs/system/emit-stats`**
* **Description**: Triggers a real-time broadcast of the latest queue statistics via WebSockets.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A JSON object with a success `message`.

### **Notifications & Preferences**
Endpoints for managing user notifications and their delivery preferences. The base URL is `/api/v1/notifications`.

---
**GET `/api/v1/notifications/`**
* **Description**: Retrieves a paginated list of notifications for the authenticated user.
* **Request**:
    * **Query Parameters**: `page`, `limit`, and an optional `isRead` (boolean) filter.
* **Success Response (200 OK)**:
    * A paginated response object containing an array of **Notification** objects and an `unreadCount`.

**PATCH `/api/v1/notifications/:notificationId/read`**
* **Description**: Marks a specific notification as read.
* **Request**:
    * **URL Parameters**: `notificationId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Notification** object.

**POST `/api/v1/notifications/mark-all-as-read`**
* **Description**: Marks all unread notifications for the user as read.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of notifications that were updated.

**POST `/api/v1/notifications/broadcast`**
* **Description**: Sends a notification to all users or a targeted subset (admin only).
* **Request**:
    * **Body**: A JSON object with `message`, `type`, `severity`, and an optional `target` object to filter by `roleIds`.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of users notified.

**GET `/api/v1/notifications/preferences`**
* **Description**: Retrieves the notification preferences for the authenticated user.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A **UserNotificationPreferences** object detailing in-app/email settings and digest frequency.

**PUT `/api/v1/notifications/preferences`**
* **Description**: Updates the notification preferences for the authenticated user.
* **Request**:
    * **Body**: A JSON object with an optional `preferences` object and/or an `emailDigestFrequency` (enum).
* **Success Response (200 OK)**:
    * The updated **UserNotificationPreferences** object.

### **Search**
The global search endpoint. The base URL is `/api/v1`.

---
**GET `/api/v1/search`**
* **Description**: Performs a global search across all accessible entities.
* **Request**:
    * **Query Parameters**: `q` (string, search term, min 2 chars), `limit` (number, default 5), and an optional `type` filter (e.g., 'project', 'task').
* **Success Response (200 OK)**:
    * A **SearchResults** object containing arrays of `projects`, `tasks`, `publications`, and `users` that match the query.

### **Status**
The application health check endpoint. The base URL is `/api/v1`.

---
**GET `/api/v1/status`**
* **Description**: Returns the current operational status of the application and its core dependencies.
* **Request**:
    * None.
* **Success Response (200 OK)**:
    * A **StatusResponse** object containing an overall `status`, `timestamp`, `version` info, `metrics` (uptime, memory), and a `dependencies` object showing the health of services like the database and background jobs.

### **Workflows**
Admin-only endpoints for creating, managing, and monitoring automated workflows. The base URL is `/api/v1/admin/workflows`.

---
**POST `/api/v1/admin/workflows/`**
* **Description**: Creates a new workflow.
* **Request**:
    * **Body**: A JSON object with `name`, `triggerType` or `cronExpression`, an `actions` array, and optional `description` and `enabled` status.
* **Success Response (201 Created)**:
    * A **Workflow** object with its details and a nested array of its configured **WorkflowAction** objects.

**GET `/api/v1/admin/workflows/`**
* **Description**: Lists all defined workflows.
* **Request**:
    * **Query Parameters**: Includes pagination and filtering by `enabled`, `triggerType`, or `search`.
* **Success Response (200 OK)**:
    * A paginated list of **Workflow** objects.

**GET `/api/v1/admin/workflows/:workflowId`**
* **Description**: Retrieves a single workflow by its ID.
* **Request**:
    * **URL Parameters**: `workflowId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Workflow** object.

**PUT `/api/v1/admin/workflows/:workflowId`**
* **Description**: Updates an existing workflow.
* **Request**:
    * **URL Parameters**: `workflowId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Workflow** object.

**DELETE `/api/v1/admin/workflows/:workflowId`**
* **Description**: Deletes a workflow.
* **Request**:
    * **URL Parameters**: `workflowId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/admin/workflows/:workflowId/toggle`**
* **Description**: Enables or disables a workflow.
* **Request**:
    * **URL Parameters**: `workflowId` (string, UUID).
    * **Body**: A JSON object: `{ "enabled": boolean }`.
* **Success Response (200 OK)**:
    * The updated **Workflow** object.

**GET `/api/v1/admin/workflows/:workflowId/runs`**
* **Description**: Lists the execution history (runs) for a specific workflow.
* **Request**:
    * **URL Parameters**: `workflowId` (string, UUID).
    * **Query Parameters**: `page`, `limit`, and an optional `status` filter.
* **Success Response (200 OK)**:
    * A paginated list of **WorkflowRun** objects.

**GET `/api/v1/admin/workflows/workflow-runs/:runId`**
* **Description**: Retrieves the details of a specific workflow run, including its logs.
* **Request**:
    * **URL Parameters**: `runId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **WorkflowRun** object, which includes `id`, `status`, `context` (the data that triggered the run), `logs`, and timestamps.

### **Authentication**
These endpoints handle user login, session management (refresh tokens), and password recovery. The base URL is `/api/v1/auth`.

---
**POST `/api/v1/auth/login`**
* **Description**: Authenticates a user and provides an access token.
* **Request**:
    * **Body**: A JSON object containing `email` (string) and `password` (string).
* **Success Response (200 OK)**:
    * A JSON object: `{ "accessToken": "..." }`.
    * An HTTPOnly cookie named `refreshToken` is also set in the response headers.

**POST `/api/v1/auth/refresh-token`**
* **Description**: Issues a new access token using a valid refresh token.
* **Request**:
    * **Cookies**: Requires the `refreshToken` HTTPOnly cookie sent from a previous login.
* **Success Response (200 OK)**:
    * A JSON object: `{ "accessToken": "..." }`.
    * A new, rotated `refreshToken` is set as an HTTPOnly cookie, invalidating the old one.

**POST `/api/v1/auth/logout`**
* **Description**: Logs out the user by revoking their refresh token.
* **Request**:
    * **Cookies**: Uses the `refreshToken` cookie to identify the session to revoke.
* **Success Response (204 No Content)**:
    * No response body. The `refreshToken` cookie is cleared.

**POST `/api/v1/auth/forgot-password`**
* **Description**: Initiates the password reset process for a user.
* **Request**:
    * **Body**: A JSON object with `email` (string).
* **Success Response (200 OK)**:
    * A JSON object with a confirmation message: `{ "message": "If an account with that email address exists, a password reset link has been sent." }`.

**GET `/api/v1/auth/reset-password/:token`**
* **Description**: Verifies if a password reset token is valid.
* **Request**:
    * **URL Parameters**: `token` (string).
* **Success Response (200 OK)**:
    * A JSON object with a success message: `{ "message": "Password reset token is valid." }`.

**POST `/api/v1/auth/reset-password`**
* **Description**: Completes the password reset process using a valid token and a new password.
* **Request**:
    * **Body**: A JSON object with `token` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200 OK)**:
    * A JSON object with a confirmation message.

**POST `/api/v1/auth/setup-password`**
* **Description**: Allows a newly invited user to set their password for the first time using an invitation token.
* **Request**:
    * **Body**: A JSON object with `token` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200 OK)**:
    * A JSON object with a confirmation message.

### **Permissions (Admin)**
Admin-level endpoints for managing system-wide permissions. The base URL is `/api/v1/admin/permissions`.

---
**POST `/api/v1/admin/permissions/`**
* **Description**: Creates a new permission.
* **Request**:
    * **Body**: A JSON object with `action` (string), `subject` (string), and optional `description`, `conditions` (JSON), and `fields` (array of strings).
* **Success Response (201 Created)**:
    * A **Permission** object with its `id`, details, and timestamps.

**GET `/api/v1/admin/permissions/`**
* **Description**: Lists all permissions in the system.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **Permission** objects.

**DELETE `/api/v1/admin/permissions/`**
* **Description**: Deletes multiple permissions in a single request.
* **Request**:
    * **Body**: A JSON object with an `ids` array of permission UUIDs.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of permissions deleted.

**GET `/api/v1/admin/permissions/:permissionId`**
* **Description**: Retrieves a single permission by its ID.
* **Request**:
    * **URL Parameters**: `permissionId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Permission** object.

**PUT `/api/v1/admin/permissions/:permissionId`**
* **Description**: Updates an existing permission.
* **Request**:
    * **URL Parameters**: `permissionId` (string, UUID).
    * **Body**: A JSON object with any of the optional fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Permission** object.

**DELETE `/api/v1/admin/permissions/:permissionId`**
* **Description**: Deletes a single permission.
* **Request**:
    * **URL Parameters**: `permissionId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Roles (Admin)**
Admin-level endpoints for managing user roles. The base URL is `/api/v1/admin/roles`.

---
**POST `/api/v1/admin/roles/`**
* **Description**: Creates a new role.
* **Request**:
    * **Body**: A JSON object with `name` (string) and an optional `description`.
* **Success Response (201 Created)**:
    * A **Role** object.

**GET `/api/v1/admin/roles/`**
* **Description**: Lists all roles.
* **Request**:
    * **Query Parameters**: Includes pagination.
* **Success Response (200 OK)**:
    * A paginated list of **Role** objects, each including its array of assigned **Permissions**.

**GET `/api/v1/admin/roles/:roleId`**
* **Description**: Retrieves a single role and its assigned permissions.
* **Request**:
    * **URL Parameters**: `roleId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Role** object with a populated `permissions` array.

**PUT `/api/v1/admin/roles/:roleId`**
* **Description**: Updates a role's details.
* **Request**:
    * **URL Parameters**: `roleId` (string, UUID).
    * **Body**: A JSON object with an optional `name` and/or `description`.
* **Success Response (200 OK)**:
    * The updated **Role** object.

**DELETE `/api/v1/admin/roles/:roleId`**
* **Description**: Deletes a role.
* **Request**:
    * **URL Parameters**: `roleId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/admin/roles/:roleId/permissions`**
* **Description**: Assigns a permission to a role.
* **Request**:
    * **URL Parameters**: `roleId` (string, UUID).
    * **Body**: A JSON object with `permissionId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Role** object with its complete list of permissions.

**DELETE `/api/v1/admin/roles/:roleId/permissions/:permissionId`**
* **Description**: Revokes a permission from a role.
* **Request**:
    * **URL Parameters**: `roleId` (string, UUID) and `permissionId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Role** object.

### **User Management (Admin)**
Admin-level endpoints for managing users. The base URL is `/api/v1/admin/users`.

---
**POST `/api/v1/admin/users/`**
* **Description**: Creates a new user and sends an invitation to set up their password.
* **Request**:
    * **Body**: A JSON object with a nested `person` object (`firstName`, `lastName`, `email`) and an array of `roles` (by name).
* **Success Response (201 Created)**:
    * A JSON object with a success `message` and the newly created, passwordless **User** object.

**GET `/api/v1/admin/users/`**
* **Description**: Lists all users in the system.
* **Request**:
    * **Query Parameters**: Includes pagination, sorting, and filtering by `search`, `isActive`, and `roleName`.
* **Success Response (200 OK)**:
    * A paginated list of **User** objects (with passwords omitted).

**DELETE `/api/v1/admin/users/`**
* **Description**: Deactivates (soft deletes) multiple users.
* **Request**:
    * **Body**: A JSON object with an `ids` array of user UUIDs.
* **Success Response (200 OK)**:
    * A JSON object with a `count` of the number of users deactivated.

**GET `/api/v1/admin/users/:userId`**
* **Description**: Retrieves a single user's profile by their ID.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **User** object (with password omitted).

**PUT `/api/v1/admin/users/:userId`**
* **Description**: Updates a user's profile information.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
    * **Body**: A JSON object with optional fields like `firstName`, `lastName`, `email`, `biography`, etc.
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

**DELETE `/api/v1/admin/users/:userId`**
* **Description**: Deactivates (soft deletes) a single user.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**PATCH `/api/v1/admin/users/:userId/status`**
* **Description**: Activates or deactivates a user account.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
    * **Body**: A JSON object `{ "isActive": boolean }`.
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

**POST `/api/v1/admin/users/:userId/roles`**
* **Description**: Assigns a role to a user.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
    * **Body**: A JSON object `{ "roleId": "..." }`.
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

**DELETE `/api/v1/admin/users/:userId/roles/:roleId`**
* **Description**: Removes a role from a user.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID) and `roleId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

**DELETE `/api/v1/admin/users/:userId/hard`**
* **Description**: Permanently deletes a user and all their associated data from the system.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**PATCH `/api/v1/admin/users/:userId/avatar`**
* **Description**: Uploads or changes an avatar for a specific user.
* **Request**:
    * **URL Parameters**: `userId` (string, UUID).
    * **Body**: `multipart/form-data` containing the image file.
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

### **Profile & Security**
Endpoints for the authenticated user to manage their own profile and security settings.

---
**GET `/api/v1/users/me`**
* **Description**: Retrieves the complete profile for the currently authenticated user.
* **Request**:
    * None (uses authentication token).
* **Success Response (200 OK)**:
    * The authenticated user's complete **User** object (with password omitted).

**PUT `/api/v1/users/me/profile`**
* **Description**: Allows the authenticated user to update their own profile information.
* **Request**:
    * **Body**: A JSON object with any of the user's editable profile fields (e.g., `firstName`, `biography`, `socialLinks`).
* **Success Response (200 OK)**:
    * The updated **User** object (with password omitted).

**PATCH `/api/v1/users/me/avatar`**
* **Description**: Uploads a new profile picture for the authenticated user.
* **Request**:
    * **Body**: `multipart/form-data` containing the image file.
* **Success Response (200 OK)**:
    * The updated **User** object with the new `avatarUrl`.

**POST `/api/v1/users/me/change-password`**
* **Description**: Allows the authenticated user to change their own password.
* **Request**:
    * **Body**: A JSON object with `currentPassword` (string) and `newPassword` (string, min 8 characters).
* **Success Response (200 OK)**:
    * A JSON object with a success message: `{ "message": "Password changed successfully." }`.

### **Teams**
Endpoints for managing teams of users within a workspace. The base URL is `/api/v1/workspaces/:workspaceId/teams`.

---
**POST `/api/v1/workspaces/:workspaceId/teams/`**
* **Description**: Creates a new team within a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Body**: A JSON object with `name` (string) and optional `description` and `memberIds` (array of UUIDs).
* **Success Response (201 Created)**:
    * A **Team** object with its details and list of members.

**GET `/api/v1/workspaces/:workspaceId/teams/`**
* **Description**: Lists all teams within a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Query Parameters**: Includes pagination, sorting, and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **Team** objects.

**GET `/api/v1/workspaces/:workspaceId/teams/:teamId`**
* **Description**: Retrieves a single team by its ID.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID) and `teamId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Team** object with its list of members.

**PUT `/api/v1/workspaces/:workspaceId/teams/:teamId`**
* **Description**: Updates a team's details.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID) and `teamId` (string, UUID).
    * **Body**: A JSON object with an optional `name`, `description`, or `memberIds`.
* **Success Response (200 OK)**:
    * The updated **Team** object.

**DELETE `/api/v1/workspaces/:workspaceId/teams/:teamId`**
* **Description**: Deletes a team.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID) and `teamId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/workspaces/:workspaceId/teams/:teamId/members/:userId`**
* **Description**: Adds a user to a team.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID), `teamId` (string, UUID), and `userId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Team** object with the new member included.

**DELETE `/api/v1/workspaces/:workspaceId/teams/:teamId/members/:userId`**
* **Description**: Removes a user from a team.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID), `teamId` (string, UUID), and `userId` (string, UUID).
* **Success Response (200 OK)**:
    * The updated **Team** object.

### **Publications**
These endpoints manage publications and their categories. The base URL is `/api/v1/publications`.

---
**POST `/api/v1/publications/`**
* **Description**: Creates a new publication.
* **Request**:
    * **Body**: A JSON object with `title` (string), `slug` (string), `status` (enum: 'DRAFT', 'PUBLISHED', 'ARCHIVED'), `authorIds` (array of UUIDs), and optional `excerpt` (string) and `categoryIds` (array of UUIDs).
* **Success Response (201 Created)**:
    * A **Publication** object, which includes `id`, `title`, `slug`, `status`, `excerpt`, and populated arrays for `authors` and `categories`.

**GET `/api/v1/publications/`**
* **Description**: Lists all publications.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), a `search` term, and filters for `status` and `categoryId`.
* **Success Response (200 OK)**:
    * A paginated list of **Publication** objects.

**GET `/api/v1/publications/:publicationId`**
* **Description**: Retrieves a single publication by its ID.
* **Request**:
    * **URL Parameters**: `publicationId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Publication** object.

**PUT `/api/v1/publications/:publicationId`**
* **Description**: Updates an existing publication.
* **Request**:
    * **URL Parameters**: `publicationId` (string, UUID).
    * **Body**: A JSON object with any of the fields from the create request.
* **Success Response (200 OK)**:
    * The updated **Publication** object.

**DELETE `/api/v1/publications/:publicationId`**
* **Description**: Deletes a publication.
* **Request**:
    * **URL Parameters**: `publicationId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/publications/categories`**
* **Description**: Creates a new publication category.
* **Request**:
    * **Body**: A JSON object with `name` (string, min 2 characters).
* **Success Response (201 Created)**:
    * A **PublicationCategory** object with `id` and `name`.

**GET `/api/v1/publications/categories`**
* **Description**: Lists all publication categories.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`).
* **Success Response (200 OK)**:
    * A paginated list of **PublicationCategory** objects.

**GET `/api/v1/publications/categories/:categoryId`**
* **Description**: Retrieves a single publication category by its ID.
* **Request**:
    * **URL Parameters**: `categoryId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **PublicationCategory** object.

**PUT `/api/v1/publications/categories/:categoryId`**
* **Description**: Updates an existing publication category.
* **Request**:
    * **URL Parameters**: `categoryId` (string, UUID).
    * **Body**: A JSON object with an optional `name`.
* **Success Response (200 OK)**:
    * The updated **PublicationCategory** object.

**DELETE `/api/v1/publications/categories/:categoryId`**
* **Description**: Deletes a publication category.
* **Request**:
    * **URL Parameters**: `categoryId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

### **Workspaces**
These endpoints manage workspaces, which act as top-level containers for projects, teams, and other resources. The base URL is `/api/v1/workspaces`.

---
**POST `/api/v1/workspaces/`**
* **Description**: Creates a new workspace. The creating user is automatically set as the owner and a member.
* **Request**:
    * **Body**: A JSON object with `name` (string, min 2 characters) and an optional `description`.
* **Success Response (201 Created)**:
    * A **Workspace** object containing its `id`, `name`, `description`, `logoUrl`, `ownerId`, timestamps, and optional arrays for attached `knowledgeBases`, `whiteboards`, and `publications`.

**GET `/api/v1/workspaces/`**
* **Description**: Lists all workspaces the currently authenticated user is a member of.
* **Request**:
    * **Query Parameters**: Includes pagination (`page`, `limit`), sorting (`sortBy`, `sortOrder`), and a `search` term.
* **Success Response (200 OK)**:
    * A paginated list of **Workspace** objects.

**GET `/api/v1/workspaces/:workspaceId`**
* **Description**: Retrieves a single workspace by its ID.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
* **Success Response (200 OK)**:
    * A single **Workspace** object.

**PUT `/api/v1/workspaces/:workspaceId`**
* **Description**: Updates a workspace's details.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Body**: A JSON object with an optional `name` and/or `description`.
* **Success Response (200 OK)**:
    * The updated **Workspace** object.

**DELETE `/api/v1/workspaces/:workspaceId`**
* **Description**: Deletes a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
* **Success Response (204 No Content)**:
    * No response body.

**POST `/api/v1/workspaces/:workspaceId/{knowledge-bases|whiteboards|publications}`**
* **Description**: Attaches a knowledge base, whiteboard, or publication to a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID). The final path segment must be `knowledge-bases`, `whiteboards`, or `publications`.
    * **Body**: A JSON object: `{ "entityId": "..." }`.
* **Success Response (200 OK)**:
    * The updated **Workspace** object.

**DELETE `/api/v1/workspaces/:workspaceId/{knowledge-bases|whiteboards|publications}/:entityId`**
* **Description**: Detaches a knowledge base, whiteboard, or publication from a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID) and `entityId` (string, UUID). The middle path segment must be `knowledge-bases`, `whiteboards`, or `publications`.
* **Success Response (200 OK)**:
    * The updated **Workspace** object.

**POST `/api/v1/workspaces/:workspaceId/dashboards`**
* **Description**: Creates a new dashboard within a workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Body**: A JSON object with a `name` (string) and an optional `description`.
* **Success Response (201 Created)**:
    * The newly created **Dashboard** object.

**GET `/api/v1/workspaces/:workspaceId/dashboards`**
* **Description**: Lists all dashboards for a specific workspace.
* **Request**:
    * **URL Parameters**: `workspaceId` (string, UUID).
    * **Query Parameters**: Includes pagination (`page`, `limit`) and sorting (`sortBy`, `sortOrder`).
* **Success Response (200 OK)**:
    * A paginated list of **Dashboard** objects.