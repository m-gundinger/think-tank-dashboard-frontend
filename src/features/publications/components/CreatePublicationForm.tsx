import { useForm } from "react-hook-form";
import { useCreatePublication } from "../api/useCreatePublications";
import { useUpdatePublication } from "../api/useUpdatePublication";
import { useGetUsers } from "@/features/admin/users/api/useGetUsers";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  excerpt: z.string().optional(),
  authorIds: z.array(z.string().uuid()),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});
type PublicationFormValues = z.infer<typeof publicationSchema>;

interface PublicationFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function CreatePublicationForm({
  initialData,
  onSuccess,
}: PublicationFormProps) {
  const isEditMode = !!initialData;
  const createMutation = useCreatePublication();
  const updateMutation = useUpdatePublication();
  const mutation = isEditMode ? updateMutation : createMutation;

  const { data: usersData } = useGetUsers({});
  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      authorIds: [],
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        ...initialData,
        authorIds: initialData.authors?.map((a: any) => a.id) || [],
      });
    }
  }, [initialData, isEditMode, form]);

  async function onSubmit(values: PublicationFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  }

  const selectedAuthors =
    usersData?.data.filter((user: any) =>
      form.watch("authorIds").includes(user.id)
    ) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="The Future of AI in Research..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt (Optional)</FormLabel>
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
          name="authorIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Authors</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-auto w-full justify-between"
                    >
                      <div className="flex flex-wrap items-center gap-1">
                        {selectedAuthors.length > 0
                          ? selectedAuthors.map((user: any) => (
                              <Badge variant="secondary" key={user.id}>
                                {user.name}
                              </Badge>
                            ))
                          : "Select authors..."}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {usersData?.data.map((user: any) => (
                          <CommandItem
                            value={user.name}
                            key={user.id}
                            onSelect={() => {
                              const isSelected = field.value.includes(user.id);
                              form.setValue(
                                "authorIds",
                                isSelected
                                  ? field.value.filter(
                                      (id: any) => id !== user.id
                                    )
                                  : [...field.value, user.id]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(user.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name}
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Publication"}
        </Button>
      </form>
    </Form>
  );
}
