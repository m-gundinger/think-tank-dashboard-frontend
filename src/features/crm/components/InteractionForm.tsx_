import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormTextarea,
  FormSelect,
  FormDatePicker,
} from "@/components/form/FormFields";
import { useManageInteractions } from "../api/useManageInteractions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InteractionType } from "@/types/api";

const interactionSchema = z.object({
  type: z.nativeEnum(InteractionType),
  notes: z.string().min(1, "Notes are required."),
  date: z.date(),
});

type InteractionFormValues = z.infer<typeof interactionSchema>;

interface InteractionFormProps {
  personId?: string;
  organizationId?: string;
  dealId?: string;
  onSuccess?: () => void;
}

export function InteractionForm({
  personId,
  organizationId,
  dealId,
  onSuccess,
}: InteractionFormProps) {
  const { useCreate } = useManageInteractions();
  const createMutation = useCreate();

  const methods = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      type: InteractionType.MEETING,
      notes: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: InteractionFormValues) {
    const payload = { ...values, personId, organizationId, dealId };
    await createMutation.mutateAsync(payload, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  }

  const typeOptions = Object.values(InteractionType).map((t) => ({
    value: t,
    label: t.charAt(0) + t.slice(1).toLowerCase(),
  }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            name="type"
            label="Interaction Type"
            options={typeOptions}
            placeholder="Select type"
          />
          <FormDatePicker name="date" label="Date of Interaction" />
          <FormTextarea
            name="notes"
            label="Notes"
            placeholder="Log details about the interaction..."
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Logging..." : "Log Interaction"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}