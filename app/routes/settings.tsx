import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Copy, RefreshCw, Shield } from 'lucide-react';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Tabs } from '~/components/ui/Tabs';
import { Toggle } from '~/components/ui/Toggle';
import { cn } from '~/lib/cn';

// Profile Schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

type ProfileForm = z.infer<typeof profileSchema>;

// Password Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  // Profile Tab State
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Tenant',
      lastName: 'Admin',
      email: 'admin@example.com',
    },
  });

  // API Keys Tab State
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('sk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

  // Notifications Tab State
  const [notificationSettings, setNotificationSettings] = useState({
    jobCompleted: true,
    jobFailed: true,
    creditsLow: true,
    policyUpdates: false,
  });

  // Security Tab State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileForm) => {
    console.log('Saving profile:', data);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log('Changing password:', data);
    setIsPasswordModalVisible(false);
    resetPassword();
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const handleRegenerateKey = () => {
    console.log('Regenerating API key');
  };

  // Profile Tab Content
  const ProfileTab = (
    <Card className="max-w-xl">
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={profileErrors.firstName?.message}
            {...registerProfile('firstName')}
          />
          <Input
            label="Last Name"
            error={profileErrors.lastName?.message}
            {...registerProfile('lastName')}
          />
        </div>
        <Input
          label="Email"
          type="email"
          error={profileErrors.email?.message}
          {...registerProfile('email')}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );

  // API Keys Tab Content
  const ApiKeysTab = (
    <Card className="max-w-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        API Key
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Use this API key to authenticate requests to the AI Validate API.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            readOnly
            className={cn(
              'w-full px-3 py-2 pr-10 rounded-lg border font-mono text-sm',
              'bg-gray-50 dark:bg-gray-800',
              'border-gray-300 dark:border-gray-600',
              'text-gray-900 dark:text-gray-100'
            )}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button variant="outline" size="md" onClick={handleCopyApiKey}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4">
        <Button variant="secondary" onClick={handleRegenerateKey}>
          <RefreshCw className="h-4 w-4" />
          Regenerate Key
        </Button>
      </div>
    </Card>
  );

  // Notifications Tab Content
  const NotificationsTab = (
    <Card className="max-w-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Email Notifications
      </h3>
      <div className="space-y-4">
        <Toggle
          enabled={notificationSettings.jobCompleted}
          onChange={(enabled) =>
            setNotificationSettings((prev) => ({ ...prev, jobCompleted: enabled }))
          }
          label="Job Completed"
          description="Receive notifications when validation jobs complete"
        />
        <Toggle
          enabled={notificationSettings.jobFailed}
          onChange={(enabled) =>
            setNotificationSettings((prev) => ({ ...prev, jobFailed: enabled }))
          }
          label="Job Failed"
          description="Receive notifications when validation jobs fail"
        />
        <Toggle
          enabled={notificationSettings.creditsLow}
          onChange={(enabled) =>
            setNotificationSettings((prev) => ({ ...prev, creditsLow: enabled }))
          }
          label="Credits Low"
          description="Receive notifications when your credits are running low"
        />
        <Toggle
          enabled={notificationSettings.policyUpdates}
          onChange={(enabled) =>
            setNotificationSettings((prev) => ({ ...prev, policyUpdates: enabled }))
          }
          label="Policy Updates"
          description="Receive notifications when policy documents are updated"
        />
      </div>
    </Card>
  );

  // Security Tab Content
  const SecurityTab = (
    <div className="space-y-6 max-w-xl">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Toggle
            enabled={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        {!isPasswordModalVisible ? (
          <Button variant="outline" onClick={() => setIsPasswordModalVisible(true)}>
            Change Password
          </Button>
        ) : (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            <Input
              label="New Password"
              type="password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPasswordModalVisible(false);
                  resetPassword();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account settings" />

      <Tabs
        tabs={[
          { label: 'Profile', content: ProfileTab },
          { label: 'API Keys', content: ApiKeysTab },
          { label: 'Notifications', content: NotificationsTab },
          { label: 'Security', content: SecurityTab },
        ]}
      />
    </div>
  );
}
