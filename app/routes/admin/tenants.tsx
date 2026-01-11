import { useState } from 'react';
import { Plus, Users, UserCog, Eye, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Select } from '~/components/ui/Select';
import { Modal } from '~/components/ui/Modal';
import { Badge } from '~/components/ui/Badge';
import { SearchInput } from '~/components/shared/SearchInput';
import { StatCard } from '~/components/shared/StatCard';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { adminUserStats } from '~/data/analytics';
import { USER_ROLES } from '~/lib/constants';
import type { User } from '~/types';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['tenant-admin', 'project-manager', 'viewer']),
});

type InviteForm = z.infer<typeof inviteSchema>;

// Mock empty users list - placeholder for backend integration
const users: User[] = [];

export default function AdminTenants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'viewer',
    },
  });

  const role = watch('role');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: InviteForm) => {
    console.log('Inviting user:', data);
    setIsInviteModalOpen(false);
    reset();
  };

  const handleCancel = () => {
    setIsInviteModalOpen(false);
    reset();
  };

  const getRoleBadgeVariant = (userRole: string) => {
    switch (userRole) {
      case 'tenant-admin':
        return 'info';
      case 'project-manager':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'tenant-admin':
        return 'Tenant Admin';
      case 'project-manager':
        return 'Project Manager';
      case 'viewer':
        return 'Viewer';
      default:
        return userRole;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage team members and their permissions"
        action={
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={adminUserStats.totalMembers}
          icon={<Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        />
        <StatCard
          title="Tenant Admins"
          value={adminUserStats.tenantAdmins}
          icon={<UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatCard
          title="Project Managers"
          value={adminUserStats.projectManagers}
          icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
        <StatCard
          title="Viewers"
          value={adminUserStats.viewers}
          icon={<Eye className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
        />
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search members..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-sm"
      />

      {/* Users Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Member</TableCell>
              <TableCell isHeader>Role</TableCell>
              <TableCell isHeader>Permissions</TableCell>
              <TableCell isHeader>Joined</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12" colSpan={4}>
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No team members yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Invite users to start collaborating
                    </p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsInviteModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Invite User
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role) as 'info' | 'success' | 'default'}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 2).map((perm) => (
                        <Badge key={perm} size="sm" variant="outline">
                          {perm}
                        </Badge>
                      ))}
                      {user.permissions.length > 2 && (
                        <Badge size="sm" variant="outline">
                          +{user.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">{user.joined}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={handleCancel}
        title="Invite User"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              An invitation email will be sent to the user
            </p>
          </div>
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Select
            label="Role"
            options={USER_ROLES}
            value={role}
            onChange={(value) => setValue('role', value as 'tenant-admin' | 'project-manager' | 'viewer')}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
