import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateDashboardForm } from "./CreateDashboardForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface CreateDashboardDialogProps {
  workspaceId: string;
  projectId: string;
}

export function CreateDashboardDialog({
  workspaceId,
  projectId,
}: CreateDashboardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Dashboard</DialogTitle>
          <DialogDescription>
            Dashboards contain widgets to visualize your project data.
          </DialogDescription>
        </DialogHeader>
        <CreateDashboardForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
