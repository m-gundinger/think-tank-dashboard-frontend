import { z } from "zod";

const BaseProfileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),

  birthday: z.coerce.date().optional().nullable(),
  socialLinks: z
    .array(
      z.object({
        provider: z.enum([
          "GOOGLE",
          "LINKEDIN",
          "TWITTER",
          "FACEBOOK",
          "NEXTCLOUD",
          "TELEGRAM",
          "GITHUB",
          "WEBSITE",
          "OTHER",
        ]),
        url: z.string().url(),
      })
    )
    .optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

const BiographyUpdateSchema = z.object({
  biography: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = val || "";
      if (!val || tempDiv.textContent?.trim() === "") {
        return null;
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
