import { useForm, FormProvider } from "react-hook-form";
import { useApiResource } from "@/hooks/useApiResource";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormRichTextEditor,
  FormMultiSelectPopover,
} from "@/components/form/FormFields";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicationStatus } from "@/types/api";

const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  excerpt: z.string().optional(),
  authorIds: z.array(z.string().uuid()),
  status: z.nativeEnum(PublicationStatus),
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
  const publicationResource = useApiResource("publications", ["publications"]);
  const userResource = useApiResource("admin/users", ["users"]);
  const isEditMode = !!initialData;
  const createMutation = publicationResource.useCreate();
  const updateMutation = publicationResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const { data: usersData } = userResource.useGetAll({});

  const methods = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      authorIds: [],
      status: PublicationStatus.DRAFT,
    },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        authorIds: initialData.authors?.map((a: any) => a.id) || [],
      });
    }
  }, [initialData, isEditMode, methods]);
  async function onSubmit(values: PublicationFormValues) {
    if (isEditMode) {
      await updateMutation.mutateAsync(
        { id: initialData.id, data: values },
        { onSuccess }
      );
    } else {
      await createMutation.mutateAsync(values, {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="title"
            label="Title"
            placeholder="The Future of AI in Research..."
          />
          <FormRichTextEditor name="excerpt" label="Excerpt (Optional)" />
          <FormMultiSelectPopover
            name="authorIds"
            label="Authors"
            placeholder="Select authors..."
            options={usersData?.data || []}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Publication"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}