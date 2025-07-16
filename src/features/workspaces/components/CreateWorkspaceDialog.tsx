import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function CreateWorkspaceDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Workspaces help you organize your projects and teams.
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspaceForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
