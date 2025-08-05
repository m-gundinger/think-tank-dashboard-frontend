import { z } from "zod";
import { SocialProvider } from "../types/api";

// Reusable Schemas
export const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
export const phoneNumberSchema = z
  .string()
  .refine((val) => {
    if (!val || val.length === 0) return true;
    return phoneRegex.test(val);
  }, "Invalid phone number format.")
  .optional()
  .nullable();

export const nameSchema = (entity: string, min = 2) =>
  z.string().min(min, `${entity} name must be at least ${min} characters.`);
export const descriptionSchema = z.string().optional().nullable();
export const requiredStringSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required.`);

// User & Profile Schemas
export const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  provider: z.nativeEnum(SocialProvider),
  url: z.string().url("Please enter a valid URL."),
});