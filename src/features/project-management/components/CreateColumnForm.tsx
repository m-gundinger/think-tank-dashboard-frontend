import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormFields";
import { useUpdateView } from "../api/useUpdateView";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Column name is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateColumnFormProps {
  workspaceId: string;
  view: View;
  onSuccess?: () => void;
}

export function CreateColumnForm({
  workspaceId,
  view,
  onSuccess,
}: CreateColumnFormProps) {
  const updateViewMutation = useUpdateView(workspaceId, view.projectId!);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const existingColumns = view.columns.map((c) => ({
      name: c.name,
      order: c.order,
    }));

    const newColumn = {
      name: values.name,
      order: existingColumns.length,
    };

    updateViewMutation.mutate(
      {
        viewId: view.id,
        viewData: {
          columns: [...existingColumns, newColumn],
        },
      },
      {
        onSuccess: () => {
          methods.reset();
          onSuccess?.();
        },
      }
    );
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          <FormInput
            name="name"
            label="List Name"
            placeholder="e.g., Blocked"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={updateViewMutation.isPending}
          >
            {updateViewMutation.isPending ? "Adding..." : "Add List"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
