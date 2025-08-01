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
import { Megaphone } from "lucide-react";
import { BroadcastNotificationForm } from "./BroadcastNotificationForm";
export function BroadcastNotificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Megaphone className="mr-2 h-4 w-4" />
          Broadcast Notification
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Broadcast Notification</DialogTitle>
          <DialogDescription>
            This message will be sent as a real-time notification to all active
            users.
          </DialogDescription>
        </DialogHeader>
        <BroadcastNotificationForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}