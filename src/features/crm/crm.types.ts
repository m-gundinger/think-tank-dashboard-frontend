import { z } from "zod";
import { InteractionType, SkillCategory, SocialProvider } from "@/types/api";

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.nativeEnum(SkillCategory),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const SocialLinkSchema = z.object({
  id: z.string().uuid(),
  provider: z.nativeEnum(SocialProvider),
  url: z.string().url(),
  personId: z.string().uuid(),
  createdAt: z.coerce.date(),
});

export const PersonSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().nullable(),
  avatarUrl: z.string().nullable(),
  biography: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  birthday: z.coerce.date().nullable(),
  socialLinks: z.array(SocialLinkSchema),
  skills: z.array(SkillSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  authId: z.string().uuid().nullable(),
  isActive: z.boolean(),
  roles: z.array(z.string()),
  name: z.string(),
});

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
  company: CompanySchema.pick({ name: true }),
  ownerId: z.string().uuid(),
  ownerName: z.string(),
  createdById: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contacts: z.array(DealContactSchema),
});
export type Deal = z.infer<typeof DealSchema>;

export const InteractionSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(InteractionType),
  notes: z.string(),
  date: z.coerce.date(),
  actor: z.object({ name: z.string().nullable() }).nullable(),
});
export type Interaction = z.infer<typeof InteractionSchema>;