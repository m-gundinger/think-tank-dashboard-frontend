import {
  ChartContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "@/components/ui/recharts";
import { useGetWidgetData } from "../api/useGetWidgetData";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function LeadCycleTimeChartWidget({ widget }: any) {
  const { data, isLoading } = useGetWidgetData(widget.dashboardId, widget.id);

  if (isLoading) return <Skeleton className="h-full w-full" />;

  const payload = data?.payload;
  const chartData = (payload?.points || []).map((p: any) => ({
    ...p,
    completedDate: format(new Date(p.completedAt), "MMM d"),
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No completed tasks in the selected range.
        </p>
      </div>
    );
  }

  return (
    <ChartContainer className="h-full w-full">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="completedDate"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}h`}
            label={{
              value: "Lead Time (Hours)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              borderColor: "hsl(var(--border))",
            }}
            formatter={(value, _name, props) => [
              `${value} hours`,
              `Task: ${props.payload.taskTitle}`,
            ]}
          />
          <Bar
            dataKey="leadTime"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}