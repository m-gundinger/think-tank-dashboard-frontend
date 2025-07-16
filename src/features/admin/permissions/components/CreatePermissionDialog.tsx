import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PermissionForm } from "./PermissionForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function CreatePermissionDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Permission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Permission</DialogTitle>
          <DialogDescription>
            Define a new action and subject pair for access control.
          </DialogDescription>
        </DialogHeader>
        <PermissionForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
