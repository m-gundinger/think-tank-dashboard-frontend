import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "../api/useUpdateUser";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SocialProvider } from "@/types";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { useGetSkills } from "@/features/skills/api/useGetSkills";

const phoneRegex = new RegExp(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/);

const socialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  provider: z.nativeEnum(SocialProvider),
  url: z.string().url("Please enter a valid URL."),
});

const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("A valid email is required."),
  biography: z.string().optional().nullable(),
  phoneNumber: z
    .string()
    .refine((val) => {
      if (!val) return true;
      return phoneRegex.test(val);
    }, "Invalid phone number format.")
    .optional()
    .nullable(),
  birthday: z.date().nullable().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

const parseServerDate = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDateForServer = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

interface EditUserFormProps {
  user: any;
  onSuccess?: () => void;
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const updateMutation = useUpdateUser(user.id);
  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkills();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      biography: "",
      phoneNumber: "",
      birthday: null,
      socialLinks: [],
      skillIds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const formData = useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      biography: user.biography || "",
      phoneNumber: user.phoneNumber || "",
      birthday: parseServerDate(user.birthday),
      socialLinks: user.socialLinks || [],
      skillIds: user.skills?.map((s: any) => s.id) || [],
    };
  }, [user]);

  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  async function onSubmit(values: EditUserFormValues) {
    const { birthday, ...submissionData } = values;
    const formattedData = {
      ...submissionData,
      birthday: formatDateForServer(birthday),
    };
    await updateMutation.mutateAsync(formattedData, {
      onSuccess,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skillIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <MultiSelect
                options={skillsData || []}
                selected={field.value ?? []}
                onChange={field.onChange}
                placeholder={
                  isLoadingSkills ? "Loading skills..." : "Select skills..."
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Social Links</FormLabel>
          <div className="mt-2 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.provider`}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(SocialProvider).map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://example.com/username"
                      className="flex-grow"
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ provider: SocialProvider.WEBSITE, url: "" })
              }
            >
              Add Social Link
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
