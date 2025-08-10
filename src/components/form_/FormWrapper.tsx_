import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

interface FormWrapperProps<Schema extends z.ZodType<any, any>> {
  schema: Schema;
  onSubmit: (values: z.output<Schema>) => void;
  mutation: UseMutationResult<any, AxiosError, any, any>;
  renderFields: (
    form: ReturnType<typeof useForm<z.input<Schema>>>
  ) => React.ReactNode;
  submitButtonText?: string;
  className?: string;
  defaultValues?: Partial<z.input<Schema>>;
}

export function FormWrapper<Schema extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  mutation,
  renderFields,
  submitButtonText = "Save Changes",
  className,
  defaultValues,
}: FormWrapperProps<Schema>) {
  const methods = useForm<z.input<Schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as z.input<Schema>,
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues as z.input<Schema>);
    }
  }, [defaultValues, methods]);

  const handleSubmit: SubmitHandler<z.input<Schema>> = (values) => {
    onSubmit(values as unknown as z.output<Schema>);
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className={className || "space-y-4"}
        >
          {renderFields(methods)}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : submitButtonText}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
