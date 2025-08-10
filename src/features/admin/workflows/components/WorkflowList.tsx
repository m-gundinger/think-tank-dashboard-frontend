import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { WorkflowRunsDialog } from "./WorkflowRunsDialog";
import { useToggleWorkflow } from "../api/useToggleWorkflow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { WorkflowForm } from "./WorkflowForm";
import { Workflow } from "@/types";
import { useManageWorkflows } from "../api/useManageWorkflows";

export function WorkflowList() {
  const { useGetAll, useDelete } = useManageWorkflows();
  const { data, isLoading, isError } = useGetAll();
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(
    null
  );
  const [viewingRunsFor, setViewingRunsFor] = useState<Workflow | null>(null);
  const toggleMutation = useToggleWorkflow();
  const deleteMutation = useDelete();

  if (isLoading) return <div>Loading workflows...</div>;
  if (isError) return <div>Error loading workflows.</div>;
  const handleDelete = (workflow: any) => {
    if (
      window.confirm(
        `Delete workflow "${workflow.name}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(workflow.id);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {data?.data.map((workflow: any) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{workflow.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {workflow.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={workflow.enabled}
                      onCheckedChange={(enabled) =>
                        toggleMutation.mutate({
                          workflowId: workflow.id,
                          enabled,
                        })
                      }
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setEditingWorkflowId(workflow.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setViewingRunsFor(workflow)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Runs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDelete(workflow)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {workflow.description}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Trigger:</span>
                <Badge variant="outline">
                  {workflow.triggerType || workflow.cronExpression}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Actions:</span>
                <div className="flex flex-wrap gap-1">
                  {workflow.actions.map((action: any) => (
                    <Badge variant="secondary" key={action.id}>
                      {action.type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ResourceCrudDialog
        isOpen={!!editingWorkflowId}
        onOpenChange={(isOpen) => !isOpen && setEditingWorkflowId(null)}
        resourceId={editingWorkflowId}
        resourcePath="admin/workflows"
        resourceKey={["workflows"]}
        title="Edit Workflow"
        description="Modify the workflow's trigger and actions."
        form={WorkflowForm}
        dialogClassName="sm:max-w-[600px]"
      />
      <WorkflowRunsDialog
        isOpen={!!viewingRunsFor}
        workflowId={viewingRunsFor?.id ?? null}
        workflowName={viewingRunsFor?.name ?? ""}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewingRunsFor(null);
          }
        }}
      />
    </>
  );
}
