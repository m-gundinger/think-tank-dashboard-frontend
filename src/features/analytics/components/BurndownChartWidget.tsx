import {
  ChartContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "@/components/ui/recharts";
import { useGetWidgetData } from "../api/useGetWidgetData";

export function BurndownChartWidget({ widget }: any) {
  const { data, isLoading } = useGetWidgetData(widget.dashboardId, widget.id);
  if (isLoading) return <div>Loading...</div>;

  const payload = data?.payload;
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={payload?.points}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}