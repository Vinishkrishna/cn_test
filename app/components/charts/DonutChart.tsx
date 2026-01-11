import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '~/contexts/ThemeContext';
import type { ChartDataPoint } from '~/types';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export interface DonutChartProps {
  data: ChartDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  colors?: string[];
  showLegend?: boolean;
}

export function DonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  className,
  colors = COLORS,
  showLegend = true,
}: DonutChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span style={{ color: isDark ? '#d1d5db' : '#374151' }}>{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
