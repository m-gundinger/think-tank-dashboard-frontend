### **Analytics**

#### **Activities**
- `GET /api/v1/activities/`
- `GET /api/v1/projects/:projectId/activities/`
- `GET /api/v1/workspaces/:workspaceId/activities/`

#### **Dashboards**
- `DELETE /api/v1/dashboards/:dashboardId`
- `GET /api/v1/dashboards/:dashboardId`
- `PUT /api/v1/dashboards/:dashboardId`

#### **Reports**
- `DELETE /api/v1/reports/:reportId`
- `GET /api/v1/reports/`
- `GET /api/v1/reports/:reportId`
- `POST /api/v1/reports/`
- `PUT /api/v1/reports/:reportId`

#### **Widgets**
- `DELETE /api/v1/dashboards/:dashboardId/widgets/:widgetId`
- `GET /api/v1/dashboards/:dashboardId/widgets/`
- `GET /api/v1/dashboards/:dashboardId/widgets/:widgetId`
- `GET /api/v1/dashboards/:dashboardId/widgets/:widgetId/data`
- `POST /api/v1/dashboards/:dashboardId/widgets/`
- `PUT /api/v1/dashboards/:dashboardId/widgets/:widgetId`

---
### **Collaboration**

#### **Comments**
- `DELETE /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId/knowledge-bases/:entityId`
- `DELETE /api/v1/comments/:commentId/publications/:entityId`
- `DELETE /api/v1/comments/:commentId/whiteboards/:entityId`
- `GET /api/v1/comments/`
- `POST /api/v1/comments/`
- `POST /api/v1/comments/:commentId/knowledge-bases`
- `POST /api/v1/comments/:commentId/publications`
- `POST /api/v1/comments/:commentId/whiteboards`
- `PUT /api/v1/comments/:commentId`

#### **Knowledge Bases**
- `DELETE /api/v1/knowledge-bases/:knowledgeBaseId`
- `DELETE /api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`
- `GET /api/v1/knowledge-bases/`
- `GET /api/v1/knowledge-bases/:knowledgeBaseId`
- `GET /api/v1/knowledge-bases/:knowledgeBaseId/pages/`
- `GET /api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`
- `POST /api/v1/knowledge-bases/`
- `POST /api/v1/knowledge-bases/:knowledgeBaseId/pages/`
- `PUT /api/v1/knowledge-bases/:knowledgeBaseId`
- `PUT /api/v1/knowledge-bases/:knowledgeBaseId/pages/:pageId`

#### **Whiteboards**
- `DELETE /api/v1/whiteboards/:whiteboardId`
- `GET /api/v1/whiteboards/`
- `GET /api/v1/whiteboards/:whiteboardId`
- `POST /api/v1/whiteboards/`
- `PUT /api/v1/whiteboards/:whiteboardId`

---
### **CRM (Customer Relationship Management)**

#### **Deals**
- `DELETE /api/v1/deals/:dealId`
- `GET /api/v1/deals/`
- `GET /api/v1/deals/:dealId`
- `POST /api/v1/deals/`
- `PUT /api/v1/deals/:dealId`

#### **Deal Stages**
- `DELETE /api/v1/deal-stages/:stageId`
- `GET /api/v1/deal-stages/`
- `GET /api/v1/deal-stages/:stageId`
- `POST /api/v1/deal-stages/`
- `PUT /api/v1/deal-stages/:stageId`

#### **Interactions**
- `DELETE /api/v1/interactions/:interactionId`
- `GET /api/v1/interactions/`
- `GET /api/v1/interactions/:interactionId`
- `POST /api/v1/interactions/`
- `PUT /api/v1/interactions/:interactionId`

#### **Organizations**
- `DELETE /api/v1/organizations/:organizationId`
- `DELETE /api/v1/organizations/:organizationId/publications/:entityId`
- `GET /api/v1/organizations/`
- `GET /api/v1/organizations/:organizationId`
- `PATCH /api/v1/organizations/:organizationId/people/:personId`
- `POST /api/v1/organizations/`
- `POST /api/v1/organizations/:organizationId/people/`
- `POST /api/v1/organizations/:organizationId/publications`
- `PUT /api/v1/organizations/:organizationId`

#### **People (Persons)**
- `DELETE /api/v1/people/`
- `DELETE /api/v1/people/:personId`
- `DELETE /api/v1/people/:personId/publications/:entityId`
- `GET /api/v1/people/`
- `GET /api/v1/people/:personId`
- `POST /api/v1/people/`
- `POST /api/v1/people/:personId/publications`
- `PUT /api/v1/people/:personId`

