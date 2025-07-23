import { z } from "zod";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
  createUuidParamSchema,
} from "@/lib/zod";

export const TaskTypeIdParamsSchema = createUuidParamSchema(
  "taskTypeId",
  "Task Type"
);
export const TaskTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  projectId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskType = z.infer<typeof TaskTypeSchema>;

export const CreateTaskTypeDtoSchema = z.object({
  name: z.string().min(1, "Type name is required."),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});
export type CreateTaskTypeDto = z.infer<typeof CreateTaskTypeDtoSchema>;

export const UpdateTaskTypeDtoSchema = CreateTaskTypeDtoSchema.partial();
export type UpdateTaskTypeDto = z.infer<typeof UpdateTaskTypeDtoSchema>;

export const ListTaskTypesQuerySchema = createPaginationSchema();
export type ListTaskTypesQuery = z.infer<typeof ListTaskTypesQuerySchema>;

export const PaginatedTaskTypesResponseSchema =
  createPaginatedResponseSchema(TaskTypeSchema);
