import { z } from "zod";
import {
  createPaginationSchema,
  createPaginatedResponseSchema,
} from "@/lib/zod";
import { JobStatus } from "@/types";

export const JobIdParamsSchema = z.object({
  jobId: z.string().uuid(),
});

export const JobScheduleIdParamsSchema = z.object({
  scheduleId: z.string().uuid(),
});

export const JobSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  payload: z.record(z.string(), z.unknown()),
  status: z.nativeEnum(JobStatus),
  priority: z.number().int(),
  attempts: z.number().int(),
  maxAttempts: z.number().int(),
  scheduledAt: z.coerce.date().nullable(),
  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
  failedAt: z.coerce.date().nullable(),
  nextRetryAt: z.coerce.date().nullable(),
  error: z.string().nullable(),
  result: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Job = z.infer<typeof JobSchema>;

export const JobAttemptSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  attemptNumber: z.number().int(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  error: z.string().nullable(),
  duration: z.number().int().nullable(),
});

export const JobWithAttemptsSchema = JobSchema.extend({
  attempts_log: z.array(JobAttemptSchema),
});

export const JobScheduleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  jobType: z.string(),
  cronExpression: z.string(),
  payload: z.record(z.string(), z.unknown()),
  isActive: z.boolean(),
  lastRunAt: z.coerce.date().nullable(),
  nextRunAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const JobListQuerySchema = createPaginationSchema().extend({
  type: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
  sortBy: z
    .enum(["createdAt", "scheduledAt", "priority", "type", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const JobScheduleListQuerySchema = createPaginationSchema().extend({
  jobType: z.string().optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()).optional(),
  sortBy: z
    .enum(["name", "createdAt", "lastRunAt", "nextRunAt"])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const PaginatedJobsResponseSchema =
  createPaginatedResponseSchema(JobSchema);
export const PaginatedJobSchedulesResponseSchema =
  createPaginatedResponseSchema(JobScheduleSchema);

export const QueueStatsSchema = z.object({
  totalJobs: z.object({
    total: z.number().int(),
    pending: z.number().int(),
    running: z.number().int(),
    completed: z.number().int(),
    failed: z.number().int(),
    cancelled: z.number().int(),
  }),
  averageWaitTime: z.number(),
  averageProcessingTime: z.number(),
  throughputPerHour: z.number(),
  failureRate: z.number(),
});

export const JobSystemStatusResponseSchema = z.object({
  processor: z.object({
    isProcessing: z.boolean(),
    runningJobs: z.number().int(),
    consecutiveFailures: z.number().int(),
  }),
  scheduler: z.object({ isRunning: z.boolean() }),
  registeredJobTypes: z.number().int(),
});
