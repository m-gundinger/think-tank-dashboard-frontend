// FILE: src/features/task-types/components/TaskTypeList.tsx
import { useState } from "react";
import { useManageTaskTypes } from "../api/useManageTaskTypes";
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
import { TaskTypeForm } from "./TaskTypeForm";

interface ListProps {
  workspaceId: string;
  projectId: string;
}

export function TaskTypeList({ workspaceId, projectId }: ListProps) {
  const { useGetAll, useDelete } = useManageTaskTypes(workspaceId, projectId);
  const { data: typesData, isLoading } = useGetAll();
  const deleteMutation = useDelete();
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const handleDelete = (type: any) => {
    if (window.confirm(`Delete task type "${type.name}"? This is permanent.`)) {
      deleteMutation.mutate(type.id);
    }
  };

  if (isLoading) return <div>Loading custom task types...</div>;

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typesData?.data && typesData.data.length > 0 ? (
              typesData.data.map((type: any) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.icon}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: type.color || "transparent",
                          border: "1px solid #ccc",
                        }}
                      />
                      <span>{type.color}</span>
                    </div>
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
                          onClick={() => setEditingTypeId(type.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(type)}
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
                <TableCell colSpan={4} className="h-24 text-center">
                  No custom task types defined for this project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <ResourceCrudDialog
        isOpen={!!editingTypeId}
        onOpenChange={(isOpen) => !isOpen && setEditingTypeId(null)}
        resourceId={editingTypeId}
        resourcePath={`/workspaces/${workspaceId}/projects/${projectId}/task-types`}
        resourceKey={["taskTypes", projectId]}
        title="Edit Task Type"
        description="Change the name, icon, or color for this task type."
        form={TaskTypeForm}
        formProps={{ workspaceId, projectId }}
      />
    </>
  );
}
