import { useForm } from "react-hook-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useCreateUser } from "../api/useCreateUser";
import { useGetRoles } from "@/features/admin/roles/api/useGetRoles";
import { AxiosError } from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = z.object({
  person: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("A valid email is required."),
  }),
  roles: z.array(z.string()).optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const createMutation = useCreateUser();
  const { data: rolesData } = useGetRoles();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      person: {
        firstName: "",
        lastName: "",
        email: "",
      },
      roles: [],
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  const errorMessage = (
    createMutation.error as AxiosError<{ message?: string }>
  )?.response?.data?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="person.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="person.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="person.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormDescription>
                An invitation will be sent to this email to set a password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Roles</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",

                        !(field.value && field.value.length) &&
                          "text-muted-foreground"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1">
                        {(field.value || []).length > 0 ? (
                          rolesData?.data
                            .filter((role: any) =>
                              (field.value || []).includes(role.name)
                            )
                            .map((role: any) => (
                              <Badge variant="secondary" key={role.id}>
                                {role.name}
                              </Badge>
                            ))
                        ) : (
                          <span>Select roles</span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search roles..." />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        {rolesData?.data?.map((role: any) => (
                          <CommandItem
                            value={role.name}
                            key={role.id}
                            onSelect={() => {
                              const selectedRoles = field.value || [];
                              const isSelected = selectedRoles.includes(
                                role.name
                              );
                              form.setValue(
                                "roles",
                                isSelected
                                  ? selectedRoles.filter(
                                      (r: any) => r !== role.name
                                    )
                                  : [...selectedRoles, role.name]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",

                                (field.value || []).includes(role.name)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {role.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <div className="text-sm font-medium text-red-500">{errorMessage}</div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending
            ? "Sending Invite..."
            : "Create and Invite User"}
        </Button>
      </form>
    </Form>
  );
}
