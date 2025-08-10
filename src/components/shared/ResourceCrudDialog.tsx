import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiResource } from "@/hooks/useApiResource";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { QueryKey } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const DialogFormContent = ({
  isEditMode,
  resourceId,
  resourcePath,
  resourceKey,
  formComponent: FormComponent,
  formProps,
  onSuccess,
  children,
}: {
  isEditMode: boolean;
  resourceId: string | null;
  resourcePath: string;
  resourceKey: QueryKey;
  formComponent: React.ElementType;
  formProps?: Record<string, any>;
  onSuccess: () => void;
  children?: (data: any) => React.ReactNode;
}) => {
  const resource = useApiResource(resourcePath, resourceKey);
  const { data, isLoading } = resource.useGetOne(
    isEditMode ? resourceId : null
  );

  if (isEditMode && isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isEditMode && !data) {
    return null;
  }

  const formContent = (
    <FormComponent
      initialData={isEditMode ? data : undefined}
      onSuccess={onSuccess}
      {...formProps}
    />
  );

  if (children && isEditMode && data) {
    return (
      <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-3">
        <div className="md:col-span-2">{formContent}</div>
        {children(data)}
      </div>
    );
  }

  return formContent;
};
interface ResourceCrudDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  form: React.ElementType;
  formProps?: Record<string, any>;
  resourcePath: string;
  resourceKey: QueryKey;
  resourceId?: string | null;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  children?: (data: any) => React.ReactNode;
  dialogClassName?: string;
}

export function ResourceCrudDialog({
  trigger,
  title,
  description,
  form: FormComponent,
  formProps,
  resourcePath,
  resourceKey,
  resourceId,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  children,
  dialogClassName,
}: ResourceCrudDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled =
    externalIsOpen !== undefined && externalOnOpenChange !== undefined;

  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const onOpenChange = isControlled ? externalOnOpenChange : setInternalIsOpen;

  const isEditMode = !!resourceId;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(dialogClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isOpen && (
          <DialogFormContent
            isEditMode={isEditMode}
            resourceId={resourceId ?? null}
            resourcePath={resourcePath}
            resourceKey={resourceKey}
            formComponent={FormComponent}
            formProps={formProps}
            onSuccess={handleSuccess}
            children={children}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
