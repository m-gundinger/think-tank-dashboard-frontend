import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateEpicForm } from "./CreateEpicForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface CreateEpicDialogProps {
  workspaceId: string;
  projectId: string;
}

export function CreateEpicDialog({
  workspaceId,
  projectId,
}: CreateEpicDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Epic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Epic</DialogTitle>
          <DialogDescription>
            Epics are large bodies of work that can be broken down into a number
            of smaller tasks.
          </DialogDescription>
        </DialogHeader>
        <CreateEpicForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
