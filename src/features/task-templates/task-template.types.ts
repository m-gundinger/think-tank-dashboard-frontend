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
  templateData: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TaskTemplate = z.infer<typeof TaskTemplateSchema>;

export const CreateTaskTemplateDtoSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  description: z.string().optional().nullable(),
  templateData: UpdateTaskDtoSchema.extend({
    title: z.string().optional(),
  }),
});
export type CreateTaskTemplateDto = z.infer<typeof CreateTaskTemplateDtoSchema>;