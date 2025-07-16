import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePersonForm } from "./CreatePersonForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function CreatePersonDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Person
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Person</DialogTitle>
          <DialogDescription>
            Add a new person to the CRM. This won't create a system user
            account.
          </DialogDescription>
        </DialogHeader>
        <CreatePersonForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
