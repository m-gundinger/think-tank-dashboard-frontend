import { useState } from "react";
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
import { useGetProjectRoles } from "@/features/project-roles/api/useGetProjectRoles";
import { useAddProjectMember } from "../api/useAddProjectMember";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InviteProjectMemberProps {
  workspaceId: string;
  projectId: string;
  existingMemberIds: string[];
}

export function InviteProjectMember({
  workspaceId,
  projectId,
  existingMemberIds,
}: InviteProjectMemberProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
    search: userSearch,
  });
  const { data: rolesData, isLoading: isLoadingRoles } = useGetProjectRoles(
    workspaceId,
    projectId
  );
  const addMemberMutation = useAddProjectMember(workspaceId, projectId);

  const availableUsers =
    usersData?.data.filter((u: any) => !existingMemberIds.includes(u.id)) || [];

  const handleInvite = () => {
    if (selectedUserId && selectedRoleId) {
      addMemberMutation.mutate(
        { userId: selectedUserId, roleId: selectedRoleId },
        {
          onSuccess: () => {
            setSelectedUserId(null);
            setUserSearch("");
          },
        }
      );
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invite New Member</CardTitle>
        <CardDescription>
          Add a new member to this project and assign them a role.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end gap-2">
        <div className="flex-grow">
          <Label>User</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedUserId
                  ? usersData?.data.find((u: any) => u.id === selectedUserId)
                      ?.name
                  : "Select a user"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Search by name or email..."
                  onValueChange={setUserSearch}
                />
                <CommandList>
                  {isLoadingUsers && <CommandItem>Loading...</CommandItem>}
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {availableUsers.map((user: any) => (
                      <CommandItem
                        value={user.name}
                        key={user.id}
                        onSelect={() => setSelectedUserId(user.id)}
                      >
                        {user.name} ({user.email})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-[200px]">
          <Label>Role</Label>
          <Select onValueChange={setSelectedRoleId} disabled={isLoadingRoles}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolesData?.data.map((role: any) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleInvite}
          disabled={
            !selectedUserId || !selectedRoleId || addMemberMutation.isPending
          }
        >
          {addMemberMutation.isPending ? "Inviting..." : "Invite"}
        </Button>
      </CardContent>
    </Card>
  );
}
