import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreateWidgetForm } from "./CreateWidgetForm";

interface CreateWidgetDialogProps {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
}

export function CreateWidgetDialog({
  workspaceId,
  projectId,
  dashboardId,
}: CreateWidgetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a New Widget</DialogTitle>
          <DialogDescription>
            Select a widget type and configure it to visualize your data.
          </DialogDescription>
        </DialogHeader>
        <CreateWidgetForm
          workspaceId={workspaceId}
          projectId={projectId}
          dashboardId={dashboardId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
