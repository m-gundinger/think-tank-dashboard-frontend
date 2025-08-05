import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// Get Channels
async function getWorkspaceChannels(workspaceId: string): Promise<any[]> {
  const { data } = await api.get(`workspaces/${workspaceId}/channels`);
  return data;
}

export function useGetWorkspaceChannels(workspaceId: string) {
  return useQuery({
    queryKey: ["channels", "workspace", workspaceId],
    queryFn: () => getWorkspaceChannels(workspaceId),
    enabled: !!workspaceId,
  });
}

async function getProjectChannels(projectId: string): Promise<any[]> {
  const { data } = await api.get(`projects/${projectId}/channels`);
  return data;
}

export function useGetProjectChannels(projectId: string) {
  return useQuery({
    queryKey: ["channels", "project", projectId],
    queryFn: () => getProjectChannels(projectId),
    enabled: !!projectId,
  });
}

// Get Messages (Paginated)
async function getMessages({
  channelId,
  pageParam = 1,
}: {
  channelId: string;
  pageParam?: number;
}): Promise<any> {
  const { data } = await api.get(`chats/${channelId}/messages`, {
    params: { page: pageParam, limit: 50 },
  });
  return data;
}

export function useGetMessages(channelId: string | null) {
  return useInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: ({ pageParam }) =>
      getMessages({ channelId: channelId!, pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!channelId,
  });
}

// Create Channel
interface CreateChannelParams {
  context: { workspaceId?: string; projectId?: string };
  channelData: { name: string; isPrivate?: boolean; memberIds?: string[] };
}

async function createChannel({
  context,
  channelData,
}: CreateChannelParams): Promise<any> {
  const url = context.workspaceId
    ? `workspaces/${context.workspaceId}/channels`
    : `projects/${context.projectId}/channels`;
  const { data } = await api.post(url, channelData);
  return data;
}

export function useCreateChannel(
  context: { workspaceId?: string; projectId?: string } = {}
) {
  const queryKey = context.workspaceId
    ? ["channels", "workspace", context.workspaceId]
    : ["channels", "project", context.projectId];

  return useApiMutation({
    mutationFn: (channelData: any) => createChannel({ context, channelData }),
    successMessage: "Channel created successfully.",
    invalidateQueries: [queryKey],
  });
}

// Send Message
async function sendMessage(channelId: string, content: string): Promise<any> {
  const { data } = await api.post(`chats/${channelId}/messages`, { content });
  return data;
}

export function useSendMessage(channelId: string) {
  return useApiMutation({
    mutationFn: (content: string) => sendMessage(channelId, content),
    invalidateQueries: [["messages", channelId]],
  });
}

// Manage Members
interface MemberParams {
  channelId: string;
  userId: string;
  role?: string;
}

async function addMember({
  channelId,
  userId,
  role,
}: MemberParams): Promise<any> {
  const { data } = await api.post(`chats/${channelId}/members`, {
    userId,
    role,
  });
  return data;
}

async function removeMember({ channelId, userId }: MemberParams): Promise<any> {
  const { data } = await api.delete(`chats/${channelId}/members/${userId}`);
  return data;
}

export function useManageChannelMembers(channelId: string) {
  const invalidateQueries = [["channels"]]; // This is broad, might need refinement

  const useAddMember = () =>
    useApiMutation<any, Omit<MemberParams, "channelId">>({
      mutationFn: (params) => addMember({ channelId, ...params }),
      successMessage: "Member added to channel.",
      invalidateQueries,
    });

  const useRemoveMember = () =>
    useApiMutation<any, string>({
      mutationFn: (userId) => removeMember({ channelId, userId }),
      successMessage: "Member removed from channel.",
      invalidateQueries,
    });

  return { useAddMember, useRemoveMember };
}
