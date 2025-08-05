import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiResource } from "@/hooks/useApiResource";
import { useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatDateForServer, parseServerDate } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SocialProvider } from "@/types/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { useGetSkills } from "@/features/crm/api/useGetSkills";
import { phoneNumberSchema, socialLinkSchema } from "@/lib/schemas";
import { useUpdateProfile } from "@/features/user-management/api/useUpdateProfile";

const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email(),
  biography: z.string().optional().nullable(),
  phoneNumber: phoneNumberSchema,
  birthday: z.date().nullable().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  skillIds: z.array(z.string().uuid()).optional(),
});
type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: any;
  onSuccess?: () => void;
  isSelfProfile?: boolean;
}

export function UserForm({
  initialData,
  onSuccess,
  isSelfProfile = false,
}: UserFormProps) {
  const adminUpdateMutation = useApiResource("admin/users", [
    "users",
  ]).useUpdate();
  const selfUpdateMutation = useUpdateProfile();
  const updateMutation = isSelfProfile
    ? selfUpdateMutation
    : adminUpdateMutation;

  const { data: skillsData, isLoading: isLoadingSkills } = useGetSkills();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        biography: initialData.biography || "",
        phoneNumber: initialData.phoneNumber || "",
        birthday: parseServerDate(initialData.birthday),
        socialLinks: initialData.socialLinks || [],
        skillIds: initialData.skills?.map((s: any) => s.id) || [],
      });
    }
  }, [initialData, form]);

  const onSubmit = (values: UserFormValues) => {
    const { email, birthday, ...submissionData } = values;
    const formattedData: any = {
      ...submissionData,
      birthday: formatDateForServer(birthday),
    };

    if (!isSelfProfile) {
      formattedData.email = email;
    }

    const mutationPayload = isSelfProfile
      ? formattedData
      : { id: initialData.id, data: formattedData };

    updateMutation.mutate(mutationPayload, { onSuccess });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
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
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    readOnly={isSelfProfile}
                    disabled={isSelfProfile}
                    {...field}
                  />
                </FormControl>
                {isSelfProfile && (
                  <FormDescription>
                    Your email address cannot be changed from this page.
                  </FormDescription>
                )}
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          </div>

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

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