#### **Skills**
- `GET /api/v1/skills/`

---
### **Integrations**

- `GET /api/v1/integrations/`
- `GET /api/v1/integrations/connect/google`
- `GET /api/v1/integrations/connect/google/callback`
- `GET /api/v1/integrations/:integrationId`
- `POST /api/v1/integrations/`
- `PUT /api/v1/integrations/:integrationId`

---
### **Project Management**

#### **Custom Field Definitions**
- `DELETE /api/v1/projects/:projectId/custom-fields/:customFieldId`
- `GET /api/v1/projects/:projectId/custom-fields/`
- `GET /api/v1/projects/:projectId/custom-fields/:customFieldId`
- `POST /api/v1/projects/:projectId/custom-fields/`
- `PUT /api/v1/projects/:projectId/custom-fields/:customFieldId`

#### **Goals**
- `DELETE /api/v1/goals/:goalId`
- `GET /api/v1/goals/`
- `GET /api/v1/goals/:goalId`
- `POST /api/v1/goals/`
- `PUT /api/v1/goals/:goalId`

#### **Lead Forms**
- `DELETE /api/v1/lead-form/:leadFormId`
- `GET /api/v1/lead-form/`
- `GET /api/v1/lead-form/:leadFormId`
- `POST /api/v1/lead-form/`
- `PUT /api/v1/lead-form/:leadFormId`

#### **Project Members**
- `DELETE /api/v1/projects/:projectId/members/:userId`
- `GET /api/v1/projects/:projectId/members/`
- `PATCH /api/v1/projects/:projectId/members/:userId`
- `POST /api/v1/projects/:projectId/members/`
- `POST /api/v1/projects/:projectId/members/team`

#### **Project Roles**
- `DELETE /api/v1/projects/:projectId/roles/:roleId`
- `GET /api/v1/projects/:projectId/roles/`
- `GET /api/v1/projects/:projectId/roles/:roleId`
- `POST /api/v1/projects/:projectId/roles/`
- `PUT /api/v1/projects/:projectId/roles/:roleId`

#### **Project Templates**
- `DELETE /api/v1/project-templates/:templateId`
- `GET /api/v1/project-templates/`
- `GET /api/v1/project-templates/:templateId`
- `POST /api/v1/project-templates/`
- `POST /api/v1/project-templates/:templateId/create-project`
- `PUT /api/v1/project-templates/:templateId`

#### **Projects**
- `DELETE /api/v1/projects/:projectId`
- `DELETE /api/v1/projects/:projectId/knowledge-bases/:entityId`
- `DELETE /api/v1/projects/:projectId/publications/:entityId`
- `DELETE /api/v1/projects/:projectId/whiteboards/:entityId`
- `GET /api/v1/projects/:projectId`
- `POST /api/v1/projects/:projectId/knowledge-bases`
- `POST /api/v1/projects/:projectId/publications`
- `POST /api/v1/projects/:projectId/whiteboards`
- `PUT /api/v1/projects/:projectId`

#### **Standalone Tasks**
- `DELETE /api/v1/standalone-tasks/`
- `DELETE /api/v1/standalone-tasks/:taskId`
- `DELETE /api/v1/standalone-tasks/:taskId/assignees/:userId`
- `DELETE /api/v1/standalone-tasks/:taskId/comments/:commentId`
- `DELETE /api/v1/standalone-tasks/:taskId/documents/:documentId/:type`
- `GET /api/v1/standalone-tasks/my-tasks`
- `GET /api/v1/standalone-tasks/:taskId`
- `GET /api/v1/standalone-tasks/:taskId/comments/`
- `GET /api/v1/standalone-tasks/:taskId/timelogs/`
- `GET /api/v1/standalone-tasks/:taskId/timelogs/:timeLogId`
- `PATCH /api/v1/standalone-tasks/:taskId/custom-fields`
- `POST /api/v1/standalone-tasks/`
- `POST /api/v1/standalone-tasks/:taskId/assignees`
- `POST /api/v1/standalone-tasks/:taskId/comments/`
- `POST /api/v1/standalone-tasks/:taskId/documents`
- `POST /api/v1/standalone-tasks/:taskId/timelogs/`
- `PUT /api/v1/standalone-tasks/:taskId`
- `PUT /api/v1/standalone-tasks/:taskId/comments/:commentId`
- `PUT /api/v1/standalone-tasks/:taskId/timelogs/:timeLogId`

