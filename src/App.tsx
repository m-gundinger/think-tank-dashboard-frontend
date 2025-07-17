// FILE: src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedLayout } from "./routes/ProtectedLayout";
import { WorkspaceLayout } from "./routes/WorkspaceLayout";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
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
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SetupPasswordPage } from "./pages/SetupPasswordPage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ProjectGeneralSettingsPage } from "./pages/ProjectGeneralSettingsPage";
import { JobMonitoringPage } from "./pages/admin/JobMonitoringPage";
import { SystemStatusPage } from "./pages/admin/SystemStatusPage";
import { CrmPage } from "./pages/CrmPage";
import { MyTasksPage } from "./pages/MyTasksPage"; // Import the new page

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
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-tasks" element={<MyTasksPage />} />{" "}
          {/* Add the new route */}
          <Route path="workspaces" element={<WorkspacesPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="crm" element={<CrmPage />} />
          <Route path="workspaces/:workspaceId" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<ProjectListPage />} />
            <Route path="teams" element={<TeamsPage />} />
          </Route>
          <Route
            path="workspaces/:workspaceId/projects/:projectId"
            element={
              <ErrorBoundary>
                <ProjectDetailPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId/settings"
            element={<ProjectSettingsPage />}
          >
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<ProjectGeneralSettingsPage />} />
            <Route path="access" element={<ProjectAccessControlPage />} />
            <Route path="custom-fields" element={<ProjectCustomFieldsPage />} />
          </Route>
          <Route
            path="workspaces/:workspaceId/projects/:projectId/:dashboardId"
            element={<DashboardDetailPage />}
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="integrations" replace />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="security" element={<AccountSettingsPage />} />
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
