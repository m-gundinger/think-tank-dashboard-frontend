import { IntegrationList } from "@/features/integrations/components/IntegrationList";

export function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your account to third-party services to enhance your workflow.
        </p>
      </div>
      <IntegrationList />
    </div>
  );
}