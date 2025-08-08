import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedLayout } from "./routes/ProtectedLayout";
import { WorkspaceLayout } from "./routes/WorkspaceLayout";
import { LoginPage } from "./pages/Login";
import { WorkspacesPage } from "./pages/Workspaces";
import { ProjectListPage } from "./pages/ProjectListPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { AdminLayout } from "./routes/AdminLayout";
import { UserListPage } from "./pages/admin/UserListPage";
import { RoleListPage } from "./pages/admin/RoleListPage";
import { PermissionListPage } from "./pages/admin/PermissionListPage";
import { AnnouncementListPage } from "./pages/admin/AnnouncementListPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardDetailPage } from "./pages/DashboardDetailPage";
import { WorkflowListPage } from "./pages/admin/WorkflowListPage";
import { SettingsPage } from "./pages/SettingsPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { PublicationsPage } from "./pages/PublicationsPage";
import { TeamsPage } from "./pages/TeamsPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import { IntegrationCallbackPage } from "./pages/IntegrationCallbackPage";
import { ProjectSettingsPage } from "./pages/ProjectSettingsPage";
import { ProjectAccessControlPage } from "./pages/ProjectAccessControlPage";
import { ProjectCustomFieldsPage } from "./pages/ProjectCustomFieldsPage";
import { ProjectTaskTypesPage } from "./pages/ProjectTaskTypesPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SetupPasswordPage } from "./pages/SetupPasswordPage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ProjectGeneralSettingsPage } from "./pages/ProjectGeneralSettingsPage";
import { JobMonitoringPage } from "./pages/admin/JobMonitoringPage";
import { SystemStatusPage } from "./pages/admin/SystemStatusPage";
import { CrmPage } from "./pages/CrmPage";
import { TasksPage } from "./pages/tasks/TasksPage";
import { ProjectGoalsPage } from "./pages/ProjectGoalsPage";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { ProjectTemplatesPage } from "./pages/ProjectTemplatesPage";
import { KnowledgeBaseDetailPage } from "./pages/KnowledgeBaseDetailPage";
import { GlobalKnowledgeBasePage } from "./pages/GlobalKnowledgeBasePage";
import { WhiteboardsPage } from "./pages/WhiteboardsPage";
import { ProjectAttachmentsPage } from "./pages/ProjectAttachmentsPage";
import { WorkspaceAttachmentsPage } from "./pages/WorkspaceAttachmentsPage";
import { AnalyticsLayout } from "./pages/AnalyticsLayout";
import { ActivitiesPage } from "./pages/analytics/ActivitiesPage";
import { DashboardsPage } from "./pages/analytics/DashboardsPage";
import { ReportingPage } from "./pages/analytics/ReportingPage";
import { ReportsPage } from "./pages/analytics/ReportsPage";
import { TaskTypesSettingsPage } from "./pages/TaskTypesSettingsPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/setup-password" element={<SetupPasswordPage />} />

        <Route
          path="/integrations/callback"
          element={<IntegrationCallbackPage />}
        />

        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="my-tasks" element={<TasksPage scope="user" />} />
          <Route path="workspaces" element={<WorkspacesPage />} />
          <Route path="knowledge-bases" element={<GlobalKnowledgeBasePage />} />
          <Route path="whiteboards" element={<WhiteboardsPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="crm" element={<CrmPage />} />

          <Route path="analytics" element={<AnalyticsLayout />}>
            <Route index element={<Navigate to="activities" replace />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="dashboards" element={<DashboardsPage />} />
            <Route path="reporting" element={<ReportingPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          <Route path="workspaces/:workspaceId" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<ProjectListPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="attachments" element={<WorkspaceAttachmentsPage />} />
            <Route path="analytics" element={<AnalyticsLayout />}>
              <Route index element={<Navigate to="dashboards" replace />} />
              <Route path="dashboards" element={<DashboardsPage />} />
              <Route path="reporting" element={<ReportingPage />} />
              <Route path="activity" element={<ActivitiesPage />} />
            </Route>
          </Route>
          <Route
            path="workspaces/:workspaceId/knowledge-bases/:knowledgeBaseId"
            element={<KnowledgeBaseDetailPage />}
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId"
            element={
              <ErrorBoundary>
                <ProjectDetailPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="workspaces/:workspaceId/dashboards/:dashboardId"
            element={<DashboardDetailPage />}
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId/settings"
            element={<ProjectSettingsPage />}
          >
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<ProjectGeneralSettingsPage />} />
            <Route path="access" element={<ProjectAccessControlPage />} />
            <Route path="custom-fields" element={<ProjectCustomFieldsPage />} />
            <Route path="task-types" element={<ProjectTaskTypesPage />} />
            <Route path="goals" element={<ProjectGoalsPage />} />
            <Route path="templates" element={<ProjectTemplatesPage />} />
            <Route path="attachments" element={<ProjectAttachmentsPage />} />
          </Route>
          <Route
            path="workspaces/:workspaceId/projects/:projectId/dashboards/:dashboardId"
            element={<DashboardDetailPage />}
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="integrations" replace />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="security" element={<AccountSettingsPage />} />
            <Route path="task-types" element={<TaskTypesSettingsPage />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="roles" element={<RoleListPage />} />
            <Route path="permissions" element={<PermissionListPage />} />
            <Route path="workflows" element={<WorkflowListPage />} />
            <Route path="announcements" element={<AnnouncementListPage />} />
            <Route path="jobs" element={<JobMonitoringPage />} />
            <Route path="system" element={<SystemStatusPage />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;