import { z } from "zod";
import { nameSchema } from "@/lib/schemas";
import { ResourceForm } from "@/components/shared/form/ResourceForm";
import { FormInput } from "@/components/shared/form/FormFields";

const categorySchema = z.object({
  name: nameSchema("Category"),
});

interface PublicationCategoryFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PublicationCategoryForm({
  initialData,
  onSuccess,
}: PublicationCategoryFormProps) {
  return (
    <ResourceForm
      schema={categorySchema}
      resourcePath="publications/categories"
      resourceKey={["publicationCategories"]}
      initialData={initialData}
      onSuccess={onSuccess}
      renderFields={() => (
        <FormInput
          name="name"
          label="Category Name"
          placeholder="e.g., Research"
        />
      )}
    />
  );
}