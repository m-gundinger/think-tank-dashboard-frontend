import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApiResource } from "@/hooks/useApiResource";
import { getAbsoluteUrl } from "@/lib/utils";
import { EntityCard } from "@/components/ui/EntityCard";
import { Team } from "@/types";

export function TeamCard({ team, onEdit }: { team: Team; onEdit: () => void }) {
  const teamResource = useApiResource(`/workspaces/${team.workspaceId}/teams`, [
    "teams",
    team.workspaceId,
  ]);
  const deleteMutation = teamResource.useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete the "${team.name}" team?`)
    ) {
      deleteMutation.mutate(team.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };
  return (
    <EntityCard
      title={team.name}
      description={team.description || "No description provided."}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
    >
      <h4 className="text-muted-foreground mb-2 text-sm font-medium">
        Members
      </h4>
      <div className="flex items-center -space-x-2">
        {team.members.map((member: any) => (
          <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
            <AvatarImage
              src={getAbsoluteUrl(member.avatarUrl)}
              alt={member.name}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {team.members.length === 0 && (
          <p className="text-muted-foreground text-sm">No members yet.</p>
        )}
      </div>
    </EntityCard>
  );
}
