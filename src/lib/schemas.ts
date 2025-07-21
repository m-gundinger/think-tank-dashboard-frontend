import { SocialProvider, JobStatus } from "@/types";
import { z } from "zod";
import { createPaginationSchema, createPaginatedResponseSchema } from "./zod";

export const phoneRegex = new RegExp(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/);

export const nameSchema = (entity: string, min = 2) =>
  z.string().min(min, `${entity} name must be at least ${min} characters.`);

export const descriptionSchema = z.string().optional().nullable();

export const requiredStringSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required.`);

export const phoneNumberSchema = z
  .string()
  .refine((val) => {
    if (!val) return true;
    return phoneRegex.test(val);
  }, "Invalid phone number format.")
  .optional()
  .nullable();
export const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  provider: z.nativeEnum(SocialProvider),
  url: z.string().url("Please enter a valid URL."),
});

const BaseProfileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  phoneNumber: phoneNumberSchema,
  birthday: z.date().optional().nullable(),
  socialLinks: z.array(socialLinkSchema).optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

const BiographyUpdateSchema = z.object({
  biography: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (typeof document !== "undefined") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = val || "";
        if (!val || tempDiv.textContent?.trim() === "") {
          return null;
        }
      }
      return val;
    }),
});
export const UpdateUserProfileDtoSchema = BaseProfileUpdateSchema.merge(
  BiographyUpdateSchema
);
export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDtoSchema>;
export const UpdateAvatarDtoSchema = z.object({
  avatarUrl: z.string().url(),
});
export type UpdateAvatarDto = z.infer<typeof UpdateAvatarDtoSchema>;

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
