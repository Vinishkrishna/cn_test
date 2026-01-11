import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '~/contexts/ThemeContext';
import type { ChartDataPoint } from '~/types';

export interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showSecondLine?: boolean;
  color1?: string;
  color2?: string;
  label1?: string;
  label2?: string;
  className?: string;
}

export function LineChart({
  data,
  height = 300,
  showSecondLine = false,
  color1 = '#6366f1',
  color2 = '#10b981',
  label1 = 'Value 1',
  label2 = 'Value 2',
  className,
}: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          {showSecondLine && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            name={label1}
            stroke={color1}
            strokeWidth={2}
            dot={{ fill: color1, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          {showSecondLine && (
            <Line
              type="monotone"
              dataKey="value2"
              name={label2}
              stroke={color2}
              strokeWidth={2}
              dot={{ fill: color2, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
