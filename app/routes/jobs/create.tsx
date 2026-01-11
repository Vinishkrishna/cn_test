import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, FolderOpen, ChevronRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import { projects } from '~/data/projects';
import { euAiActFolder, testCases } from '~/data/testCases';
import { cn } from '~/lib/cn';

const createJobSchema = z.object({
  name: z.string().min(1, 'Job name is required'),
  projectId: z.string().min(1, 'Please select a project'),
});

type CreateJobForm = z.infer<typeof createJobSchema>;

type Step = 'details' | 'folder' | 'testcases';

export default function CreateJob() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      projectId: '',
    },
  });

  const projectId = watch('projectId');

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const onDetailsSubmit = (data: CreateJobForm) => {
    console.log('Job details:', data);
    setStep('folder');
  };

  const handleFolderSelect = () => {
    setStep('testcases');
  };

  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id) ? prev.filter((tc) => tc !== id) : [...prev, id]
    );
  };

  const handleSaveJob = () => {
    console.log('Saving job with test cases:', selectedTestCases);
    navigate('/jobs');
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <PageHeader title="Create Job" subtitle="Configure a new validation job" />

      {/* Step 1: Job Details */}
      {step === 'details' && (
        <Card className="max-w-xl">
          <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-4">
            <Select
              label="Select Project"
              options={projectOptions}
              value={projectId}
              onChange={(value) => setValue('projectId', value as string)}
              placeholder="Choose a project..."
              error={errors.projectId?.message}
            />
            <Input
              label="Job Name"
              placeholder="Enter job name"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Step 2: Select Regulation Folder */}
      {step === 'folder' && (
        <div className="space-y-4">
          <Card className="max-w-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Regulation
            </h2>
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
          </Card>
          <div className="flex justify-end gap-3 max-w-xl">
            <Button variant="outline" onClick={() => setStep('details')}>
              Back
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select Test Cases */}
      {step === 'testcases' && (
        <div className="space-y-4">
          <Card className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Test Cases
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTestCases.length} selected
              </span>
            </div>
            <div className="space-y-2">
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
          </Card>
          <div className="flex justify-end gap-3 max-w-2xl">
            <Button variant="outline" onClick={() => setStep('folder')}>
              Back
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveJob} disabled={selectedTestCases.length === 0}>
              Save Job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
