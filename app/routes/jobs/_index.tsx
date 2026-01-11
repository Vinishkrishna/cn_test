import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Play, MoreVertical, Eye, Check } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Select } from '~/components/ui/Select';
import { Modal } from '~/components/ui/Modal';
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
import { testCases } from '~/data/testCases';
import { JOB_STATUS_OPTIONS } from '~/lib/constants';
import { formatRelativeTime } from '~/lib/formatters';
import type { Job, JobStatus, TestCase } from '~/types';

const JOBS_STORAGE_KEY = 'aivalidate_jobs';

// Helper to get jobs from localStorage
function getStoredJobs(): Job[] {
  if (typeof window === 'undefined') return initialJobs;
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default jobs
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs));
    return initialJobs;
  } catch {
    return initialJobs;
  }
}

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setJobs(getStoredJobs());
  }, []);

  // Get test cases for a specific job
  const getJobTestCases = (job: Job): TestCase[] => {
    if (!job.testCaseIds || job.testCaseIds.length === 0) return [];
    return testCases.filter(tc => job.testCaseIds?.includes(tc.id));
  };

  const filteredJobs = jobs.filter((job) => {
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
                      <button
                        onClick={() => setViewingJob(job)}
                        className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline text-left"
                      >
                        {job.name}
                      </button>
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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingJob(job)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="View test cases"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Job Test Cases Modal */}
      <Modal
        isOpen={viewingJob !== null}
        onClose={() => setViewingJob(null)}
        title={viewingJob?.name || 'Job Details'}
        size="lg"
      >
        {viewingJob && (
          <div className="space-y-4">
            {/* Job Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
                <p className="font-medium text-gray-900 dark:text-white">{viewingJob.project}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <StatusBadge status={viewingJob.status} />
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <ProgressBar value={viewingJob.progress} className="w-20" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{viewingJob.progress}%</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                {viewingJob.risk ? <RiskBadge risk={viewingJob.risk} /> : <span className="text-gray-500">-</span>}
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Credits</p>
                <p className="font-medium text-gray-900 dark:text-white">{viewingJob.credits}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatRelativeTime(viewingJob.created)}</p>
              </div>
            </div>

            {/* Test Cases */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Selected Test Cases ({getJobTestCases(viewingJob).length})
              </h3>
              {getJobTestCases(viewingJob).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                  No test cases associated with this job.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getJobTestCases(viewingJob).map((tc) => (
                    <div
                      key={tc.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded bg-indigo-600 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tc.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {tc.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                          {tc.complexity} units
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                          {tc.modality}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setViewingJob(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
