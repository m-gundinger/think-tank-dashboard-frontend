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
import { useGetProfile } from "../api/useGetProfile";
import { useUpdateProfile } from "../api/useUpdateProfile";
import { useEffect } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const socialLinkSchema = z.object({
  provider: z.nativeEnum(SocialProvider),
  url: z.string().url("Please enter a valid URL."),
});

const phoneRegex = new RegExp(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/);
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
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
});

export function ProfileForm() {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<any>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      biography: "",
      phoneNumber: "",
      birthday: null,
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        biography: profile.biography || "",
        phoneNumber: profile.phoneNumber || "",
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        socialLinks: profile.socialLinks || [],
      });
    }
  }, [profile, form]);

  const onSubmit = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8"
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
                          "w-[240px] pl-3 text-left font-normal",
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
                      selected={field.value}
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

        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
