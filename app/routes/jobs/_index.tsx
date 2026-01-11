import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Play, MoreVertical } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Select } from '~/components/ui/Select';
import { SearchInput } from '~/components/shared/SearchInput';
import { StatusBadge } from '~/components/shared/StatusBadge';
import { RiskBadge } from '~/components/shared/RiskBadge';
import { ProgressBar } from '~/components/ui/ProgressBar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { jobs as initialJobs } from '~/data/jobs';
import { JOB_STATUS_OPTIONS } from '~/lib/constants';
import { formatRelativeTime } from '~/lib/formatters';
import type { JobStatus } from '~/types';

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const filteredJobs = initialJobs.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleExecuteJob = () => {
    // Execute selected jobs - placeholder for backend integration
    console.log('Executing jobs:', selectedJobs);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Manage and execute validation jobs"
        action={
          <div className="flex items-center gap-3">
            {selectedJobs.length > 0 && (
              <Button variant="secondary" onClick={handleExecuteJob}>
                <Play className="h-4 w-4" />
                Execute Job ({selectedJobs.length})
              </Button>
            )}
            <Button asChild>
              <Link to="/jobs/create">
                <Plus className="h-4 w-4" />
                Create Job
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SearchInput
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-sm"
        />
        <Select
          options={JOB_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as string)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Jobs Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedJobs(filteredJobs.map((j) => j.id));
                    } else {
                      setSelectedJobs([]);
                    }
                  }}
                  checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                />
              </TableCell>
              <TableCell isHeader>Job</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Progress</TableCell>
              <TableCell isHeader>Risk</TableCell>
              <TableCell isHeader>Credits</TableCell>
              <TableCell isHeader>Created</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={8}>
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => toggleJobSelection(job.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.project}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        value={job.progress}
                        className="w-20"
                        color={
                          job.status === 'failed'
                            ? 'red'
                            : job.status === 'completed'
                            ? 'green'
                            : 'indigo'
                        }
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {job.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={job.risk} />
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">{job.credits}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(job.created)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
