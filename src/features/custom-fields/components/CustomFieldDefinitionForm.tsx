import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldType } from "@/types";
import { useCreateCustomFieldDefinition } from "../api/useCreateCustomFieldDefinition";
import { useUpdateCustomFieldDefinition } from "../api/useUpdateCustomFieldDefinition";
import { useEffect } from "react";

interface FormProps {
  workspaceId: string;
  projectId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function CustomFieldDefinitionForm({
  workspaceId,
  projectId,
  initialData,
  onSuccess,
}: FormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreateCustomFieldDefinition(workspaceId, projectId);
  const updateMutation = useUpdateCustomFieldDefinition(workspaceId, projectId);

  const mutation = isEditMode ? updateMutation : createMutation;
  const form = useForm<any>({
    defaultValues: {
      name: "",
      type: CustomFieldType.TEXT,
      options: { values: [] },
    },
  });
  const selectedType = form.watch("type");

  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        ...initialData,
        options: {
          values: initialData.options?.values || [],
        },
      });
    }
  }, [initialData, isEditMode, form]);

  const onSubmit = (values: any) => {
    const basePayload: { name: string; type: string; options?: any } = {
      name: values.name,
      type: values.type,
    };

    if (values.type === "SELECT") {
      basePayload.options = {
        values:
          typeof values.options.values === "string"
            ? values.options.values
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : values.options.values,
      };
    }

    if (isEditMode) {
      updateMutation.mutate(
        { customFieldId: initialData.id, data: basePayload },
        { onSuccess }
      );
    } else {
      createMutation.mutate(basePayload, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Story Points" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEditMode}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CustomFieldType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedType === "SELECT" && (
          <FormField
            control={form.control}
            name="options.values"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter comma-separated values, e.g., Low, Medium, High"
                    {...field}
                    value={
                      Array.isArray(field.value)
                        ? field.value.join(", ")
                        : field.value
                    }
                  />
                </FormControl>
                <FormDescription>
                  For 'Select' type fields, provide a comma-separated list of
                  options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Field"}
        </Button>
      </form>
    </Form>
  );
}
