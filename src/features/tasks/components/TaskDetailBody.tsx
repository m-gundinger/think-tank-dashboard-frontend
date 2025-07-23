import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CommentSection } from "@/features/comments/components/CommentSection";
import { SubtaskList } from "./SubtaskList";
import { useState, useEffect } from "react";
import { ResourceCrudDialog } from "@/components/ui/ResourceCrudDialog";
import { CreateTaskForm } from "@/features/tasks/components/CreateTaskForm";
import { TaskLinks } from "./TaskLinks";
import { TaskChecklist } from "./TaskChecklist";
import { ChecklistItem } from "../task.types";
export function TaskDetailBody({
  task,
  workspaceId,
  projectId,
  onSave,
  onTaskSelect,
}: any) {
  const [isSubtaskDialogOpen, setIsSubtaskDialogOpen] = useState(false);
  const [description, setDescription] = useState(task.description || "");

  useEffect(() => {
    setDescription(task.description || "");
  }, [task.description]);
  const handleChecklistSave = (items: ChecklistItem[]) => {
    onSave("checklist", items);
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

      <CommentSection
        workspaceId={workspaceId}
        projectId={projectId}
        taskId={task.id}
      />

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