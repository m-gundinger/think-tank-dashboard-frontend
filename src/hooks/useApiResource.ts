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

export function useApiResource<TData = any, TQuery = object>(
  resourceUrl: string,
  resourceKey: QueryKey
) {
  const resourceName = String(resourceKey[0]);

  const useGetAll = (query?: TQuery) => {
    return useQuery<PaginatedResponse<TData>>({
      queryKey: [...resourceKey, query],
      queryFn: () => fetchResourceList<TData>(resourceUrl, query),
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
      invalidateQueries: [resourceKey],
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
