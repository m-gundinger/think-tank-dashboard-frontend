import { PublicationList } from "@/features/publications/components/PublicationList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { useState } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreatePublicationForm } from "@/features/publications/components/CreatePublicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicationCategoryManager } from "@/features/publications/components/PublicationCategoryManager";
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function PublicationsPage() {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: "create",
  });

  return (
    <ListPageLayout
      title="Publications"
      description="Manage your organization's articles, papers, and other publications."
      actionButton={
        <div className="flex items-center gap-2">
          <Dialog
            open={dialogState.open && dialogState.type === "manageCategories"}
            onOpenChange={(isOpen) =>
              setDialogState({ ...dialogState, open: isOpen })
            }
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() =>
                  setDialogState({ open: true, type: "manageCategories" })
                }
              >
                <Settings className="mr-2 h-4 w-4" /> Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publication Categories</DialogTitle>
                <DialogDescription>
                  Create, edit, and delete categories for organizing
                  publications.
                </DialogDescription>
              </DialogHeader>
              <PublicationCategoryManager />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => setDialogState({ open: true, type: "create" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Publication
          </Button>
        </div>
      }
    >
      <PublicationList />
      <ResourceCrudDialog
        isOpen={dialogState.open && dialogState.type === "create"}
        onOpenChange={(isOpen) =>
          setDialogState({ ...dialogState, open: isOpen })
        }
        title="Create Publication"
        description="Add a new article, paper, or report to the knowledge base."
        form={CreatePublicationForm}
        resourcePath="publications"
        resourceKey={["publications"]}
      />
    </ListPageLayout>
  );
}