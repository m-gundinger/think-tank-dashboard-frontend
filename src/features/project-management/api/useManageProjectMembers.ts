import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface AddMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
  roleId: string;
  isGuest: boolean;
}
async function addMember(params: AddMemberParams) {
  const { workspaceId, projectId, userId, roleId, isGuest } = params;
  const { data } = await api.post(
    `workspaces/${workspaceId}/projects/${projectId}/members`,
    { userId, roleId, isGuest }
  );
  return data;
}

interface AddTeamParams {
  workspaceId: string;
  projectId: string;
  teamId: string;
  roleId: string;
  isGuest: boolean;
}
async function addTeam(params: AddTeamParams) {
  const { workspaceId, projectId, teamId, roleId, isGuest } = params;
  const { data } = await api.post(
    `workspaces/${workspaceId}/projects/${projectId}/members/team`,
    { teamId, roleId, isGuest }
  );
  return data;
}

interface UpdateMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
  roleId: string;
  isGuest?: boolean;
}
async function updateMember(params: UpdateMemberParams) {
  const { workspaceId, projectId, userId, roleId, isGuest } = params;
  const { data } = await api.patch(
    `workspaces/${workspaceId}/projects/${projectId}/members/${userId}`,
    { roleId, isGuest }
  );
  return data;
}

interface RemoveMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
}
async function removeMember(params: RemoveMemberParams) {
  const { workspaceId, projectId, userId } = params;
  await api.delete(
    `workspaces/${workspaceId}/projects/${projectId}/members/${userId}`
  );
}

export function useManageProjectMembers(
  workspaceId: string,
  projectId: string
) {
  const invalidateQueries = [["projectMembers", projectId]];

  const useAddMember = () =>
    useApiMutation({
      mutationFn: (data: Omit<AddMemberParams, "workspaceId" | "projectId">) =>
        addMember({ workspaceId, projectId, ...data }),
      successMessage: "Member added to project.",
      invalidateQueries,
    });

  const useAddTeam = () =>
    useApiMutation({
      mutationFn: (data: Omit<AddTeamParams, "workspaceId" | "projectId">) =>
        addTeam({ workspaceId, projectId, ...data }),
      successMessage: (data) => `${data.count} member(s) added to the project.`,
      invalidateQueries,
    });

  const useUpdateMember = () =>
    useApiMutation({
      mutationFn: (
        data: Omit<UpdateMemberParams, "workspaceId" | "projectId">
      ) => updateMember({ workspaceId, projectId, ...data }),
      successMessage: "Member updated successfully.",
      invalidateQueries,
    });

  const useRemoveMember = () =>
    useApiMutation({
      mutationFn: (userId: string) =>
        removeMember({ workspaceId, projectId, userId }),
      successMessage: "Member removed from project.",
      invalidateQueries,
    });

  return {
    useAddMember,
    useAddTeam,
    useUpdateMember,
    useRemoveMember,
  };
}