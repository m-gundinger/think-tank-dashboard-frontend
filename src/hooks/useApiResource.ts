import api from "@/lib/api";
import { useQuery, QueryKey } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const fetchResourceList = async <T>(
  resourceUrl: string,
  query?: any
): Promise<PaginatedResponse<T>> => {
  const { data } = await api.get<PaginatedResponse<T>>(resourceUrl, {
    params: query,
  });
  return data;
};

const fetchResource = async <T>(
  resourceUrl: string,
  id: string
): Promise<T> => {
  const { data } = await api.get<T>(`${resourceUrl}/${id}`);
  return data;
};

const createResource = async <T>(
  resourceUrl: string,
  resourceData: any
): Promise<T> => {
  const { data } = await api.post<T>(`${resourceUrl}`, resourceData);
  return data;
};

const updateResource = async <T>({
  resourceUrl,
  id,
  data: resourceData,
}: {
  resourceUrl: string;
  id: string;
  data: any;
}): Promise<T> => {
  const { data } = await api.put<T>(`${resourceUrl}/${id}`, resourceData);
  return data;
};

const deleteResource = async (
  resourceUrl: string,
  ids: string | string[]
): Promise<void> => {
  if (Array.isArray(ids) && ids.length > 0) {
    await api.delete(`${resourceUrl}`, { data: { ids } });
  } else if (typeof ids === "string") {
    await api.delete(`${resourceUrl}/${ids}`);
  }
};

type Scope =
  | "workspaces"
  | "projects"
  | "tasks"
  | "teams"
  | "users"
  | "roles"
  | "permissions"
  | "announcements"
  | "dashboards"
  | "goals"
  | "task-types";

interface UrlAndKeyOptions {
  scope: Scope;
  workspaceId?: string | null;
  projectId?: string | null;
}

function constructUrlAndKey({
  scope,
  workspaceId,
  projectId,
}: UrlAndKeyOptions): { resourceUrl: string; resourceKey: QueryKey } {
  let resourceUrl = "";
  let resourceKey: (string | undefined | null)[] = [scope];

  if (workspaceId) {
    resourceUrl = `workspaces/${workspaceId}`;
    resourceKey.push(workspaceId);
    if (projectId) {
      resourceUrl += `/projects/${projectId}`;
      resourceKey.push(projectId);
    }
  }

  resourceUrl = resourceUrl ? `${resourceUrl}/${scope}` : scope;

  if (!workspaceId && ["users", "roles", "permissions"].includes(scope)) {
    resourceUrl = `admin/${scope}`;
  }

  return { resourceUrl, resourceKey: resourceKey.filter(Boolean) as QueryKey };
}

export function useApiResource<TData = any, TQuery = object>(
  resourceUrl: string,
  resourceKey: QueryKey
) {
  const resourceName =
    String(resourceKey[0]).charAt(0).toUpperCase() +
    String(resourceKey[0]).slice(1);

  const useGetAll = (query?: TQuery & { enabled?: boolean }) => {
    const { enabled = true, ...queryParams } = query || {};
    return useQuery<PaginatedResponse<TData>>({
      queryKey: [...resourceKey, queryParams],
      queryFn: () => fetchResourceList<TData>(resourceUrl, queryParams),
      enabled,
    });
  };

  const useGetOne = (id: string | null) => {
    return useQuery<TData>({
      queryKey: [...resourceKey, id],
      queryFn: () => fetchResource<TData>(resourceUrl, id!),
      enabled: !!id,
    });
  };

  const useCreate = () => {
    return useApiMutation<TData, any>({
      mutationFn: (newData: any) => createResource<TData>(resourceUrl, newData),
      successMessage: `${resourceName} created successfully.`,
      invalidateQueries: [resourceKey],
    });
  };

  const useUpdate = () => {
    return useApiMutation<TData, { id: string; data: any }>({
      mutationFn: (variables) =>
        updateResource<TData>({ resourceUrl, ...variables }),
      successMessage: `${resourceName} updated successfully.`,
      invalidateQueries: (data: any) => [
        resourceKey,
        [...resourceKey.slice(0, 1), data.id],
      ],
    });
  };

  const useDelete = () => {
    return useApiMutation<void, string | string[]>({
      mutationFn: (ids: string | string[]) => deleteResource(resourceUrl, ids),
      successMessage: (_data, variables) => {
        const count = Array.isArray(variables) ? variables.length : 1;
        return `${count} ${resourceName}(s) deleted successfully.`;
      },
      invalidateQueries: [resourceKey],
    });
  };

  return {
    useGetAll,
    useGetOne,
    useCreate,
    useUpdate,
    useDelete,
  };
}

useApiResource.constructUrlAndKey = constructUrlAndKey;