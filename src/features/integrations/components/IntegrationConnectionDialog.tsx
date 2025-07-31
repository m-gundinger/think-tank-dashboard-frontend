import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IntegrationProvider } from "@/types/api";
import { useConnectIntegration } from "../api/useConnectIntegration";
import { useApiResource } from "@/hooks/useApiResource";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/form/FormFields";
import { Form } from "@/components/ui/form";

interface IntegrationConnectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  provider: IntegrationProvider | null;
  workspaceId: string; // Assuming a single workspace context for now
}

const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key is required."),
});
type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

export function IntegrationConnectionDialog({
  isOpen,
  onOpenChange,
  provider,
  workspaceId,
}: IntegrationConnectionDialogProps) {
  const connectMutation = useConnectIntegration();
  const integrationResource = useApiResource("integrations/configurations", [
    "integrations",
  ]);
  const createMutation = integrationResource.useCreate();

  const methods = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeySchema),
  });

  const handleOAuthConnect = () => {
    if (!provider || !workspaceId) return;
    connectMutation.mutate({ provider, workspaceId });
    onOpenChange(false);
  };

  const handleApiKeySubmit = (values: ApiKeyFormValues) => {
    if (!provider || !workspaceId) return;
    createMutation.mutate(
      {
        provider,
        workspaceId,
        category: "API_KEY",
        encryptedCredentials: values.apiKey, // This should be encrypted on the backend
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  const isOAuth =
    provider &&
    [
      "GOOGLE",
      "LINKEDIN",
      "FACEBOOK",
      "TWITTER",
      "INSTAGRAM",
      "CANVA",
      "GOOGLE_CALENDAR",
      "GOOGLE_DOCS",
      "GOOGLE_SHEETS",
      "GOOGLE_SLIDES",
      "GOOGLE_MEET",
      "GOOGLE_CHAT",
      "GOOGLE_YOUTUBE",
    ].includes(provider);
  const isApiKey = provider && ["BREVO", "OPEN_ROUTER"].includes(provider);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {provider}</DialogTitle>
          <DialogDescription>
            Follow the steps to connect your account.
          </DialogDescription>
        </DialogHeader>
        {isOAuth && (
          <Button onClick={handleOAuthConnect}>Connect with {provider}</Button>
        )}
        {isApiKey && (
          <FormProvider {...methods}>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(handleApiKeySubmit)}
                className="space-y-4"
              >
                <FormInput
                  name="apiKey"
                  label="API Key"
                  placeholder={`Enter your ${provider} API Key`}
                  type="password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Connecting..." : "Connect"}
                </Button>
              </form>
            </Form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
