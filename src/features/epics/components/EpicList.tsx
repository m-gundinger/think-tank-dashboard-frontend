import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateEpicForm } from "./CreateEpicForm";

export function EpicList({ workspaceId, projectId }: any) {
  const epicResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/epics`,
    ["epics", projectId]
  );
  const { data, isLoading, isError } = epicResource.useGetAll();
  const deleteMutation = epicResource.useDelete();
  const [editingEpicId, setEditingEpicId] = useState<string | null>(null);
  if (isLoading) return <div>Loading epics...</div>;
  if (isError) return <div>Error loading epics.</div>;
  const handleDelete = (epic: any) => {
    if (
      window.confirm(`Are you sure you want to delete the epic "${epic.name}"?`)
    ) {
      deleteMutation.mutate(epic.id);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {data && data.data && data.data.length > 0 ? (
          data.data.map((epic: any) => (
            <Card key={epic.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{epic.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {epic.description || "No description."}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingEpicId(epic.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(epic)}
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Status: {epic.status}
                  </span>
                  <div className="flex w-1/3 items-center gap-2">
                    <Progress value={epic.progress} className="h-2" />
                    <span className="text-muted-foreground w-12 text-right">
                      {epic.progress}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No epics found for this project.</p>
        )}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingEpicId}
        onOpenChange={(isOpen) => !isOpen && setEditingEpicId(null)}
        resourceId={editingEpicId}
        resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/epics`}
        resourceKey={["epics", projectId]}
        title="Edit Epic"
        description="Make changes to your epic's details."
        form={CreateEpicForm}
      />
    </>
  );
}
