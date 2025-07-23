import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { FormLabel } from "@/components/ui/form";

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
  const [isGuest, setIsGuest] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const userResource = useApiResource("admin/users", ["users"]);
  const teamResource = useApiResource(`/workspaces/${workspaceId}/teams`, [
    "teams",
    workspaceId,
  ]);
  const projectRoleResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    ["projectRoles", projectId]
  );

  const { data: usersData, isLoading: isLoadingUsers } = userResource.useGetAll(
    {
      search: userSearch,
      limit: 1000,
    }
  );
  const { data: rolesData, isLoading: isLoadingRoles } =
    projectRoleResource.useGetAll();
  const { data: teamsData, isLoading: isLoadingTeams } =
    teamResource.useGetAll();

  const addMemberMutation = useApiMutation<
    any,
    { userId: string; roleId: string; isGuest: boolean }
  >({
    mutationFn: async ({ userId, roleId, isGuest }) => {
      const { data } = await api.post(
        `/workspaces/${workspaceId}/projects/${projectId}/members`,
        { userId, roleId, isGuest }
      );
      return data;
    },
    successMessage: "Member added to project.",
    invalidateQueries: [["projectMembers", projectId]],
  });

  const addTeamMutation = useApiMutation<
    any,
    { teamId: string; roleId: string; isGuest: boolean }
  >({
    mutationFn: async ({ teamId, roleId, isGuest }) => {
      const { data } = await api.post(
        `/workspaces/${workspaceId}/projects/${projectId}/members/team`,
        { teamId, roleId, isGuest }
      );
      return data;
    },
    successMessage: (data) => `${data.count} member(s) added to the project.`,
    invalidateQueries: [["projectMembers", projectId]],
  });

  const availableUsers =
    usersData?.data.filter((u: any) => !existingMemberIds.includes(u.id)) || [];

  const handleInviteUser = () => {
    if (selectedUserId && selectedRoleId) {
      addMemberMutation.mutate(
        { userId: selectedUserId, roleId: selectedRoleId, isGuest },
        {
          onSuccess: () => {
            setSelectedUserId(null);
            setUserSearch("");
          },
        }
      );
    }
  };

  const handleInviteTeam = () => {
    if (selectedTeamId && selectedRoleId) {
      addTeamMutation.mutate(
        { teamId: selectedTeamId, roleId: selectedRoleId, isGuest },
        {
          onSuccess: () => {
            setSelectedTeamId(null);
          },
        }
      );
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invite to Project</CardTitle>
        <CardDescription>
          Add individual users or entire teams to this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Invite User</TabsTrigger>
            <TabsTrigger value="team">Invite Team</TabsTrigger>
          </TabsList>
          <TabsContent value="user" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedUserId
                      ? usersData?.data.find(
                          (u: any) => u.id === selectedUserId
                        )?.name
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
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                onValueChange={setSelectedRoleId}
                disabled={isLoadingRoles}
              >
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
            <div className="flex items-center space-x-2">
              <Switch
                id="is-guest-user"
                checked={isGuest}
                onCheckedChange={setIsGuest}
              />
              <FormLabel htmlFor="is-guest-user">Add as guest</FormLabel>
            </div>
            <Button
              onClick={handleInviteUser}
              disabled={
                !selectedUserId ||
                !selectedRoleId ||
                addMemberMutation.isPending
              }
              className="w-full"
            >
              {addMemberMutation.isPending ? "Inviting..." : "Invite User"}
            </Button>
          </TabsContent>
          <TabsContent value="team" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Team</Label>
              <Select
                onValueChange={setSelectedTeamId}
                disabled={isLoadingTeams}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teamsData?.data.map((team: any) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                onValueChange={setSelectedRoleId}
                disabled={isLoadingRoles}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign a role to all team members" />
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
            <div className="flex items-center space-x-2">
              <Switch
                id="is-guest-team"
                checked={isGuest}
                onCheckedChange={setIsGuest}
              />
              <FormLabel htmlFor="is-guest-team">Add as guests</FormLabel>
            </div>
            <Button
              onClick={handleInviteTeam}
              disabled={
                !selectedTeamId || !selectedRoleId || addTeamMutation.isPending
              }
              className="w-full"
            >
              {addTeamMutation.isPending ? "Adding Team..." : "Invite Team"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
