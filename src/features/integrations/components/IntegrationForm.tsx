import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/form/FormFields";
import { useManageIntegrations } from "../api/useManageIntegrations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntegrationProvider } from "@/types/api";

const integrationSchema = z.object({
  provider: z.nativeEnum(IntegrationProvider),
  apiKey: z.string().min(1, "API Key is required."),
  workspaceId: z.string().uuid("A workspace must be selected."),
});

type IntegrationFormValues = z.infer<typeof integrationSchema>;

interface IntegrationFormProps {
  onSuccess?: () => void;
}

export function IntegrationForm({ onSuccess }: IntegrationFormProps) {
  const { useCreate } = useManageIntegrations();
  const createMutation = useCreate();

  const methods = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      provider: IntegrationProvider.OPEN_ROUTER,
      apiKey: "",
    },
  });

  async function onSubmit(values: IntegrationFormValues) {
    const payload = {
      ...values,
      category: "API_KEY",
    };
    await createMutation.mutateAsync(payload, { onSuccess });
  }

  const providerOptions = Object.values(IntegrationProvider)
    .filter(
      (p) =>
        p === IntegrationProvider.OPEN_ROUTER || p === IntegrationProvider.BREVO
    )
    .map((p) => ({
      value: p,
      label: p,
    }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            name="provider"
            label="Provider"
            placeholder="Select a provider"
            options={providerOptions}
          />
          <FormInput
            name="apiKey"
            label="API Key"
            type="password"
            placeholder="Enter your API key"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving..." : "Save Integration"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}