import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const linkSchema = z.object({
  title: z.string().min(1, "A title is required."),
  externalUrl: z.string().url("Please enter a valid URL."),
});
type LinkFormValues = z.infer<typeof linkSchema>;

interface LinkDocumentFormProps {
  onSubmit: (values: LinkFormValues) => Promise<void>;
  isPending: boolean;
}

export function LinkDocumentForm({
  onSubmit,
  isPending,
}: LinkDocumentFormProps) {
  const methods = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      externalUrl: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Linking..." : "Link Document"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
