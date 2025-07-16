import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserForm } from "./CreateUserForm";
import { useState } from "react";
import { UserPlus } from "lucide-react";

export function CreateUserDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user account. An invitation
            email will be sent for them to set their password.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
