import { useState } from 'react';
import { FileText, Type, Image, Video, ExternalLink } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Select } from '~/components/ui/Select';
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
import { projects } from '~/data/projects';
import { MODALITY_OPTIONS, SOURCE_OPTIONS } from '~/lib/constants';
import { cn } from '~/lib/cn';
import type { Modality } from '~/types';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

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

  const handleConfirmSave = () => {
    console.log('Saving test cases to project:', selectedProjectId, selectedTestCases);
    setIsSaveModalOpen(false);
    setSelectedTestCases([]);
    setSelectedProjectId('');
  };

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
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
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Test Cases to Project"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select a project to add the {selectedTestCases.length} selected test case
            {selectedTestCases.length > 1 ? 's' : ''} to.
          </p>
          <Select
            label="Project"
            options={projectOptions}
            value={selectedProjectId}
            onChange={(value) => setSelectedProjectId(value as string)}
            placeholder="Choose a project..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} disabled={!selectedProjectId}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