#### **Task Templates**
- `DELETE /api/v1/task-templates/:templateId`
- `GET /api/v1/task-templates/`
- `GET /api/v1/task-templates/:templateId`
- `POST /api/v1/projects/:projectId/task-templates/`
- `POST /api/v1/task-templates/:templateId/instantiate`

#### **Task Types**
- `DELETE /api/v1/projects/:projectId/task-types/:taskTypeId`
- `GET /api/v1/projects/:projectId/task-types/`
- `GET /api/v1/projects/:projectId/task-types/:taskTypeId`
- `POST /api/v1/projects/:projectId/task-types/`
- `PUT /api/v1/projects/:projectId/task-types/:taskTypeId`

#### **Tasks (within Projects)**
- `DELETE /api/v1/projects/:projectId/tasks/:taskId`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/assignees/:userId`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/documents/:documentId/:type`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/knowledge-bases/:entityId`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/links/:linkId`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/publications/:entityId`
- `DELETE /api/v1/projects/:projectId/tasks/:taskId/whiteboards/:entityId`
- `GET /api/v1/projects/:projectId/tasks/`
- `GET /api/v1/projects/:projectId/tasks/:taskId`
- `GET /api/v1/projects/:projectId/tasks/:taskId/subtasks`
- `PATCH /api/v1/projects/:projectId/tasks/:taskId/custom-fields`
- `PATCH /api/v1/projects/:projectId/tasks/:taskId/links/:linkId`
- `PATCH /api/v1/projects/:projectId/tasks/:taskId/move`
- `POST /api/v1/projects/:projectId/tasks/`
- `POST /api/v1/projects/:projectId/tasks/:taskId/assignees`
- `POST /api/v1/projects/:projectId/tasks/:taskId/documents`
- `POST /api/v1/projects/:projectId/tasks/:taskId/knowledge-bases`
- `POST /api/v1/projects/:projectId/tasks/:taskId/links`
- `POST /api/v1/projects/:projectId/tasks/:taskId/publications`
- `POST /api/v1/projects/:projectId/tasks/:taskId/whiteboards`
- `PUT /api/v1/projects/:projectId/tasks/:taskId`

#### **Views**
- `DELETE /api/v1/views/:viewId`
- `GET /api/v1/views/`
- `GET /api/v1/views/:viewId`
- `GET /api/v1/views/:viewId/data`
- `POST /api/v1/views/`
- `PUT /api/v1/views/:viewId`

---
### **Publications**

#### **Publication Categories**
- `DELETE /api/v1/publications/categories/:categoryId`
- `GET /api/v1/publications/categories/`
- `GET /api/v1/publications/categories/:categoryId`
- `POST /api/v1/publications/categories/`
- `PUT /api/v1/publications/categories/:categoryId`

#### **Publications**
- `DELETE /api/v1/publications/:publicationId`
- `GET /api/v1/publications/`
- `GET /api/v1/publications/:publicationId`
- `POST /api/v1/publications/`
- `PUT /api/v1/publications/:publicationId`

---
### **System**

#### **Announcements**
- `DELETE /api/v1/announcements/`
- `DELETE /api/v1/announcements/:id`
- `GET /api/v1/announcements/`
- `GET /api/v1/announcements/active`
- `GET /api/v1/announcements/:id`
- `POST /api/v1/announcements/`
- `PUT /api/v1/announcements/:id`

#### **Development & Status**
- `GET /api/v1/search`
- `GET /api/v1/status`
- `GET /data`
- `GET /error/generic`
- `GET /error/specific`
- `GET /error/validation-sim`

#### **Jobs & Scheduling (Admin)**
- `DELETE /api/v1/admin/jobs/:jobId`
- `DELETE /api/v1/admin/jobs/schedules/:scheduleId`
- `GET /api/v1/admin/jobs/`
- `GET /api/v1/admin/jobs/schedules/`
- `GET /api/v1/admin/jobs/schedules/:scheduleId`
- `GET /api/v1/admin/jobs/system/job-types`
- `GET /api/v1/admin/jobs/system/queue-stats`
- `GET /api/v1/admin/jobs/system/status`
- `GET /api/v1/admin/jobs/:jobId`
- `POST /api/v1/admin/jobs/`
- `POST /api/v1/admin/jobs/schedules/`
- `POST /api/v1/admin/jobs/schedules/:scheduleId/trigger`
- `POST /api/v1/admin/jobs/system/cleanup`
- `POST /api/v1/admin/jobs/system/emit-stats`
- `POST /api/v1/admin/jobs/:jobId/cancel`
- `POST /api/v1/admin/jobs/:jobId/retry`
- `PUT /api/v1/admin/jobs/schedules/:scheduleId`

#### **Notifications**
- `GET /api/v1/notifications/`
- `GET /api/v1/notifications/preferences`
- `PATCH /api/v1/notifications/:notificationId/read`
- `POST /api/v1/notifications/broadcast`
- `POST /api/v1/notifications/mark-all-as-read`
- `PUT /api/v1/notifications/preferences`

#### **Workflows (Admin)**
- `DELETE /api/v1/admin/workflows/:workflowId`
- `GET /api/v1/admin/workflows/`
- `GET /api/v1/admin/workflows/workflow-runs/:runId`
- `GET /api/v1/admin/workflows/:workflowId`
- `GET /api/v1/admin/workflows/:workflowId/runs`
- `POST /api/v1/admin/workflows/`
- `POST /api/v1/admin/workflows/:workflowId/toggle`
- `PUT /api/v1/admin/workflows/:workflowId`

---
### **User Management**

#### **Authentication**
- `GET /api/v1/auth/reset-password/:token`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/setup-password`

