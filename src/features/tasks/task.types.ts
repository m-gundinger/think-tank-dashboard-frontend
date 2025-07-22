// FILE: src/features/tasks/task.types.ts
import { z, type ZodType } from "zod";
import {
  TaskStatus,
  TaskPriority,
  TaskLinkType,
  CustomFieldType,
  DocumentType,
} from "@/types";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
  createUuidParamSchema,
} from "@/lib/zod";
import { TaskTypeSchema } from "../task-types/task-type.types";

export const ProjectIdParamsSchema = createUuidParamSchema(
  "projectId",
  "Project"
);
export type ProjectIdParams = z.infer<typeof ProjectIdParamsSchema>;

export const TaskIdParamsSchema = createUuidParamSchema("taskId", "Task");
export type TaskIdParams = z.infer<typeof TaskIdParamsSchema>;

export const TaskLinkIdParamsSchema = TaskIdParamsSchema.extend({
  linkId: z.string().uuid(),
});
export interface TaskLinkIdParams {
  taskId: string;
  linkId: string;
}

export const TaskDocumentParamsSchema = TaskIdParamsSchema.extend({
  documentId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
});
export type TaskDocumentParams = z.infer<typeof TaskDocumentParamsSchema>;

export const TaskAssigneeParamsSchema = TaskIdParamsSchema.extend({
  userId: z.string().uuid(),
});
export interface TaskAssigneeParams {
  taskId: string;
  userId: string;
}

const TaskAssigneeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
});

const TaskLinkSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(TaskLinkType),
  targetTask: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
      status: z.nativeEnum(TaskStatus),
    })
    .optional(),
  sourceTask: z
    .object({
      id: z.string().uuid(),
      title: z.string(),
      status: z.nativeEnum(TaskStatus),
    })
    .optional(),
});

const CustomFieldDefinitionForTaskSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(CustomFieldType),
  options: z.any().nullable(),
});

const TaskCustomFieldSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.any(),
  definition: CustomFieldDefinitionForTaskSchema,
});

const TaskDocumentSchema = z.object({
  documentId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
  title: z.string(),
  url: z.string(),
  fileType: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

const BaseTaskSchema = z.object({
  __typename: z.literal("Task"),
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  projectId: z.string().uuid().nullable(),
  taskTypeId: z.string().uuid().nullable().optional(),
  taskType: TaskTypeSchema.nullable().optional(),
  workspaceId: z.string().uuid().nullable(),
  projectName: z.string().nullable(),
  ownerId: z.string().uuid().nullable(),
  creatorId: z.string().uuid().nullable(),
  startDate: z.coerce.date().nullable(),
  dueDate: z.coerce.date().nullable(),
  timeEstimate: z.number().int().nullable(),
  storyPoints: z.number().int().nullable().optional(),
  epicId: z.string().uuid().nullable(),
  sprintId: z.string().uuid().nullable().optional(),
  boardColumnId: z.string().uuid().nullable(),
  orderInColumn: z.number().int().nullable(),
  recurrenceRule: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  assignees: z.array(TaskAssigneeSchema),
  links: z.array(TaskLinkSchema),
  linkedToBy: z.array(TaskLinkSchema),
  customFields: z.array(TaskCustomFieldSchema),
  documents: z.array(TaskDocumentSchema),
  parentId: z.string().uuid().nullable(),
  checklist: z.array(ChecklistItemSchema).nullable().optional(),
});

export type Task = z.infer<typeof BaseTaskSchema> & {
  subtasks: Task[];
};

export const TaskSchema: ZodType<Task> = BaseTaskSchema.extend({
  subtasks: z.lazy(() => z.array(TaskSchema)),
});

export type TaskLink = z.infer<typeof TaskLinkSchema>;

export const CreateTaskDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.NONE),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  timeEstimate: z.number().int().positive().optional().nullable(),
  storyPoints: z.number().int().positive().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  taskTypeId: z.string().uuid().optional().nullable(),
  epicId: z.string().uuid().optional().nullable(),
  sprintId: z.string().uuid().optional().nullable(),
  boardColumnId: z.string().uuid().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  assigneeIds: z.array(z.string().uuid()).optional(),
  checklist: z.array(ChecklistItemSchema).optional().nullable(),
});
export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

export const CreateTaskBodySchema = CreateTaskDtoSchema.omit({
  projectId: true,
});
export type CreateTaskBody = z.infer<typeof CreateTaskBodySchema>;
export const UpdateTaskDtoSchema = CreateTaskDtoSchema.omit({
  projectId: true,
  parentId: true,
}).partial();
export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;

export const MoveTaskDtoSchema = z.object({
  targetColumnId: z.string().uuid(),
  orderInColumn: z.number().int(),
});
export type MoveTaskDto = z.infer<typeof MoveTaskDtoSchema>;
export const CreateTaskLinkDtoSchema = z.object({
  targetTaskId: z.string().uuid(),
  type: z.nativeEnum(TaskLinkType),
});
export type CreateTaskLinkDto = z.infer<typeof CreateTaskLinkDtoSchema>;
export const AssignUserToTaskDtoSchema = z.object({
  userId: z.string().uuid(),
});
export type AssignUserToTaskDto = z.infer<typeof AssignUserToTaskDtoSchema>;
export const UpdateTaskCustomValuesDtoSchema = z.object({
  updates: z.array(
    z.object({
      fieldId: z.string().uuid(),
      value: z.any().optional(),
    })
  ),
});
export type UpdateTaskCustomValuesDto = z.infer<
  typeof UpdateTaskCustomValuesDtoSchema
>;

export const ListTasksQuerySchema = createPaginationSchema().extend({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  includeSubtasks: z.boolean().default(false),
  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "title",
      "status",
      "priority",
      "dueDate",
      "orderInColumn",
    ])
    .default("orderInColumn"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  taskOrigin: z.enum(["project", "standalone"]).optional(),
  userRole: z.enum(["creator", "assignee"]).optional(),
});
export type ListTasksQuery = z.infer<typeof ListTasksQuerySchema>;

export const PaginatedTasksResponseSchema =
  createPaginatedResponseSchema(TaskSchema);

export type PaginatedTasksResponse = z.infer<
  typeof PaginatedTasksResponseSchema
>;
