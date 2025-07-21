import {
  useMutation,
  useQueryClient,
  QueryKey,
  MutationFunction,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface UseApiMutationOptions<TData, TVariables, TContext>
  extends Omit<
    UseMutationOptions<TData, AxiosError, TVariables, TContext>,
    "mutationFn"
  > {
  mutationFn: MutationFunction<TData, TVariables>;
  successMessage?: string | ((data: TData, variables: TVariables) => string);
  errorMessage?: string;
  invalidateQueries?:
    | QueryKey[]
    | ((data: TData, variables: TVariables) => QueryKey[]);
}

export function useApiMutation<
  TData = any,
  TVariables = any,
  TContext = unknown,
>({
  mutationFn,
  successMessage,
  errorMessage,
  invalidateQueries = [],
  onSuccess,
  onError,
  ...options
}: UseApiMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        const message =
          typeof successMessage === "function"
            ? successMessage(data, variables)
            : successMessage;
        toast.success(message);
      }

      const keysToInvalidate =
        typeof invalidateQueries === "function"
          ? invalidateQueries(data, variables)
          : invalidateQueries;

      if (keysToInvalidate.length) {
        keysToInvalidate.forEach((key) => {
          if (key.length > 0) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error: any, variables, context) => {
      const defaultMessage = "An unexpected error occurred.";
      const message =
        errorMessage || error.response?.data?.message || defaultMessage;

      toast.error("Operation Failed", {
        description: message,
      });
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options,
  });
}
