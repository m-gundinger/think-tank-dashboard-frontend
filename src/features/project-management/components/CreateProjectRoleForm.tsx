import { z } from "zod";
import { nameSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/form/ResourceForm";
import { FormInput } from "@/components/form/FormFields";

const projectRoleSchema = z.object({
  name: nameSchema("Role"),
});

interface CreateProjectRoleFormProps {
  workspaceId: string;
  projectId: string;
  onSuccess?: () => void;
}

export function CreateProjectRoleForm({
  workspaceId,
  projectId,
  onSuccess,
}: CreateProjectRoleFormProps) {
  return (
    <ResourceForm
      schema={projectRoleSchema}
      resourcePath={`workspaces/${workspaceId}/projects/${projectId}/roles`}
      resourceKey={["projectRoles", projectId]}
      onSuccess={onSuccess}
      renderFields={() => (
        <FormInput
          name="name"
          label="Role Name"
          placeholder="e.g., Contributor"
        />
      )}
    />
  );
}