#### **Permissions (Admin)**
- `DELETE /api/v1/admin/permissions/`
- `DELETE /api/v1/admin/permissions/:permissionId`
- `GET /api/v1/admin/permissions/`
- `GET /api/v1/admin/permissions/:permissionId`
- `POST /api/v1/admin/permissions/`
- `PUT /api/v1/admin/permissions/:permissionId`

#### **Roles (Admin)**
- `DELETE /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId/permissions/:permissionId`
- `GET /api/v1/admin/roles/`
- `GET /api/v1/admin/roles/:roleId`
- `POST /api/v1/admin/roles/`
- `POST /api/v1/admin/roles/:roleId/permissions`
- `PUT /api/v1/admin/roles/:roleId`

#### **Users (Admin)**
- `DELETE /api/v1/admin/users/`
- `DELETE /api/v1/admin/users/:userId`
- `DELETE /api/v1/admin/users/:userId/hard`
- `DELETE /api/v1/admin/users/:userId/roles/:roleId`
- `GET /api/v1/admin/users/`
- `GET /api/v1/admin/users/:userId`
- `PATCH /api/v1/admin/users/:userId/avatar`
- `PATCH /api/v1/admin/users/:userId/status`
- `POST /api/v1/admin/users/`
- `POST /api/v1/admin/users/:userId/roles`
- `PUT /api/v1/admin/users/:userId`

#### **User Profile & Security**
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me/avatar`
- `POST /api/v1/users/me/change-password`
- `PUT /api/v1/users/me/profile`

---
### **Webhooks**

- `POST /api/v1/webhooks/in/:secret`

---
### **Workspaces**

#### **Teams**
- `DELETE /api/v1/workspaces/:workspaceId/teams/:teamId`
- `DELETE /api/v1/workspaces/:workspaceId/teams/:teamId/members/:userId`
- `GET /api/v1/workspaces/:workspaceId/teams/`
- `GET /api/v1/workspaces/:workspaceId/teams/:teamId`
- `POST /api/v1/workspaces/:workspaceId/teams/`
- `POST /api/v1/workspaces/:workspaceId/teams/:teamId/members/:userId`
- `PUT /api/v1/workspaces/:workspaceId/teams/:teamId`

#### **Workspaces**
- `DELETE /api/v1/workspaces/:workspaceId`
- `DELETE /api/v1/workspaces/:workspaceId/knowledge-bases/:entityId`
- `DELETE /api/v1/workspaces/:workspaceId/publications/:entityId`
- `DELETE /api/v1/workspaces/:workspaceId/whiteboards/:entityId`
- `GET /api/v1/workspaces/`
- `GET /api/v1/workspaces/:workspaceId`
- `GET /api/v1/workspaces/:workspaceId/dashboards`
- `GET /api/v1/workspaces/:workspaceId/projects`
- `GET /api/v1/workspaces/:workspaceId/reporting/workload`
- `POST /api/v1/workspaces/`
- `POST /api/v1/workspaces/:workspaceId/dashboards`
- `POST /api/v1/workspaces/:workspaceId/knowledge-bases`
- `POST /api/v1/workspaces/:workspaceId/projects`
- `POST /api/v1/workspaces/:workspaceId/publications`
- `POST /api/v1/workspaces/:workspaceId/whiteboards`
- `PUT /api/v1/workspaces/:workspaceId`