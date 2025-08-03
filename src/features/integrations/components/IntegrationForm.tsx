import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormSwitch,
  FormSelect,
} from "@/components/form/FormFields";
import { useManageIntegrations } from "../api/useManageIntegrations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { IntegrationCategory, IntegrationProvider } from "@/types/api";

const integrationSchema = z.object({
  friendlyName: z.string().min(2, "Friendly name is required."),
  provider: z.nativeEnum(IntegrationProvider),
  category: z.nativeEnum(IntegrationCategory),
  credentials: z.record(z.string(), z.string()).optional(),
  settings: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean(),
});
type FormValues = z.infer<typeof integrationSchema>;

interface IntegrationFormProps {
  workspaceId: string;
  initialData?: any;
  onSuccess?: () => void;
}

export function IntegrationForm({
  workspaceId,
  initialData,
  onSuccess,
}: IntegrationFormProps) {
  const isEditMode = !!initialData;
  const { useCreate, useUpdate } = useManageIntegrations(workspaceId);
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;

  const methods = useForm<FormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      friendlyName: "",
      provider: IntegrationProvider.BREVO,
      category: IntegrationCategory.API_KEY,
      credentials: {},
      settings: {},
      isActive: true,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  async function onSubmit(values: FormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(
        { ...values, workspaceId },
        {
          onSuccess: () => {
            methods.reset();
            onSuccess?.();
          },
        }
      );
    }
  }

  const providerOptions = Object.values(IntegrationProvider).map((p) => ({
    value: p,
    label: p,
  }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="friendlyName"
            label="Friendly Name"
            placeholder="e.g., Marketing Team Brevo Account"
          />
          <FormSelect
            name="provider"
            label="Provider"
            placeholder="Select a provider"
            options={providerOptions}
          />
          <FormInput
            name="credentials.apiKey"
            label="API Key"
            type="password"
            placeholder="Enter the API Key"
          />
          <FormSwitch
            name="isActive"
            label="Active"
            description="Enable or disable this integration."
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Integration"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
