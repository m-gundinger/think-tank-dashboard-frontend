
import { z } from "zod";
import { SprintStatus } from "@/types";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
  createUuidParamSchema,
} from "@/lib/zod";

export const SprintIdParamsSchema = createUuidParamSchema("sprintId", "Sprint");

export const SprintSchema = z.object({
  __typename: z.literal("Sprint"),
  id: z.string().uuid(),
  name: z.string(),
  goal: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  status: z.nativeEnum(SprintStatus),
  completedStoryPoints: z.number().int().nullable().optional(),
  projectId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Sprint = z.infer<typeof SprintSchema>;

export const CreateSprintDtoSchema = z.object({
  name: z.string().min(1, "Sprint name is required."),
  goal: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  projectId: z.string().uuid(),
});
export type CreateSprintDto = z.infer<typeof CreateSprintDtoSchema>;

export const UpdateSprintDtoSchema = CreateSprintDtoSchema.omit({
  projectId: true,
}).partial();
export type UpdateSprintDto = z.infer<typeof UpdateSprintDtoSchema>;

export const ListSprintsQuerySchema = createPaginationSchema().extend({
  status: z.nativeEnum(SprintStatus).optional(),
});
export type ListSprintsQuery = z.infer<typeof ListSprintsQuerySchema>;

export const PaginatedSprintsResponseSchema =
  createPaginatedResponseSchema(SprintSchema);