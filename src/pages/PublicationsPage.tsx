import { PublicationList } from "@/features/publications/components/PublicationList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreatePublicationForm } from "@/features/publications/components/CreatePublicationForm";
export function PublicationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publications</h1>
          <p className="text-muted-foreground">
            Manage your organization's articles, papers, and other publications.
          </p>
        </div>
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Publication
            </Button>
          }
          title="Create Publication"
          description="Add a new article, paper, or report to the knowledge base."
          form={CreatePublicationForm}
          resourcePath="publications"
          resourceKey={["publications"]}
        />
      </div>
      <PublicationList />
    </div>
  );
}
