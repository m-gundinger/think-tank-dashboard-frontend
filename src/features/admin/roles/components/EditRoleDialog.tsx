import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetRole } from "../api/useGetRoles";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateRole } from "../api/useUpdateRole";
import { useEffect, useState } from "react";
import { useGetPermissions } from "../../permissions/api/useGetPermissions";
import { useAssignPermissionToRole } from "../api/useAssignPermissionToRole";
import { useRevokePermissionFromRole } from "../api/useRevokePermissionFromRole";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters."),
  description: z.string().optional(),
});
type RoleFormValues = z.infer<typeof roleSchema>;

function EditRoleForm({
  role,
  onSuccess,
}: {
  role: any;
  onSuccess: () => void;
}) {
  const updateMutation = useUpdateRole(role.id);
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    form.reset({ name: role.name, description: role.description });
  }, [role, form]);

  async function onSubmit(values: RoleFormValues) {
    updateMutation.mutate(values, { onSuccess });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateMutation.isPending}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

function ManageRolePermissions({ role }: { role: any }) {
  const { data: permissionsData, isLoading } = useGetPermissions({
    limit: 100,
  });
  const assignMutation = useAssignPermissionToRole(role.id);
  const revokeMutation = useRevokePermissionFromRole(role.id);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const rolePermissionIds = new Set(role.permissions.map((p: any) => p.id));

  const availablePermissions =
    permissionsData?.data.filter(
      (permission: any) => !rolePermissionIds.has(permission.id)
    ) || [];

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Permissions</h4>
      <div className="flex min-h-[60px] flex-wrap items-center gap-1 rounded-md border p-2">
        {role.permissions.length > 0 ? (
          role.permissions.map((permission: any) => (
            <Badge key={permission.id} variant="secondary">
              {permission.action} on {permission.subject}
              <Button
                size="icon"
                variant="ghost"
                className="ml-1 h-4 w-4"
                onClick={() => revokeMutation.mutate(permission.id)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground px-2 text-sm">
            No permissions assigned.
          </p>
        )}
      </div>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add a permission..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search permissions..." />
            <CommandList>
              <CommandEmpty>No permissions found.</CommandEmpty>
              <CommandGroup>
                {availablePermissions.map((permission: any) => (
                  <CommandItem
                    key={permission.id}
                    value={`${permission.action} ${permission.subject}`}
                    onSelect={() => {
                      assignMutation.mutate(permission.id);
                      setPopoverOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                    {permission.action} on {permission.subject}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface EditRoleDialogProps {
  roleId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditRoleDialog({
  roleId,
  isOpen,
  onOpenChange,
}: EditRoleDialogProps) {
  const { data: roleData, isLoading } = useGetRole(roleId!);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role details and manage assigned permissions.
          </DialogDescription>
        </DialogHeader>
        {isLoading || !roleData ? (
          <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
            <EditRoleForm
              role={roleData}
              onSuccess={() => onOpenChange(false)}
            />
            <ManageRolePermissions role={roleData} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
