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
import { WorkflowForm } from "./WorkflowForm";

export function CreateWorkflowDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Configure a trigger and a series of actions to automate your
            processes.
          </DialogDescription>
        </DialogHeader>
        <WorkflowForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
