// FILE: src/features/crm/crm.types.ts
import { z } from "zod";

export const PersonInCompanySchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullable(),
  avatarUrl: z.string().url().nullable(),
  roleInCompany: z.string().nullable(),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  domain: z.string().nullable(),
  logoUrl: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  people: z.array(PersonInCompanySchema),
});
export type Company = z.infer<typeof CompanySchema>;
