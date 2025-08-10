import {
  useForm,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { QueryKey } from "@tanstack/react-query";

type FormData<Schema extends z.ZodType<any, any>> = z.infer<Schema>;

interface ResourceFormProps<Schema extends z.ZodType<any, any>> {
  schema: Schema;
  resourcePath: string;
  resourceKey: QueryKey;
  initialData?: FormData<Schema>;
  onSuccess?: (data: any) => void;
  renderFields: (form: UseFormReturn<FormData<Schema>>) => React.ReactNode;
  processValues?: (values: FormData<Schema>) => any;
  className?: string;
}

export function ResourceForm<Schema extends z.ZodType<any, any>>({
  schema,
  resourcePath,
  resourceKey,
  initialData,
  onSuccess,
  renderFields,
  processValues,
  className,
}: ResourceFormProps<Schema>) {
  const resource = useApiResource(resourcePath, resourceKey);
  const isEditMode = !!initialData;
  const createMutation = resource.useCreate();
  const updateMutation = resource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  type FormValues = FormData<Schema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData,
  });

  useEffect(() => {
    if (isEditMode) {
      methods.reset(initialData);
    }
  }, [initialData, isEditMode, methods]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const finalValues = processValues ? processValues(values) : values;

    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: (initialData as any).id, data: finalValues },
        {
          onSuccess: (data) => {
            onSuccess?.(data);
          },
        }
      );
    } else {
      await createMutation.mutateAsync(finalValues, {
        onSuccess: (data) => {
          methods.reset();
          onSuccess?.(data);
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={className || "space-y-4"}
        >
          {renderFields(methods)}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : `Create ${
                    resourceKey[0]
                      ?.toString()
                      .replace(/s$/, "")
                      .replace(/^\w/, (c) => c.toUpperCase()) || "Item"
                  }`}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
