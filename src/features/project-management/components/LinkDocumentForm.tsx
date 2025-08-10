import { z } from "zod";
import { FormInput } from "@/components/form/FormFields";
import { FormWrapper } from "@/components/form/FormWrapper";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

const linkSchema = z.object({
  title: z.string().min(1, "A title is required."),
  externalUrl: z.string().url("Please enter a valid URL."),
});
type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkDocumentFormProps {
  onSubmit: (values: LinkFormValues) => void;
  mutation: UseMutationResult<any, AxiosError, any, any>;
}

export function LinkDocumentForm({
  onSubmit,
  mutation,
}: LinkDocumentFormProps) {
  return (
    <FormWrapper
      schema={linkSchema}
      onSubmit={onSubmit}
      mutation={mutation}
      submitButtonText="Link Document"
      renderFields={() => (
        <>
          <FormInput
            name="title"
            label="Title"
            placeholder="e.g., Project Brief"
          />
          <FormInput
            name="externalUrl"
            label="URL"
            placeholder="https://example.com/document"
          />
        </>
      )}
    />
  );
}
