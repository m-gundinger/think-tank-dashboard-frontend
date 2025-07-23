
import { useEffect, useRef } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { Task } from "@/features/tasks/task.types";
import { useApiResource } from "@/hooks/useApiResource";
import { useParams } from "react-router-dom";

interface GanttChartViewProps {
  tasks: Task[];
}

export function GanttChartView({ tasks }: GanttChartViewProps) {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const taskResource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    ["tasks", projectId]
  );
  const updateTaskMutation = taskResource.useUpdate();

  useEffect(() => {
    if (!ganttContainer.current) return;

    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.columns = [
      { name: "text", label: "Task name", tree: true, width: "*" },
      { name: "start_date", label: "Start time", align: "center", width: 120 },
      { name: "duration", label: "Duration", align: "center", width: 80 },
    ];

    gantt.init(ganttContainer.current);

    const onAfterTaskDrag = (id: string, mode: string) => {
      const task = gantt.getTask(id);
      const updates: { startDate?: Date; dueDate?: Date } = {};

      if (
        mode === gantt.config.drag_mode.move ||
        mode === gantt.config.drag_mode.resize
      ) {
        updates.startDate = task.start_date;
        updates.dueDate = task.end_date;

        updateTaskMutation.mutate({ id: id as string, data: updates });
      }
    };

    gantt.createDataProcessor({
      task: {
        update: (data: any, id: string) => {
          const updates = {
            title: data.text,
            startDate: data.start_date,
            dueDate: data.end_date,
          };
          updateTaskMutation.mutate({ id: id as string, data: updates });
          return Promise.resolve();
        },
        create: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      },
      link: {
        create: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      },
    });

    const eventId = gantt.attachEvent("onAfterTaskDrag", onAfterTaskDrag);

    return () => {
      gantt.detachEvent(eventId);
      gantt.clearAll();
    };
  }, []);

  useEffect(() => {
    const formattedTasks = {
      data: tasks.map((task) => ({
        id: task.id,
        text: task.title,
        start_date: task.startDate ? new Date(task.startDate) : new Date(),
        end_date: task.dueDate
          ? new Date(task.dueDate)
          : new Date(new Date().setDate(new Date().getDate() + 1)),
        parent: task.parentId || 0,
      })),
      links: [],
    };
    gantt.parse(formattedTasks);
  }, [tasks]);

  return (
    <div
      ref={ganttContainer}
      style={{ width: "100%", height: "calc(100vh - 220px)" }}
    ></div>
  );
}
