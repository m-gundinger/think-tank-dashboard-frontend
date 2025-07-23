
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useManageTaskTemplates } from "../api/useManageTaskTemplates";
import { useInstantiateTaskTemplate } from "../api/useInstantiateTaskTemplate";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplateSelectorDialogProps {
  workspaceId: string;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function TemplateSelectorDialog({
  workspaceId,
  projectId,
  isOpen,
  onOpenChange,
}: TemplateSelectorDialogProps) {
  const { data: templatesData, isLoading } = useManageTaskTemplates(
    workspaceId,
    projectId
  ).useGetAll();
  const instantiateMutation = useInstantiateTaskTemplate(
    workspaceId,
    projectId
  );

  const handleSelect = (templateId: string) => {
    instantiateMutation.mutate(templateId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task from Template</DialogTitle>
          <DialogDescription>
            Select a template to create a new task with pre-filled information.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search templates..." />
          <CommandList>
            {isLoading && (
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            <CommandEmpty>No templates found.</CommandEmpty>
            <CommandGroup>
              {templatesData?.data?.map((template: any) => (
                <CommandItem
                  key={template.id}
                  value={template.name}
                  onSelect={() => handleSelect(template.id)}
                  disabled={instantiateMutation.isPending}
                >
                  {template.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
