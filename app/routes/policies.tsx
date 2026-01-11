import { useState, useCallback } from 'react';
import { Upload, FileText, Info, MoreVertical } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Modal } from '~/components/ui/Modal';
import { Tabs } from '~/components/ui/Tabs';
import { SearchInput } from '~/components/shared/SearchInput';
import { StatusBadge } from '~/components/shared/StatusBadge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { policies } from '~/data/policies';
import { formatDate, formatFileSize } from '~/lib/formatters';
import { cn } from '~/lib/cn';

export default function Policies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const filteredPolicies = policies.filter((policy) =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleUpload = () => {
    console.log('Uploading file:', uploadedFile);
    setIsUploadModalOpen(false);
    setUploadedFile(null);
  };

  const handleCancel = () => {
    setIsUploadModalOpen(false);
    setUploadedFile(null);
  };

  const PolicyDocumentsTab = (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Policy documents are processed using RAG (Retrieval Augmented Generation) to extract
            articles and requirements. This enables intelligent test case generation and compliance
            mapping.
          </p>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search policies..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-sm"
      />

      {/* Policies Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Policy</TableCell>
              <TableCell isHeader>Version</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Articles</TableCell>
              <TableCell isHeader>Uploaded</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={6}>
                  No policies found
                </TableCell>
              </TableRow>
            ) : (
              filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium">{policy.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {policy.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">{policy.version}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={policy.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">{policy.articles}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(policy.uploaded)}
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

  const KnowledgeBaseTab = (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 dark:text-gray-400">Knowledge Base content coming soon</p>
    </div>
  );

  const ArticleMappingTab = (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 dark:text-gray-400">Article Mapping content coming soon</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policies & Compliance"
        subtitle="Manage policy documents and compliance requirements"
        action={
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Policy
          </Button>
        }
      />

      <Tabs
        tabs={[
          { label: 'Policy Documents', content: PolicyDocumentsTab },
          { label: 'Knowledge Base', content: KnowledgeBaseTab },
          { label: 'Article Mapping', content: ArticleMappingTab },
        ]}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={handleCancel}
        title="Upload Policy Document"
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
              Drag and drop your file here, or
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports PDF, DOC, DOCX files
            </p>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!uploadedFile}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
