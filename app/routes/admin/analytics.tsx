import { useState } from 'react';
import { BarChart3, Users, Coins, DollarSign } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Select } from '~/components/ui/Select';
import { Tabs } from '~/components/ui/Tabs';
import { StatCard } from '~/components/shared/StatCard';
import { BarChart, HorizontalBarChart } from '~/components/charts/BarChart';
import { LineChart } from '~/components/charts/LineChart';
import { DonutChart } from '~/components/charts/DonutChart';
import {
  analyticsStats,
  jobsOverTime,
  creditUsage,
  tenantUsage,
  testCaseUsage,
} from '~/data/analytics';
import { TIME_PERIOD_OPTIONS } from '~/lib/constants';
import { formatNumber, formatCurrency } from '~/lib/formatters';

export default function AdminAnalytics() {
  const [timePeriod, setTimePeriod] = useState<string>('30d');

  // Jobs Tab Content
  const JobsTab = (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Jobs Over Time
      </h3>
      <BarChart data={jobsOverTime} height={350} color="#6366f1" />
    </Card>
  );

  // Credits Tab Content
  const CreditsTab = (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Credit Usage
      </h3>
      <LineChart
        data={creditUsage}
        height={350}
        showSecondLine
        color1="#6366f1"
        color2="#10b981"
        label1="Consumed"
        label2="Purchased"
      />
    </Card>
  );

  // Tenants Tab Content
  const TenantsTab = (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Usage by Tenant
      </h3>
      <div className="flex justify-center">
        <DonutChart
          data={tenantUsage}
          height={350}
          innerRadius={70}
          outerRadius={120}
          colors={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']}
        />
      </div>
    </Card>
  );

  // Test Cases Tab Content
  const TestCasesTab = (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Most Used Test Cases
      </h3>
      <HorizontalBarChart data={testCaseUsage} height={350} color="#6366f1" />
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usage Analytics"
        subtitle="Monitor platform usage and performance metrics"
        action={
          <Select
            options={TIME_PERIOD_OPTIONS}
            value={timePeriod}
            onChange={(value) => setTimePeriod(value as string)}
            className="w-48"
          />
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs"
          value={formatNumber(analyticsStats.totalJobs)}
          icon={<BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          trend={{ value: analyticsStats.jobsChange, label: 'from last month' }}
        />
        <StatCard
          title="Active Users"
          value={formatNumber(analyticsStats.activeUsers)}
          icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
          trend={{ value: analyticsStats.usersChange, label: 'from last month' }}
        />
        <StatCard
          title="Credits Consumed"
          value={formatNumber(analyticsStats.creditsConsumed)}
          subtitle="This period"
          icon={<Coins className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(analyticsStats.revenue)}
          icon={<DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
          trend={{ value: analyticsStats.revenueChange, label: 'from last month' }}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs
        tabs={[
          { label: 'Jobs', content: JobsTab },
          { label: 'Credits', content: CreditsTab },
          { label: 'Tenants', content: TenantsTab },
          { label: 'Test Cases', content: TestCasesTab },
        ]}
      />
    </div>
  );
}
