import { useEffect, useRef } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "@/styles/gantt.css";
import { Task } from "@/types";
import { useUpdateTask } from "../api/useUpdateTask";
import { useParams } from "react-router-dom";
import { TaskLinkType } from "@/types/api";
import { useManageTaskLinks } from "../api/useManageTaskLinks";

interface GanttChartViewProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
}

export function GanttChartView({ tasks, onTaskSelect }: GanttChartViewProps) {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const updateTaskMutation = useUpdateTask();
  const { addLink, removeLink } = useManageTaskLinks(workspaceId, projectId);

  useEffect(() => {
    if (!ganttContainer.current) return;

    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.columns = [
      { name: "text", label: "Task name", tree: true, width: "*" },
      { name: "start_date", label: "Start time", align: "center", width: 120 },
      { name: "duration", label: "Duration", align: "center", width: 80 },
    ];
    gantt.config.drag_links = true;
    gantt.config.drag_progress = true;

    gantt.templates.tooltip_text = function (_start, _end, task) {
      const taskData = (task as any).resource as Task;
      if (!taskData) return task.text;
      return `<b>${task.text}</b><br/>
              <b>Status:</b> ${taskData.status}<br/>
              <b>Priority:</b> ${taskData.priority}<br/>
              <b>Duration:</b> ${task.duration} days`;
    };

    gantt.templates.task_class = function (_start, _end, task) {
      const taskData = (task as any).resource as Task;
      if (taskData) {
        return `gantt-task-status-${taskData.status.toLowerCase()}`;
      }
      return "";
    };

    gantt.init(ganttContainer.current);

    const onTaskClickHandler = (id: string | number) => {
      onTaskSelect(id as string);
      return true;
    };

    const onAfterTaskDrag = (id: string | number, mode: string) => {
      const task = gantt.getTask(id);
      const updates: {
        startDate?: string | null;
        dueDate?: string | null;
        progress?: number;
      } = {};

      if (
        mode === gantt.config.drag_mode.progress &&
        typeof task.progress === "number"
      ) {
        updates.progress = Math.round(task.progress * 100);
      } else if (
        mode === gantt.config.drag_mode.move ||
        mode === gantt.config.drag_mode.resize
      ) {
        updates.startDate = task.start_date?.toISOString() ?? null;
        updates.dueDate = task.end_date?.toISOString() ?? null;

        updateTaskMutation.mutate({
          taskId: id as string,
          workspaceId,
          projectId,
          taskData: updates,
        });
      }
    };

    const onAfterLinkAddHandler = (_id: string | number, link: any) => {
      addLink({
        sourceTaskId: link.source,
        targetTaskId: link.target,
        type: TaskLinkType.BLOCKS,
      });
    };

    const onAfterLinkDeleteHandler = (id: string | number, link: any) => {
      // Gantt link id is what we need to use
      removeLink({
        taskId: link.source, // taskId is required but not used for deletion
        linkId: id as string,
      });
    };

    const taskClickEvent = gantt.attachEvent("onTaskClick", onTaskClickHandler);
    const taskDragEvent = gantt.attachEvent("onAfterTaskDrag", onAfterTaskDrag);
    const linkAddEvent = gantt.attachEvent(
      "onAfterLinkAdd",
      onAfterLinkAddHandler
    );
    const linkDeleteEvent = gantt.attachEvent(
      "onAfterLinkDelete",
      onAfterLinkDeleteHandler
    );

    return () => {
      gantt.detachEvent(taskClickEvent);
      gantt.detachEvent(taskDragEvent);
      gantt.detachEvent(linkAddEvent);
      gantt.detachEvent(linkDeleteEvent);
      gantt.clearAll();
    };
  }, [
    workspaceId,
    projectId,
    updateTaskMutation,
    onTaskSelect,
    addLink,
    removeLink,
  ]);

  useEffect(() => {
    if (tasks) {
      const ganttLinks: any[] = [];
      const ganttTasks = tasks.map((task) => {
        if (task.links) {
          task.links.forEach((link) => {
            if (link.type === TaskLinkType.BLOCKS && link.targetTask) {
              ganttLinks.push({
                id: link.id,
                source: task.id,
                target: link.targetTask.id,
                type: "0", // Finish to Start
              });
            }
          });
        }
        return {
          id: task.id,
          text: task.title,
          start_date: task.startDate ? new Date(task.startDate) : new Date(),
          end_date: task.dueDate
            ? new Date(task.dueDate)
            : new Date(new Date().setDate(new Date().getDate() + 1)),
          parent: task.parentId || 0,
          progress: task.status === "DONE" ? 1 : 0.4,
          open: true,
          resource: task,
        };
      });

      const formattedTasks = {
        data: ganttTasks,
        links: ganttLinks,
      };
      gantt.clearAll();
      gantt.parse(formattedTasks);
    }
  }, [tasks]);
  return (
    <div
      ref={ganttContainer}
      style={{ width: "100%", height: "calc(100vh - 220px)" }}
    ></div>
  );
}