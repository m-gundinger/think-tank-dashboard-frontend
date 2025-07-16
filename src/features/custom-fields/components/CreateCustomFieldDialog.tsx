import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { CustomFieldDefinitionForm } from "./CustomFieldDefinitionForm";

interface Props {
  workspaceId: string;
  projectId: string;
}

export function CreateCustomFieldDialog({ workspaceId, projectId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Custom Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Custom Field</DialogTitle>
          <DialogDescription>
            This field will be available for all tasks in this project.
          </DialogDescription>
        </DialogHeader>
        <CustomFieldDefinitionForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
