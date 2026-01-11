import { useState, useCallback } from 'react';
import { Upload, FileText, Info, MoreVertical, Shield, Ban, Eye, Database, Users, Scale, Network } from 'lucide-react';
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

  // Knowledge Base data
  const knowledgeBaseItems = [
    {
      id: 1,
      title: 'High-Risk AI Systems',
      sections: 15,
      source: 'EU AI Act',
      icon: Shield,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-600',
    },
    {
      id: 2,
      title: 'Prohibited Practices',
      sections: 8,
      source: 'EU AI Act',
      icon: Ban,
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600',
      hoverBg: 'group-hover:bg-red-600',
    },
    {
      id: 3,
      title: 'Transparency Requirements',
      sections: 12,
      source: 'EU AI Act',
      icon: Eye,
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      hoverBg: 'group-hover:bg-green-600',
    },
    {
      id: 4,
      title: 'Data Governance',
      sections: 6,
      source: 'Internal',
      icon: Database,
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      hoverBg: 'group-hover:bg-purple-600',
    },
    {
      id: 5,
      title: 'Human Oversight',
      sections: 9,
      source: 'EU AI Act',
      icon: Users,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      hoverBg: 'group-hover:bg-orange-600',
    },
    {
      id: 6,
      title: 'Bias & Fairness',
      sections: 11,
      source: 'Internal',
      icon: Scale,
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-600',
      hoverBg: 'group-hover:bg-teal-600',
    },
  ];

  const KnowledgeBaseTab = (
    <Card className="p-8">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Knowledge Base</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Indexed policy content available for validation
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBaseItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors',
                  item.iconBg,
                  item.hoverBg
                )}
              >
                <IconComponent
                  className={cn('h-5 w-5 transition-colors', item.iconColor, 'group-hover:text-white')}
                />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{item.sections} indexed sections</span> •{' '}
                <span className="italic">{item.source}</span>
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );

  const ArticleMappingTab = (
    <Card className="p-10 min-h-[400px]">
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Mapping</h3>
        <p className="text-gray-500 dark:text-gray-400">
          View how test cases map to regulatory articles
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Network className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Article mapping visualization coming soon...
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-md text-center">
          We're building an interactive graph to help you visualize complex relationships between
          compliance requirements and testing results.
        </p>
      </div>
    </Card>
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
