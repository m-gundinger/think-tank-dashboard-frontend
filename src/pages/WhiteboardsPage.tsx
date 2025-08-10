import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { WhiteboardForm } from "@/features/collaboration/components/WhiteboardForm";
import { Button } from "@/components/ui/button";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { WhiteboardList } from "@/features/collaboration/components/WhiteboardList";

export function WhiteboardsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <ListPageLayout
      title="Whiteboards"
      description="All whiteboards you have access to across all your projects."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Whiteboard
            </Button>
          }
          title="Create a New Whiteboard"
          description="Whiteboards are collaborative canvases for your ideas."
          form={WhiteboardForm}
          resourcePath="whiteboards"
          resourceKey={["whiteboards"]}
        />
      }
    >
      <WhiteboardList />
    </ListPageLayout>
  );
}