import { z } from "zod";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import {
  FormInput,
  FormRichTextEditor,
  FormMultiSelectPopover,
  FormSelect,
} from "@/components/shared/form/FormFields";
import { PublicationStatus } from "@/types/api";
import { useManagePublicationCategories } from "../api/useManagePublicationCategories";
import { useManageUsers } from "../../admin/users/api/useManageUsers";

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

interface PublicationFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function CreatePublicationForm({
  initialData,
  onSuccess,
}: PublicationFormProps) {
  const { useGetAll: useGetAllUsers } = useManageUsers();
  const { useGetAll: useGetAllCategories } = useManagePublicationCategories();
  const { data: usersData } = useGetAllUsers({});
  const { data: categoriesData } = useGetAllCategories();

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

  const processedInitialData = initialData
    ? {
        ...initialData,
        authorIds: initialData.authors?.map((a: any) => a.id) || [],
        categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      }
    : {
        authorIds: [],
        categoryIds: [],
        status: PublicationStatus.DRAFT,
      };

  return (
    <ResourceForm
      schema={publicationSchema}
      resourcePath="publications"
      resourceKey={["publications"]}
      initialData={processedInitialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <>
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
        </>
      )}
    />
  );
}