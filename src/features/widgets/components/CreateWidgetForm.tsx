import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "@/components/form/FormFields";
import { useCreateWidget } from "../api/useCreateWidget";
import { StatsCounterConfigFields } from "./config-fields/StatsCounterConfigFields";
import { TaskListConfigFields } from "./config-fields/TaskListConfigFields";
import { BurndownChartConfigFields } from "./config-fields/BurndownChartConfigFields";
import { TimeTrackingReportConfigFields } from "./config-fields/TimeTrackingReportConfigFields";
import { WidgetType } from "@/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const widgetSchema = z.object({
  title: z.string().min(1, "Widget title is required."),
  type: z.nativeEnum(WidgetType),
  config: z.any(),
  layout: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }),
  dashboardId: z.string().uuid(),
});
type WidgetFormValues = z.infer<typeof widgetSchema>;

interface CreateWidgetFormProps {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
  onSuccess?: () => void;
}

const configFieldsMap: Record<string, React.FC> = {
  STATS_COUNTER: StatsCounterConfigFields,
  TASK_LIST: TaskListConfigFields,
  BURNDOWN_CHART: BurndownChartConfigFields,
  TIME_TRACKING_REPORT: TimeTrackingReportConfigFields,
};

function getDefaultConfig(type: WidgetType) {
  switch (type) {
    case WidgetType.STATS_COUNTER:
      return { label: "", filter: {} };
    case WidgetType.TASK_LIST:
      return { limit: 10, filter: {} };
    case WidgetType.BURNDOWN_CHART:
      const today = new Date();
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);
      return { startDate: twoWeeksAgo, endDate: today, unit: "task_count" };
    case WidgetType.TIME_TRACKING_REPORT:
      return { userIds: [] };
    default:
      return {};
  }
}

export function CreateWidgetForm({
  workspaceId,
  projectId,
  dashboardId,
  onSuccess,
}: CreateWidgetFormProps) {
  const [step, setStep] = useState(1);
  const createMutation = useCreateWidget(workspaceId, projectId, dashboardId);

  const methods = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      title: "",
      type: WidgetType.STATS_COUNTER,
      config: getDefaultConfig(WidgetType.STATS_COUNTER),
      layout: { x: 0, y: 0, w: 4, h: 5 },
      dashboardId,
    },
  });
  const selectedType = methods.watch("type") as string;
  const ConfigFields = configFieldsMap[selectedType];

  function handleNext() {
    methods.trigger(["title", "type"]).then((isValid) => {
      if (isValid) {
        const currentType = methods.getValues("type") as WidgetType;
        methods.setValue("config", getDefaultConfig(currentType));
        setStep(2);
      }
    });
  }

  async function onSubmit(values: WidgetFormValues) {
    await createMutation.mutateAsync(values, {
      onSuccess: () => {
        methods.reset();
        onSuccess?.();
      },
    });
  }

  const widgetTypeOptions = Object.values(WidgetType).map((type) => ({
    value: type,
    label: type.replace(/_/g, " "),
  }));

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <FormInput
                name="title"
                label="Widget Title"
                placeholder="e.g., Open Tasks Counter"
              />
              <FormSelect
                name="type"
                label="Widget Type"
                placeholder="Select a widget type"
                options={widgetTypeOptions}
              />
              <Button type="button" onClick={handleNext} className="w-full">
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {ConfigFields && <ConfigFields />}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Widget"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}
