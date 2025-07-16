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
import { CreateJobScheduleForm } from "./CreateJobScheduleForm";

export function CreateJobScheduleDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Job Schedule</DialogTitle>
          <DialogDescription>
            Define a recurring job that will run automatically.
          </DialogDescription>
        </DialogHeader>
        <CreateJobScheduleForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
