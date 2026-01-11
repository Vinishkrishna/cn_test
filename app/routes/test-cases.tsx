import { useState, useEffect } from 'react';
import { FileText, Type, Image, Video, ExternalLink } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Select } from '~/components/ui/Select';
import { Input } from '~/components/ui/Input';
import { Badge } from '~/components/ui/Badge';
import { Modal } from '~/components/ui/Modal';
import { SearchInput } from '~/components/shared/SearchInput';
import { StatusBadge } from '~/components/shared/StatusBadge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { testCases } from '~/data/testCases';
import { projects as initialProjects } from '~/data/projects';
import { jobs as initialJobs } from '~/data/jobs';
import { MODALITY_OPTIONS, SOURCE_OPTIONS } from '~/lib/constants';
import { cn } from '~/lib/cn';
import type { Modality, Project, Job } from '~/types';

const PROJECTS_STORAGE_KEY = 'aivalidate_projects';
const JOBS_STORAGE_KEY = 'aivalidate_jobs';

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

// Helper to save projects
function saveProjects(projects: Project[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }
}

// Helper to save jobs
function saveJobs(jobs: Job[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  }
}

const modalityIcons: Record<Modality, React.ComponentType<{ className?: string }>> = {
  text: Type,
  image: Image,
  video: Video,
};

