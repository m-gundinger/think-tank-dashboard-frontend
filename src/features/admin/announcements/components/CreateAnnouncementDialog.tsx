import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function CreateAnnouncementDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
          <DialogDescription>
            Broadcast information to all users or specific roles.
          </DialogDescription>
        </DialogHeader>
        <AnnouncementForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
