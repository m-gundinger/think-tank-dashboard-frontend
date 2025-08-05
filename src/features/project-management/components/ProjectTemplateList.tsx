import { useState } from "react";
import { useManageProjectTemplates } from "../api/useManageProjectTemplates";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectTemplateCard } from "./ProjectTemplateCard";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTemplateForm } from "./CreateTemplateForm";

interface ListProps {
  workspaceId: string;
  projectId: string;
}

const ListSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton key={i} className="h-40 w-full" />
    ))}
  </div>
);

export function ProjectTemplateList({ workspaceId, projectId }: ListProps) {
  const { useGetAll } = useManageProjectTemplates();
  const { data, isLoading, isError } = useGetAll();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <ListSkeleton />;
  if (isError) return <div>Error loading project templates.</div>;

  const templates = data?.data || [];

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title="No Templates"
        description="This project has not been saved as a template yet."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template: any) => (
          <ProjectTemplateCard
            key={template.id}
            template={template}
            onEdit={() => setEditingId(template.id)}
          />
        ))}
      </div>

      <ResourceCrudDialog
        isOpen={!!editingId}
        onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
        resourceId={editingId}
        resourcePath={`project-templates`}
        resourceKey={["projectTemplates"]}
        title="Edit Template"
        description="Update the name and description of this project template."
        form={CreateTemplateForm}
        formProps={{ workspaceId, projectId, sourceProjectId: projectId }}
      />
    </>
  );
}