export default function TestCases() {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Project/Job selection state
  const [projects, setProjects] = useState<Project[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [newJobName, setNewJobName] = useState('');
  const [useNewProject, setUseNewProject] = useState(false);
  const [useNewJob, setUseNewJob] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setProjects(getStoredProjects());
    setJobs(getStoredJobs());
  }, []);

  // Get jobs for selected project
  const projectJobs = selectedProjectId 
    ? jobs.filter(j => j.projectId === selectedProjectId)
    : [];

  const filteredTestCases = testCases.filter((tc) => {
    const matchesSearch =
      tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = modalityFilter === 'all' || tc.modality === modalityFilter;
    const matchesSource = sourceFilter === 'all' || tc.source === sourceFilter;
    return matchesSearch && matchesModality && matchesSource;
  });

  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id) ? prev.filter((tc) => tc !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedTestCases.length > 0) {
      setIsSaveModalOpen(true);
    }
  };

  const resetSaveModal = () => {
    setIsSaveModalOpen(false);
    setSelectedProjectId('');
    setNewProjectName('');
    setSelectedJobId('');
    setNewJobName('');
    setUseNewProject(false);
    setUseNewJob(false);
  };

  const handleConfirmSave = () => {
    let targetProjectId = selectedProjectId;
    let targetProjectName = '';
    let targetJobId = selectedJobId;

    // Create new project if needed
    if (useNewProject && newProjectName.trim()) {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: newProjectName.trim(),
        description: '',
        aiSystemType: 'llm',
        status: 'active',
        jobsCount: 0,
        lastValidation: null,
      };
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
      targetProjectId = newProject.id;
      targetProjectName = newProject.name;
    } else {
      const existingProject = projects.find(p => p.id === targetProjectId);
      targetProjectName = existingProject?.name || '';
    }

    if (!targetProjectId) return;

    // Calculate complexity for selected test cases
    const selectedTestCaseObjects = testCases.filter(tc => selectedTestCases.includes(tc.id));
    const totalComplexity = selectedTestCaseObjects.reduce((acc, tc) => acc + tc.complexity, 0);

    // Create new job or update existing
    if (useNewJob && newJobName.trim()) {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        name: newJobName.trim(),
        project: targetProjectName,
        projectId: targetProjectId,
        status: 'pending',
        risk: null,
        tests: { passed: 0, total: selectedTestCases.length },
        credits: totalComplexity * 2,
        created: new Date().toISOString(),
        progress: 0,
        testCaseIds: selectedTestCases,
      };
      const updatedJobs = [newJob, ...jobs];
      setJobs(updatedJobs);
      saveJobs(updatedJobs);
    } else if (targetJobId) {
      // Update existing job with new test cases
      const updatedJobs = jobs.map(job => {
        if (job.id === targetJobId) {
          const existingTestCaseIds = job.testCaseIds || [];
          const mergedTestCaseIds = [...new Set([...existingTestCaseIds, ...selectedTestCases])];
          const mergedTestCases = testCases.filter(tc => mergedTestCaseIds.includes(tc.id));
          const newComplexity = mergedTestCases.reduce((acc, tc) => acc + tc.complexity, 0);
          return {
            ...job,
            testCaseIds: mergedTestCaseIds,
            tests: { ...job.tests, total: mergedTestCaseIds.length },
            credits: newComplexity * 2,
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      saveJobs(updatedJobs);
    }

    // Update project status
    const updatedProjects = projects.map(p => 
      p.id === targetProjectId 
        ? { ...p, status: 'active' as const }
        : p
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedTestCases([]);
      resetSaveModal();
    }, 1500);
  };

  const canSave = () => {
    const hasProject = useNewProject ? newProjectName.trim() !== '' : selectedProjectId !== '';
    const hasJob = useNewJob ? newJobName.trim() !== '' : selectedJobId !== '';
    return hasProject && hasJob;
  };

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const jobOptions = projectJobs.map((j) => ({
    value: j.id,
    label: j.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Cases"
        subtitle="Browse and select validation test cases"
        action={
          selectedTestCases.length > 0 && (
            <Button onClick={handleSave}>
              Save Selected ({selectedTestCases.length})
            </Button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <SearchInput
          placeholder="Search test cases..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-sm"
        />
        <Select
          options={MODALITY_OPTIONS}
          value={modalityFilter}
          onChange={(value) => setModalityFilter(value as string)}
          className="w-full sm:w-48"
        />
        <Select
          options={SOURCE_OPTIONS}
          value={sourceFilter}
          onChange={(value) => setSourceFilter(value as string)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Test Cases Table */}
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
                      setSelectedTestCases(filteredTestCases.map((tc) => tc.id));
                    } else {
                      setSelectedTestCases([]);
                    }
                  }}
                  checked={
                    selectedTestCases.length === filteredTestCases.length &&
                    filteredTestCases.length > 0
                  }
                />
              </TableCell>
              <TableCell isHeader>Test Case</TableCell>
              <TableCell isHeader>Source</TableCell>
              <TableCell isHeader>Modality</TableCell>
              <TableCell isHeader>Complexity</TableCell>
              <TableCell isHeader>Tags</TableCell>
              <TableCell isHeader>Documents</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestCases.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={8}>
                  No test cases found
                </TableCell>
              </TableRow>
            ) : (
              filteredTestCases.map((tc) => {
                const ModalityIcon = modalityIcons[tc.modality];
                return (
                  <TableRow key={tc.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedTestCases.includes(tc.id)}
                        onChange={() => toggleTestCase(tc.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium">{tc.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {tc.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tc.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ModalityIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="capitalize">{tc.modality}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 dark:text-gray-300">
                        {tc.complexity} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {tc.tags.length > 2 && (
                          <Badge size="sm" variant="outline">
                            +{tc.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href="#"
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                      >
                        {tc.document}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tc.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Save Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={resetSaveModal}
        title="Save Test Cases"
        size="md"
      >
        <div className="space-y-4">
          {saveSuccess ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Test Cases Saved!</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {selectedTestCases.length} test case{selectedTestCases.length > 1 ? 's' : ''} saved successfully.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Save {selectedTestCases.length} selected test case{selectedTestCases.length > 1 ? 's' : ''} to a project and job.
              </p>

              {/* Project Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="projectType"
                      checked={!useNewProject}
                      onChange={() => setUseNewProject(false)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Existing Project</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="projectType"
                      checked={useNewProject}
                      onChange={() => {
                        setUseNewProject(true);
                        setSelectedProjectId('');
                        setSelectedJobId('');
                        setUseNewJob(true);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">New Project</span>
                  </label>
                </div>
                {useNewProject ? (
                  <Input
                    label="Project Name"
                    placeholder="Enter new project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                ) : (
                  <Select
                    label="Select Project"
                    options={projectOptions}
                    value={selectedProjectId}
                    onChange={(value) => {
                      setSelectedProjectId(value as string);
                      setSelectedJobId('');
                    }}
                    placeholder="Choose a project..."
                  />
                )}
              </div>

              {/* Job Selection */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jobType"
                      checked={!useNewJob}
                      onChange={() => setUseNewJob(false)}
                      disabled={useNewProject || projectJobs.length === 0}
                      className="text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <span className={cn(
                      "text-sm",
                      (useNewProject || projectJobs.length === 0) 
                        ? "text-gray-400 dark:text-gray-500" 
                        : "text-gray-700 dark:text-gray-300"
                    )}>
                      Existing Job {!useNewProject && projectJobs.length === 0 && "(no jobs in project)"}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jobType"
                      checked={useNewJob}
                      onChange={() => setUseNewJob(true)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">New Job</span>
                  </label>
                </div>
                {useNewJob ? (
                  <Input
                    label="Job Name"
                    placeholder="Enter new job name"
                    value={newJobName}
                    onChange={(e) => setNewJobName(e.target.value)}
                  />
                ) : (
                  <Select
                    label="Select Job"
                    options={jobOptions}
                    value={selectedJobId}
                    onChange={(value) => setSelectedJobId(value as string)}
                    placeholder="Choose a job..."
                    disabled={useNewProject || projectJobs.length === 0}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={resetSaveModal}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSave} disabled={!canSave()}>
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
