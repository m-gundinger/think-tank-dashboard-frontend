import { useState } from "react";
import { PersonList } from "@/features/crm/components/PersonList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { PersonForm } from "@/features/crm/components/PersonForm";
import { PersonDetailPanel } from "@/features/crm/components/PersonDetailPanel";

export function CrmPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Manage all people in your organization.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Person
            </Button>
          }
          title="Create New Person"
          description="Add a new person to the CRM. This won't create a system user account."
          form={PersonForm}
          resourcePath="people"
          resourceKey={["people"]}
        />
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
