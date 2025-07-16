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
import { CreateProjectRoleForm } from "./CreateProjectRoleForm";

interface Props {
  workspaceId: string;
  projectId: string;
}

export function CreateProjectRoleDialog({ workspaceId, projectId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project Role</DialogTitle>
          <DialogDescription>
            This role will only be available within this project.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectRoleForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
