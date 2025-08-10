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
import { Card } from "@/components/ui/card";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { GlobalTaskTypeForm } from "./GlobalTaskTypeForm";
import { ActionMenu } from "@/components/shared/ActionMenu";

export function GlobalTaskTypeList() {
  const { useGetAll, useDelete } = useManageTaskTypes();
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
                    <ActionMenu
                      onEdit={() => setEditingTypeId(type.id)}
                      onDelete={() => handleDelete(type)}
                      deleteDisabled={deleteMutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No global task types defined.
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
        resourcePath={`/task-types`}
        resourceKey={["taskTypes", "global"]}
        title="Edit Task Type"
        description="Change the name, icon, or color for this task type."
        form={GlobalTaskTypeForm}
      />
    </>
  );
}