import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '~/contexts/ThemeContext';
import type { ChartDataPoint } from '~/types';

export interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  className?: string;
}

export function BarChart({ data, height = 300, color = '#6366f1', className }: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#e5e7eb'}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  className?: string;
}

export function HorizontalBarChart({
  data,
  height = 300,
  color = '#6366f1',
  className,
}: HorizontalBarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#e5e7eb'}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
