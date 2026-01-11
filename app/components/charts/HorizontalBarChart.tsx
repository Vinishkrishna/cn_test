import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '~/types';

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
}

export function HorizontalBarChart({
  data,
  height = 300,
  color = '#8b5cf6',
}: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          className="text-slate-500 dark:text-slate-400"
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={80}
          className="text-slate-500 dark:text-slate-400"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #fff)',
            borderColor: 'var(--tooltip-border, #e2e8f0)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[0, 4, 4, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

