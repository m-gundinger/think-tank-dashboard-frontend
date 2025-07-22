// FILE: src/features/task-templates/task-template.types.ts
import { z } from "zod";
import { createUuidParamSchema } from "@/lib/zod";
import { UpdateTaskDtoSchema } from "@/features/tasks/task.types";

export const TaskTemplateIdParamsSchema = createUuidParamSchema(
  "templateId",
  "Task Template"
);

export const TaskTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  projectId: z.string().uuid(),
  templateData: z.any(), // Represents the JSON data for the task
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskTemplate = z.infer<typeof TaskTemplateSchema>;

export const CreateTaskTemplateDtoSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  description: z.string().optional().nullable(),
  templateData: UpdateTaskDtoSchema.extend({
    title: z.string().optional(), // Title is part of the template, not separate
  }),
});

export type CreateTaskTemplateDto = z.infer<typeof CreateTaskTemplateDtoSchema>;
