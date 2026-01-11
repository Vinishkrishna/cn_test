import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus, Play, MoreVertical, FolderOpen, ChevronRight, Check, AlertCircle, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
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
import { projects as initialProjects } from '~/data/projects';
import { jobs as initialJobs } from '~/data/jobs';
import { testCases, euAiActFolder } from '~/data/testCases';
import { formatRelativeTime } from '~/lib/formatters';
import { cn } from '~/lib/cn';
import type { Project, Job, TestCase } from '~/types';

const PROJECTS_STORAGE_KEY = 'aivalidate_projects';
const JOBS_STORAGE_KEY = 'aivalidate_jobs';

const createJobSchema = z.object({
  name: z.string().min(1, 'Job name is required'),
});

type CreateJobForm = z.infer<typeof createJobSchema>;

type CreateJobStep = 'details' | 'folder' | 'testcases';

// Helper to get projects from localStorage
function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return initialProjects;
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  } catch {
    return initialProjects;
  }
}

// Helper to get jobs from localStorage
function getStoredJobs(): Job[] {
  if (typeof window === 'undefined') return initialJobs;
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs));
    return initialJobs;
  } catch {
    return initialJobs;
  }
}

// Helper to save jobs to localStorage
function saveJobs(jobs: Job[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  }
}

// Helper to save projects to localStorage
function saveProjects(projects: Project[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [createJobStep, setCreateJobStep] = useState<CreateJobStep>('details');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [pendingJobData, setPendingJobData] = useState<{ name: string } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setProjects(getStoredProjects());
    setAllJobs(getStoredJobs());
  }, []);

  const project = projects.find((p) => p.id === projectId);
  const projectJobs = allJobs.filter((j) => j.projectId === projectId);

  // Get test cases for a specific job
  const getJobTestCases = (job: Job): TestCase[] => {
    if (!job.testCaseIds || job.testCaseIds.length === 0) return [];
    return testCases.filter(tc => job.testCaseIds?.includes(tc.id));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema),
  });

  const resetCreateJobFlow = () => {
    setIsCreateJobModalOpen(false);
    setCreateJobStep('details');
    setSelectedTestCases([]);
    setPendingJobData(null);
    reset();
  };

  const onJobDetailsSubmit = (data: CreateJobForm) => {
    setPendingJobData({ name: data.name });
    setCreateJobStep('folder');
  };

  const handleFolderSelect = () => {
    setCreateJobStep('testcases');
  };

  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id) ? prev.filter((tc) => tc !== id) : [...prev, id]
    );
  };

  const handleSaveJob = () => {
    if (!pendingJobData || !project) return;

    const selectedTestCaseObjects = testCases.filter(tc => selectedTestCases.includes(tc.id));
    const totalComplexity = selectedTestCaseObjects.reduce((acc, tc) => acc + tc.complexity, 0);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      name: pendingJobData.name,
      project: project.name,
      projectId: project.id,
      status: 'pending',
      risk: null,
      tests: { passed: 0, total: selectedTestCases.length },
      credits: totalComplexity * 2,
      created: new Date().toISOString(),
      progress: 0,
      testCaseIds: selectedTestCases,
    };

    const updatedJobs = [newJob, ...allJobs];
    setAllJobs(updatedJobs);
    saveJobs(updatedJobs);

    // Update project status to active and lastValidation
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, status: 'active' as const, jobsCount: projectJobs.length + 1 }
        : p
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    resetCreateJobFlow();
  };

  const handleExecuteProject = async () => {
    if (projectJobs.length === 0) {
      setExecutionMessage('No jobs to execute in this project.');
      setTimeout(() => setExecutionMessage(null), 3000);
      return;
    }

    setIsExecuting(true);
    setExecutionMessage('Executing all jobs...');

    // Simulate execution - update all pending jobs to running then completed
    const updatedJobs = allJobs.map(job => {
      if (job.projectId === projectId && (job.status === 'pending' || job.status === 'failed')) {
        return {
          ...job,
          status: 'completed' as const,
          progress: 100,
          risk: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
          tests: { passed: job.tests.total - Math.floor(Math.random() * 2), total: job.tests.total },
        };
      }
      return job;
    });

    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAllJobs(updatedJobs);
    saveJobs(updatedJobs);

    // Update project lastValidation
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, lastValidation: new Date().toISOString().split('T')[0], status: 'active' as const }
        : p
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    setIsExecuting(false);
    setExecutionMessage('All jobs executed successfully!');
    setTimeout(() => setExecutionMessage(null), 3000);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Project not found
        </h2>
        <Link to="/projects" className="text-indigo-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <PageHeader
        title={project.name}
        subtitle={project.description || 'No description'}
        action={
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreateJobModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleExecuteProject}
              disabled={isExecuting || projectJobs.length === 0}
            >
              <Play className="h-4 w-4" />
              {isExecuting ? 'Executing...' : 'Execute Project'}
            </Button>
          </div>
        }
      />

      {/* Execution Message */}
      {executionMessage && (
        <div className={cn(
          'p-4 rounded-lg flex items-center gap-2',
          executionMessage.includes('successfully') 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
        )}>
          <AlertCircle className="h-4 w-4" />
          {executionMessage}
        </div>
      )}

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            AI System Type
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            {project.aiSystemType.toUpperCase()}
          </span>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
          <StatusBadge status={project.status} />
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Jobs
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {projectJobs.length}
          </p>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Jobs
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Job Name</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Progress</TableCell>
              <TableCell isHeader>Risk</TableCell>
              <TableCell isHeader>Test Cases</TableCell>
              <TableCell isHeader>Created</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectJobs.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={7}>
                  No jobs in this project yet. Click "Create Job" to add one.
                </TableCell>
              </TableRow>
            ) : (
              projectJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <button
                      onClick={() => setViewingJob(job)}
                      className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline text-left"
                    >
                      {job.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={job.progress} className="w-20" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {job.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {job.risk ? <RiskBadge risk={job.risk} /> : '-'}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {job.testCaseIds?.length || job.tests.total} tests
                    </span>
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

      {/* Create Job Modal */}
      <Modal
        isOpen={isCreateJobModalOpen}
        onClose={resetCreateJobFlow}
        title={
          createJobStep === 'details' 
            ? 'Create Job' 
            : createJobStep === 'folder' 
            ? 'Select Regulation' 
            : 'Select Test Cases'
        }
        size={createJobStep === 'testcases' ? 'lg' : 'md'}
      >
        {/* Step 1: Job Details */}
        {createJobStep === 'details' && (
          <form onSubmit={handleSubmit(onJobDetailsSubmit)} className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
              <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
            </div>
            <Input
              label="Job Name"
              placeholder="Enter job name"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={resetCreateJobFlow}>
                Cancel
              </Button>
              <Button type="submit">Save & Continue</Button>
            </div>
          </form>
        )}

        {/* Step 2: Select Regulation Folder */}
        {createJobStep === 'folder' && (
          <div className="space-y-4">
            <button
              onClick={handleFolderSelect}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors',
                'border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {euAiActFolder.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {euAiActFolder.testCases.length} test cases
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setCreateJobStep('details')}>
                Back
              </Button>
              <Button variant="outline" onClick={resetCreateJobFlow}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Test Cases */}
        {createJobStep === 'testcases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTestCases.length} test case(s) selected
              </p>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testCases.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => toggleTestCase(tc.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left',
                    selectedTestCases.includes(tc.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center',
                      selectedTestCases.includes(tc.id)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {selectedTestCases.includes(tc.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
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
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setCreateJobStep('folder')}>
                Back
              </Button>
              <Button variant="outline" onClick={resetCreateJobFlow}>
                Cancel
              </Button>
              <Button onClick={handleSaveJob} disabled={selectedTestCases.length === 0}>
                Save Job
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
