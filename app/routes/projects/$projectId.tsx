import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus, Play, MoreVertical } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
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
import { projects } from '~/data/projects';
import { jobs } from '~/data/jobs';
import { formatRelativeTime } from '~/lib/formatters';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);
  const projectJobs = jobs.filter((j) => j.projectId === projectId);

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
            <Button asChild>
              <Link to="/jobs/create">
                <Plus className="h-4 w-4" />
                Create Job
              </Link>
            </Button>
            <Button variant="secondary">
              <Play className="h-4 w-4" />
              Execute Project
            </Button>
          </div>
        }
      />

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
            {project.jobsCount}
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
              <TableCell isHeader>Created</TableCell>
              <TableCell isHeader className="w-12"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectJobs.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={6}>
                  No jobs in this project yet
                </TableCell>
              </TableRow>
            ) : (
              projectJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <span className="font-medium">{job.name}</span>
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
                    <RiskBadge risk={job.risk} />
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
