import { z } from "zod";
import { ProjectStatus } from "@/types";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
  createUuidParamSchema,
} from "@/lib/zod";

export const WorkspaceIdParamsSchema = createUuidParamSchema(
  "workspaceId",
  "Workspace"
);
export type WorkspaceIdParams = z.infer<typeof WorkspaceIdParamsSchema>;

export const ProjectIdParamsSchema = createUuidParamSchema(
  "projectId",
  "Project"
);
export type ProjectIdParams = z.infer<typeof ProjectIdParamsSchema>;

export const ProjectSchema = z.object({
  __typename: z.literal("Project"),
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  status: z.nativeEnum(ProjectStatus),
  isPrivate: z.boolean(),
  workspaceId: z.string().uuid(),
  leadId: z.string().uuid().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskCounter: z.number().int(),
});
export type Project = z.infer<typeof ProjectSchema>;
export const CreateProjectDtoSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long."),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.IN_PROGRESS),
  isPrivate: z.boolean().default(false),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  workspaceId: z.string().uuid(),
});
export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;

export const UpdateProjectDtoSchema = CreateProjectDtoSchema.omit({
  workspaceId: true,
}).partial();
export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;

export const ListProjectsQuerySchema = createPaginationSchema().extend({
  status: z.nativeEnum(ProjectStatus).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "name", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type ListProjectsQuery = z.infer<typeof ListProjectsQuerySchema>;

export const PaginatedProjectsResponseSchema =
  createPaginatedResponseSchema(ProjectSchema);
export type PaginatedProjectsResponse = z.infer<
  typeof PaginatedProjectsResponseSchema
>;
