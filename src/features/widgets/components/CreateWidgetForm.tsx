import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Open Tasks Counter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a widget type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(WidgetType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
    </FormProvider>
  );
}
