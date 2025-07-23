import { z } from "zod";
import { ViewType } from "@/types";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
  createUuidParamSchema,
} from "@/lib/zod";

export const ProjectIdParamsSchema = createUuidParamSchema(
  "projectId",
  "Project"
);
export const ViewIdParamsSchema = createUuidParamSchema("viewId", "View");
export type ViewIdParams = z.infer<typeof ViewIdParamsSchema>;

export const ViewColumnSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  order: z.number().int(),
  viewId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const KanbanConfigSchema = z.object({});

const ListConfigSchema = z.object({
  visibleFields: z.array(z.string()).optional(),
});

const CalendarConfigSchema = z.object({
  dateField: z.enum(["dueDate", "startDate"]),
});

const GanttConfigSchema = z.object({});
const BacklogConfigSchema = z.object({});

export const ViewConfigSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(ViewType.KANBAN),
    settings: KanbanConfigSchema.optional(),
  }),
  z.object({
    type: z.literal(ViewType.LIST),
    settings: ListConfigSchema.optional(),
  }),
  z.object({
    type: z.literal(ViewType.CALENDAR),
    settings: CalendarConfigSchema,
  }),
  z.object({
    type: z.literal(ViewType.GANTT),
    settings: GanttConfigSchema.optional(),
  }),
  z.object({
    type: z.literal(ViewType.BACKLOG),
    settings: BacklogConfigSchema.optional(),
  }),
]);
export type ViewConfig = z.infer<typeof ViewConfigSchema>;

export const ViewSchema = z.object({
  __typename: z.literal("View"),
  id: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(ViewType),
  config: ViewConfigSchema.nullable(),
  projectId: z.string().uuid(),
  columns: z.array(ViewColumnSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type View = z.infer<typeof ViewSchema>;
export type ViewColumn = z.infer<typeof ViewColumnSchema>;

export const CreateViewColumnDtoSchema = z.object({
  name: z.string().min(1, "Column name cannot be empty."),
  order: z.number().int().optional(),
});

export const CreateViewDtoSchema = z.object({
  name: z.string().min(1, "View name cannot be empty."),
  type: z.nativeEnum(ViewType),
  config: ViewConfigSchema.optional(),
  projectId: z.string().uuid(),
  columns: z.array(CreateViewColumnDtoSchema).optional(),
});
export type CreateViewDto = z.infer<typeof CreateViewDtoSchema>;

export const UpdateViewDtoSchema = z.object({
  name: z.string().min(1).optional(),
  config: ViewConfigSchema.optional(),
  columns: z.array(CreateViewColumnDtoSchema).optional(),
});
export type UpdateViewDto = z.infer<typeof UpdateViewDtoSchema>;

export const ListViewsQuerySchema = createPaginationSchema().extend({
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
export type ListViewsQuery = z.infer<typeof ListViewsQuerySchema>;

export const PaginatedViewsResponseSchema =
  createPaginatedResponseSchema(ViewSchema);
export type PaginatedViewsResponse = z.infer<
  typeof PaginatedViewsResponseSchema
>;
