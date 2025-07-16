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
import { CreatePublicationForm } from "./CreatePublicationForm";

export function CreatePublicationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Publication
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Publication</DialogTitle>
          <DialogDescription>
            Add a new article, paper, or report to the knowledge base.
          </DialogDescription>
        </DialogHeader>
        <CreatePublicationForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
