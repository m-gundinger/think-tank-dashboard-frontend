import { useState } from "react";
import { PersonList } from "@/features/crm/components/PersonList";
import { CreatePersonDialog } from "@/features/crm/components/CreatePersonDialog";
import { PersonDetailPanel } from "@/features/crm/components/PersonDetailPanel";

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage all people in your organization.
          </p>
        </div>
        <CreatePersonDialog />
      </div>

      <PersonList onPersonSelect={setSelectedPersonId} />

      <PersonDetailPanel
        personId={selectedPersonId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPersonId(null);
        }}
      />
    </div>
  );
}
