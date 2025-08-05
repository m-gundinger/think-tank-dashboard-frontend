import { useForm, FormProvider } from "react-hook-form";
import { useApiResource } from "@/hooks/useApiResource";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormRichTextEditor,
  FormMultiSelectPopover,
  FormSelect,
} from "@/components/form/FormFields";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicationStatus } from "@/types/api";
import { useManagePublicationCategories } from "../api/useManagePublicationCategories";

const publicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  excerpt: z.string().optional(),
  authorIds: z
    .array(z.string().uuid())
    .min(1, "At least one author is required."),
  categoryIds: z.array(z.string().uuid()).optional(),
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
  const categoryResource = useManagePublicationCategories();

  const isEditMode = !!initialData;
  const createMutation = publicationResource.useCreate();
  const updateMutation = publicationResource.useUpdate();
  const mutation = isEditMode ? updateMutation : createMutation;
  const { data: usersData } = userResource.useGetAll({});
  const { data: categoriesData } = categoryResource.useGetAll();

  const methods = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      authorIds: [],
      categoryIds: [],
      status: PublicationStatus.DRAFT,
    },
  });
  useEffect(() => {
    if (isEditMode && initialData) {
      methods.reset({
        ...initialData,
        authorIds: initialData.authors?.map((a: any) => a.id) || [],
        categoryIds: initialData.categories?.map((c: any) => c.id) || [],
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

  const statusOptions = Object.values(PublicationStatus).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase(),
  }));

  const userOptions =
    usersData?.data?.map((user: any) => ({ id: user.id, name: user.name })) ||
    [];
  const categoryOptions =
    categoriesData?.data?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
    })) || [];

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="title"
            label="Title"
            placeholder="The Future of AI in Research..."
          />
          <FormInput
            name="slug"
            label="Slug"
            placeholder="the-future-of-ai-in-research"
          />
          <FormRichTextEditor name="excerpt" label="Excerpt (Optional)" />
          <FormMultiSelectPopover
            name="authorIds"
            label="Authors"
            placeholder="Select authors..."
            options={userOptions}
          />
          <FormMultiSelectPopover
            name="categoryIds"
            label="Categories"
            placeholder="Select categories..."
            options={categoryOptions}
          />
          <FormSelect
            name="status"
            label="Status"
            placeholder="Select status"
            options={statusOptions}
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