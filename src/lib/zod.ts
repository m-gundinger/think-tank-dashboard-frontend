import { z, ZodType } from "zod";

export const createPaginationSchema = (defaultLimit = 10) =>
  z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(defaultLimit),
  });

export const createPaginatedResponseSchema = <T extends ZodType>(
  itemSchema: T
) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  });

export const createUuidParamSchema = (
  paramName: string,
  entityDisplayName: string
) =>
  z.object({
    [paramName]: z.string().uuid({
      message: `Invalid ${entityDisplayName} ID format. Expected UUID.`,
    }),
  });
