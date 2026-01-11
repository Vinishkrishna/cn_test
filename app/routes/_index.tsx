import { Link } from 'react-router';
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Coins,
  Plus,
  FileText,
  ArrowRight,
  Play,
} from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { StatCard } from '~/components/shared/StatCard';
import { StatusBadge } from '~/components/shared/StatusBadge';
import { RiskBadge } from '~/components/shared/RiskBadge';
import { DonutChart } from '~/components/charts/DonutChart';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { dashboardStats, recentJobs, riskSummary } from '~/data/dashboard';
import { formatNumber, formatRelativeTime } from '~/lib/formatters';

export default function Dashboard() {
  const riskChartData = [
    { name: 'Low Risk', value: riskSummary.lowRisk },
    { name: 'Medium Risk', value: riskSummary.mediumRisk },
    { name: 'High Risk', value: riskSummary.highRisk },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="AI Validation & Compliance overview"
        action={
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/reports">
                <FileText className="h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button asChild>
              <Link to="/jobs/create">
                <Play className="h-4 w-4" />
                Create Job
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs Run"
          value={formatNumber(dashboardStats.totalJobsRun)}
          subtitle="All time validations"
          icon={<BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          trend={{ value: dashboardStats.percentChange, label: 'from last month' }}
        />
        <StatCard
          title="Jobs Completed"
          value={formatNumber(dashboardStats.jobsCompleted)}
          subtitle={`${dashboardStats.successRate}% success rate`}
          icon={<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
          valueColor="success"
        />
        <StatCard
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          subtitle="Requires attention"
          icon={<AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
          valueColor="warning"
        />
        <StatCard
          title="Credits Remaining"
          value={formatNumber(dashboardStats.creditsRemaining)}
          subtitle={`Est. ${dashboardStats.estimatedJobsRemaining} jobs remaining`}
          icon={<Coins className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="xl:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Jobs
              </h2>
              <Link
                to="/jobs"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Job Name</TableCell>
                  <TableCell isHeader>Project</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Risk</TableCell>
                  <TableCell isHeader>Tests</TableCell>
                  <TableCell isHeader>Created</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.slice(0, 5).map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <span className="font-medium">{job.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 dark:text-gray-400">
                        {job.project}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>
                      <RiskBadge risk={job.risk} />
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 dark:text-gray-300">
                        {job.tests.passed}/{job.tests.total}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(job.created)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Compliance Risk Summary */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Compliance Risk Summary
            </h2>
            <DonutChart
              data={riskChartData}
              height={280}
              innerRadius={50}
              outerRadius={90}
              colors={['#10b981', '#f59e0b', '#ef4444']}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {riskSummary.lowRisk}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-600 dark:text-gray-400">Medium Risk</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {riskSummary.mediumRisk}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-600 dark:text-gray-400">High Risk</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {riskSummary.highRisk}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
