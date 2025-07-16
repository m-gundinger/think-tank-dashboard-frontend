"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex aspect-video w-full items-center justify-center [&>div]:size-full",
      className
    )}
    {...props}
  />
));
ChartContainer.displayName = "ChartContainer";

export {
  ChartContainer,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  BarChart,
  Bar,
};
