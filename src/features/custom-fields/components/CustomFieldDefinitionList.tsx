import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CustomFieldDefinitionForm } from "./CustomFieldDefinitionForm";

interface ListProps {
  workspaceId: string;
  projectId: string;
}

export function CustomFieldDefinitionList({
  workspaceId,
  projectId,
}: ListProps) {
  const customFieldResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/custom-fields`,
    ["customFieldDefinitions", projectId]
  );
  const { data: fieldsData, isLoading } = customFieldResource.useGetAll();
  const deleteMutation = customFieldResource.useDelete();
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const handleDelete = (field: any) => {
    if (
      window.confirm(`Delete custom field "${field.name}"? This is permanent.`)
    ) {
      deleteMutation.mutate(field.id);
    }
  };

  if (isLoading) return <div>Loading custom fields...</div>;

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldsData?.data && fieldsData.data.length > 0 ? (
              fieldsData.data.map((field: any) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setEditingFieldId(field.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(field)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No custom fields defined for this project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <ResourceCrudDialog
        isOpen={!!editingFieldId}
        onOpenChange={(isOpen) => !isOpen && setEditingFieldId(null)}
        resourceId={editingFieldId}
        resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/custom-fields`}
        resourceKey={["customFieldDefinitions", projectId]}
        title="Edit Custom Field"
        description="Change the name or options for this custom field. The type cannot be changed after creation."
        form={CustomFieldDefinitionForm}
        formProps={{ workspaceId, projectId }}
      />
    </>
  );
}
