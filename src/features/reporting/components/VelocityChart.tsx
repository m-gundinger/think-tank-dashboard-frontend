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
import { Sprint } from "@/features/sprints/sprint.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
interface VelocityChartProps {
  sprints: Sprint[];
}

export function VelocityChart({ sprints }: VelocityChartProps) {
  const chartData = sprints
    .filter(
      (sprint) =>
        sprint.status === "COMPLETED" && sprint.completedStoryPoints != null
    )
    .map((sprint) => ({
      name: sprint.name,
      Velocity: sprint.completedStoryPoints,
    }));
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Velocity</CardTitle>
          <CardDescription>
            Complete sprints with story points to see your team's velocity over
            time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[200px] items-center justify-center">
            Not enough data to display chart.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Velocity</CardTitle>
        <CardDescription>
          Story points completed in each sprint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Bar
                dataKey="Velocity"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
