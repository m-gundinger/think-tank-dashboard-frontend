import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CommentSection } from "@/features/comments/components/CommentSection";
import { SubtaskList } from "./SubtaskList";
import { useState, useEffect } from "react";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskLinks } from "./TaskLinks";
import { EditableField } from "@/components/ui/EditableField";

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

  return (
    <div className="col-span-2 space-y-6 overflow-y-auto border-r pr-6">
      <RichTextEditor
        value={description}
        onChange={setDescription}
        onBlur={() => {
          if (description !== task.description) {
            onSave("description", description);
          }
        }}
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

      <CreateTaskDialog
        workspaceId={workspaceId}
        projectId={projectId}
        parentId={task.id}
        isOpen={isSubtaskDialogOpen}
        onOpenChange={setIsSubtaskDialogOpen}
      />
    </div>
  );
}
