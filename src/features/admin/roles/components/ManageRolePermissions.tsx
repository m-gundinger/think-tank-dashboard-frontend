import { useAssignPermissionToRole } from "../api/useAssignPermissionToRole";
import { useRevokePermissionFromRole } from "../api/useRevokePermissionFromRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { AnyValue } from "@/types";
import { useManagePermissions } from "../../permissions/api/useManagePermissions";

export function ManageRolePermissions({ role }: { role: AnyValue }) {
  const { data: permissionsData, isLoading } =
    useManagePermissions().useGetAll();
  const assignMutation = useAssignPermissionToRole(role.id);
  const revokeMutation = useRevokePermissionFromRole(role.id);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const rolePermissionIds = new Set(role.permissions.map((p: any) => p.id));
  const availablePermissions =
    permissionsData?.data?.filter(
      (permission: any) => !rolePermissionIds.has(permission.id)
    ) || [];

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Permissions</h4>
      <div className="flex min-h-[60px] flex-wrap items-center gap-1 rounded-md border p-2">
        {role.permissions.length > 0 ? (
          role.permissions.map((permission: any) => (
            <Badge key={permission.id} variant="secondary" className="pr-1">
              <span>
                {permission.action} on {permission.subject}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="ml-1 h-4 w-4"
                onClick={() => revokeMutation.mutate(permission.id)}
                disabled={revokeMutation.isPending}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="px-2 text-sm text-muted-foreground">
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