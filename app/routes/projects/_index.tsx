import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, MoreVertical, FolderOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
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
import { projects as initialProjects } from '~/data/projects';
import { AI_SYSTEM_TYPES } from '~/lib/constants';
import { formatDate } from '~/lib/formatters';
import type { Project } from '~/types';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  aiSystemType: z.enum(['llm', 'multimodal']),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      aiSystemType: 'llm',
    },
  });

  const aiSystemType = watch('aiSystemType');

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: CreateProjectForm) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: '',
      aiSystemType: data.aiSystemType,
      status: 'draft',
      jobsCount: 0,
      lastValidation: null,
    };
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    reset();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Manage your AI validation projects"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        }
      />

      {/* Search */}
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search projects..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-sm"
        />
      </div>

      {/* Projects Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Project</TableCell>
              <TableCell isHeader>AI System Type</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Jobs</TableCell>
              <TableCell isHeader>Last Validation</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={6}>
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex items-center gap-3 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <FolderOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {project.aiSystemType.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-300">
                      {project.jobsCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {project.lastValidation
                        ? formatDate(project.lastValidation)
                        : 'Never'}
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

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Create Project"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Select
            label="AI System Type"
            options={AI_SYSTEM_TYPES}
            value={aiSystemType}
            onChange={(value) => setValue('aiSystemType', value as 'llm' | 'multimodal')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
