import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CommentSection } from "@/features/collaboration/components/CommentSection";
import { SubtaskList } from "./SubtaskList";
import { useState, useEffect } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTaskForm } from "@/features/project-management/components/CreateTaskForm";
import { TaskLinks } from "./TaskLinks";
import { TaskChecklist } from "./TaskChecklist";
import { ChecklistItem } from "@/types";
import { ActivityLog } from "@/features/analytics/components/ActivityLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

export function TaskDetailBody({
  task,
  workspaceId,
  projectId,
  onSave,
  onTaskSelect,
}: any) {
  const [isSubtaskDialogOpen, setIsSubtaskDialogOpen] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    setDescription(task.description || "");
  }, [task.description]);
  const handleChecklistSave = (items: ChecklistItem[]) => {
    onSave("checklist", items);
  };

  const handleSubtaskSuccess = () => {
    setIsSubtaskDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["task", task.id] });
  };

  return (
    <div className="col-span-2 space-y-6 border-r pr-6">
      <RichTextEditor
        value={description}
        onChange={setDescription}
        onBlur={() => {
          if (description !== task.description) {
            onSave("description", description);
          }
        }}
        workspaceId={workspaceId}
        projectId={projectId}
      />

      <TaskChecklist
        initialItems={task.checklist || []}
        onSave={handleChecklistSave}
      />

      <SubtaskList
        task={task}
        onAddSubtask={() => setIsSubtaskDialogOpen(true)}
        onTaskSelect={onTaskSelect}
      />

      <TaskLinks task={task} workspaceId={workspaceId} projectId={projectId} />

      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="comments" className="mt-4">
          <CommentSection
            workspaceId={workspaceId}
            projectId={projectId}
            taskId={task.id}
          />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityLog scope={{ taskId: task.id }} title="Task Activity" />
        </TabsContent>
      </Tabs>

      <ResourceCrudDialog
        isOpen={isSubtaskDialogOpen}
        onOpenChange={setIsSubtaskDialogOpen}
        title="Create Sub-task"
        description="Fill in the details below to add a new sub-task."
        form={CreateTaskForm}
        formProps={{
          workspaceId,
          projectId,
          parentId: task.id,
          onSuccess: handleSubtaskSuccess,
        }}
        resourcePath={
          projectId
            ? `/workspaces/${workspaceId}/projects/${projectId}/tasks`
            : "/tasks"
        }
        resourceKey={projectId ? ["tasks", projectId] : ["myTasks"]}
      />
    </div>
  );
}
