// FILE: src/features/tasks/components/CreateTaskDialog.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "./CreateTaskForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface CreateTaskDialogProps {
  workspaceId?: string;
  projectId?: string;
  parentId?: string | null;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateTaskDialog({
  workspaceId,
  projectId,
  parentId,
  trigger,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: CreateTaskDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled =
    externalIsOpen !== undefined && externalOnOpenChange !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const onOpenChange = isControlled ? externalOnOpenChange : setInternalIsOpen;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const dialogContent = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {parentId ? "Create Sub-task" : "Create a new task"}
        </DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new task.
        </DialogDescription>
      </DialogHeader>
      <CreateTaskForm
        workspaceId={workspaceId}
        projectId={projectId}
        parentId={parentId}
        onSuccess={handleSuccess}
      />
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
