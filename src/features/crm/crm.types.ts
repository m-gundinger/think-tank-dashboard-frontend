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

export const DealStageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  order: z.number().int(),
  projectId: z.string().uuid(),
});
export type DealStage = z.infer<typeof DealStageSchema>;

const DealContactSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().nullable(),
});

export const DealSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  value: z.number(),
  stageId: z.string().uuid(),
  stage: DealStageSchema,
  companyId: z.string().uuid(),
  company: CompanySchema,
  ownerId: z.string().uuid(),
  ownerName: z.string(),
  createdById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  contacts: z.array(DealContactSchema),
});
export type Deal = z.infer<typeof DealSchema>;
