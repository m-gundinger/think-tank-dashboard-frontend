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
import { useUpdateStandaloneTask } from "../api/useUpdateStandaloneTask";
import { useDeleteStandaloneTask } from "../api/useDeleteStandaloneTask";
import { TaskStatus, TaskPriority } from "@/types";
import { toast } from "sonner";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
interface TaskTableRowProps {
  task: any;
  onTaskSelect: (taskId: string) => void;
  workspaceId?: string;
  projectId?: string;
  level?: number;
  isSelected: boolean;
  onSelectChange: (id: string, checked: boolean) => void;
}

export function TaskTableRow({
  task,
  workspaceId,
  projectId,
  onTaskSelect,
  level = 0,
  isSelected,
  onSelectChange,
}: TaskTableRowProps) {
  const useUpdateHook = projectId ? useUpdateTask : useUpdateStandaloneTask;
  const updateTaskMutation = useUpdateHook(workspaceId!, projectId!, task.id);

  const useDeleteHook = projectId ? useDeleteTask : useDeleteStandaloneTask;
  const deleteTaskMutation = useDeleteHook(workspaceId!, projectId!);

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTaskSelect(task.id);
  };
  return (
    <React.Fragment>
      <TableRow
        data-state={isSelected && "selected"}
        className="cursor-pointer"
        onClick={() => onTaskSelect(task.id)}
      >
        <TableCell onClick={(e) => e.stopPropagation()} className="w-[50px]">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectChange(task.id, !!checked)}
          />
        </TableCell>
        <TableCell className="font-medium">
          <div style={{ paddingLeft: `${level * 24}px` }}>{task.title}</div>
          {task.projectName && (
            <Badge variant="outline" className="ml-2">
              {task.projectName}
            </Badge>
          )}
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
          <Select onValueChange={handlePriorityChange} value={task.priority}>
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
              <DropdownMenuItem onClick={handleEdit}>
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
          isSelected={isSelected}
          onSelectChange={onSelectChange}
        />
      ))}
    </React.Fragment>
  );
}