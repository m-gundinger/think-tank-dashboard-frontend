import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomFieldDefinitionForm } from "./CustomFieldDefinitionForm";
import { useGetCustomFieldDefinition } from "../api/useGetCustomFieldDefinitions";
import { Skeleton } from "@/components/ui/skeleton";

interface EditDialogProps {
  fieldId: string | null;
  workspaceId: string;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditCustomFieldDialog({
  fieldId,
  workspaceId,
  projectId,
  isOpen,
  onOpenChange,
}: EditDialogProps) {
  const { data: fieldData, isLoading } = useGetCustomFieldDefinition(
    workspaceId,
    projectId,
    fieldId
  );

  if (!fieldId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Custom Field</DialogTitle>
          <DialogDescription>
            Change the name or options for this custom field. The type cannot be
            changed after creation.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : (
          fieldData && (
            <CustomFieldDefinitionForm
              workspaceId={workspaceId}
              projectId={projectId}
              initialData={fieldData}
              onSuccess={() => onOpenChange(false)}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
