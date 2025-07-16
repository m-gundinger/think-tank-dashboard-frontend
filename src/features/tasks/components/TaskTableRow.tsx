import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTask } from "../api/useUpdateTask";
import { useDeleteTask } from "../api/useDeleteTask";
import { TaskStatus, TaskPriority } from "@/types";
import { toast } from "sonner";
import React from "react";
import { format } from "date-fns";

interface TaskTableRowProps {
  task: any;
  workspaceId: string;
  projectId: string;
  onTaskSelect: (taskId: string) => void;
  level?: number;
}

export function TaskTableRow({
  task,
  workspaceId,
  projectId,
  onTaskSelect,
  level = 0,
}: TaskTableRowProps) {
  const updateTaskMutation = useUpdateTask(workspaceId, projectId, task.id);
  const deleteTaskMutation = useDeleteTask(workspaceId, projectId);

  const handleStatusChange = (newStatus: string) => {
    updateTaskMutation.mutate({ status: newStatus });
  };
  const handlePriorityChange = (newPriority: string) => {
    if (newPriority !== task.priority) {
      updateTaskMutation.mutate({ priority: newPriority });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete task: "${task.title}"?`)
    ) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(task.id);
    toast.success("Task ID copied to clipboard.");
  };

  return (
    <React.Fragment>
      <TableRow
        className="cursor-pointer"
        onClick={() => onTaskSelect(task.id)}
      >
        <TableCell className="font-medium">
          <div style={{ paddingLeft: `${level * 24}px` }}>{task.title}</div>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select onValueChange={handleStatusChange} value={task.status}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select
            onValueChange={handlePriorityChange}
            defaultValue={task.priority}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Set priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskPriority).map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          {task.dueDate ? format(new Date(task.dueDate), "PPP") : "None"}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onTaskSelect(task.id)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Task</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Task ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {task.subtasks?.map((subtask: any) => (
        <TaskTableRow
          key={subtask.id}
          task={subtask}
          workspaceId={workspaceId}
          projectId={projectId}
          onTaskSelect={onTaskSelect}
          level={level + 1}
        />
      ))}
    </React.Fragment>
  );
}