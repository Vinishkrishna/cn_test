import { useState } from 'react';
import { FileText, Download, Clock, BarChart3 } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Modal } from '~/components/ui/Modal';
import { Select } from '~/components/ui/Select';
import { StatCard } from '~/components/shared/StatCard';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { reports, reportStats } from '~/data/reports';
import { projects } from '~/data/projects';
import { formatDate, formatRelativeTime } from '~/lib/formatters';
import type { ReportType } from '~/types';

const reportTypeBadgeVariant: Record<ReportType, 'default' | 'info' | 'success'> = {
  compliance: 'success',
  audit: 'info',
  summary: 'default',
};

export default function Reports() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const handleGenerate = () => {
    console.log('Generating report for project:', selectedProjectId);
    setIsGenerateModalOpen(false);
    setSelectedProjectId('');
  };

  const handleCancel = () => {
    setIsGenerateModalOpen(false);
    setSelectedProjectId('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and download compliance reports"
        action={
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Reports Generated"
          value={reportStats.reportsGenerated}
          subtitle="This month"
          icon={<BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        />
        <StatCard
          title="Audit Reports"
          value={reportStats.auditReports}
          subtitle="Ready for review"
          icon={<FileText className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
        <StatCard
          title="Last Generated"
          value={formatRelativeTime(reportStats.lastGenerated.date)}
          subtitle={reportStats.lastGenerated.name}
          icon={<Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
        />
      </div>

      {/* Recent Reports Table */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Reports
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Report</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Project</TableCell>
              <TableCell isHeader>Generated</TableCell>
              <TableCell isHeader>Size</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={6}>
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <span className="font-medium">{report.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reportTypeBadgeVariant[report.type]}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">{report.project}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(report.generated)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">{report.size}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={handleCancel}
        title="Generate Report"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Select Project"
            options={projectOptions}
            value={selectedProjectId}
            onChange={(value) => setSelectedProjectId(value as string)}
            placeholder="Choose a project..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!selectedProjectId}>
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
