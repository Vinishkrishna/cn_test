import { useState, useCallback } from 'react';
import { Plus, Upload, FileText, MoreVertical, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import { Textarea } from '~/components/ui/Textarea';
import { Modal } from '~/components/ui/Modal';
import { Badge } from '~/components/ui/Badge';
import { SearchInput } from '~/components/shared/SearchInput';
import { StatCard } from '~/components/shared/StatCard';
import { StatusBadge } from '~/components/shared/StatusBadge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { testCases } from '~/data/testCases';
import { adminTestCaseStats } from '~/data/analytics';
import { MODALITY_OPTIONS, COMPLEXITY_UNITS, TEST_CASE_STATUS } from '~/lib/constants';
import { cn } from '~/lib/cn';
import { formatFileSize } from '~/lib/formatters';

const testCaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  modality: z.enum(['text', 'image', 'video']),
  description: z.string().min(1, 'Description is required'),
  testProcedure: z.string().min(1, 'Test procedure is required'),
  passCriteria: z.string().min(1, 'Pass criteria is required'),
  failCriteria: z.string().min(1, 'Fail criteria is required'),
  complexity: z.coerce.number().min(1).max(5),
  status: z.enum(['draft', 'published']),
  tags: z.string(),
});

type TestCaseForm = z.infer<typeof testCaseSchema>;

export default function AdminTestCases() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestCaseForm>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      modality: 'text',
      complexity: 1,
      status: 'draft',
    },
  });

  const modality = watch('modality');
  const complexity = watch('complexity');
  const status = watch('status');

  const filteredTestCases = testCases.filter((tc) =>
    tc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const onSubmit = (data: TestCaseForm) => {
    console.log('Creating test case:', data);
    setIsNewModalOpen(false);
    reset();
  };

  const handleGenerate = () => {
    console.log('Generating from document:', uploadedFile);
    setIsGenerateModalOpen(false);
    setUploadedFile(null);
  };

  const handleCancelNew = () => {
    setIsNewModalOpen(false);
    reset();
  };

  const handleCancelGenerate = () => {
    setIsGenerateModalOpen(false);
    setUploadedFile(null);
  };

  const modalityOptions = MODALITY_OPTIONS.filter((m) => m.value !== 'all');
  const complexityOptions = COMPLEXITY_UNITS;
  const statusOptions = TEST_CASE_STATUS;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Case Management"
        subtitle="Create and manage validation test cases"
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Generate from Document
            </Button>
            <Button onClick={() => setIsNewModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Test Case
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Test Cases"
          value={adminTestCaseStats.totalTestCases}
        />
        <StatCard
          title="Published"
          value={adminTestCaseStats.published}
          valueColor="success"
        />
        <StatCard
          title="Drafts"
          value={adminTestCaseStats.drafts}
        />
        <StatCard
          title="Total Units"
          value={adminTestCaseStats.totalUnits}
        />
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search test cases..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-sm"
      />

      {/* Test Cases Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Test Case</TableCell>
              <TableCell isHeader>Modality</TableCell>
              <TableCell isHeader>Units</TableCell>
              <TableCell isHeader>Version</TableCell>
              <TableCell isHeader>Source</TableCell>
              <TableCell isHeader>References</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
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
              filteredTestCases.map((tc) => (
                <TableRow key={tc.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {tc.description}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {tc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{tc.modality}</span>
                  </TableCell>
                  <TableCell>{tc.complexity}</TableCell>
                  <TableCell>{tc.version}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tc.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tc.documentReferences?.join(', ') || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tc.status} />
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

      {/* New Test Case Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={handleCancelNew}
        title="New Test Case"
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Test Case Name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Select
              label="Modality"
              options={modalityOptions}
              value={modality}
              onChange={(value) => setValue('modality', value as 'text' | 'image' | 'video')}
            />
          </div>
          <Textarea
            label="Description"
            rows={2}
            error={errors.description?.message}
            {...register('description')}
          />
          <Textarea
            label="Test Procedure"
            rows={3}
            error={errors.testProcedure?.message}
            {...register('testProcedure')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Textarea
              label="Pass Criteria"
              rows={2}
              error={errors.passCriteria?.message}
              {...register('passCriteria')}
            />
            <Textarea
              label="Fail Criteria"
              rows={2}
              error={errors.failCriteria?.message}
              {...register('failCriteria')}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Complexity Units"
              options={complexityOptions}
              value={complexity}
              onChange={(value) => setValue('complexity', value as number)}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={status}
              onChange={(value) => setValue('status', value as 'draft' | 'published')}
            />
            <Input
              label="Tags"
              placeholder="comma, separated, tags"
              {...register('tags')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancelNew}>
              Cancel
            </Button>
            <Button type="button" variant="secondary" onClick={handleSubmit(onSubmit)}>
              Save as Draft
            </Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </Modal>

      {/* Generate from Document Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={handleCancelGenerate}
        title="Generate from Document"
        size="lg"
      >
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600'
            )}
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag and drop your policy document here, or
            </p>
            <label className="cursor-pointer">
              <span className="text-indigo-600 dark:text-indigo-400 hover:underline">
                browse to upload
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileText className="h-5 w-5 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
          )}

          {/* How it Works */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">How it Works</p>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Upload a policy or regulation document</li>
                  <li>AI extracts requirements and articles</li>
                  <li>Test cases are auto-generated for review</li>
                  <li>Review and publish generated test cases</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancelGenerate}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!uploadedFile}>
              Start Generation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
