import { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, Download, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '~/components/layout/PageHeader';
import { Card } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import { ProgressBar } from '~/components/ui/ProgressBar';
import { StatCard } from '~/components/shared/StatCard';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/Table';
import { billingStats, transactions } from '~/data/billing';
import { formatNumber, formatDate, formatCurrency } from '~/lib/formatters';
import { cn } from '~/lib/cn';

const purchaseSchema = z.object({
  credits: z.coerce.number().min(100, 'Minimum purchase is 100 credits'),
});

type PurchaseForm = z.infer<typeof purchaseSchema>;

export default function Billing() {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PurchaseForm>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      credits: 1000,
    },
  });

  const creditsAmount = watch('credits') || 0;
  const totalCost = creditsAmount * billingStats.unitPrice;

  const onSubmit = (data: PurchaseForm) => {
    console.log('Purchasing credits:', data.credits);
    setIsPurchaseModalOpen(false);
    reset();
  };

  const handleCancel = () => {
    setIsPurchaseModalOpen(false);
    reset();
  };

  const usagePercentage = (billingStats.usedThisMonth / billingStats.monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credits & Billing"
        subtitle="Manage your credits and view transaction history"
        action={
          <Button onClick={() => setIsPurchaseModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Purchase Credits
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Credits Balance"
          value={formatNumber(billingStats.creditsBalance)}
          subtitle={`~${billingStats.estimatedJobs} validation jobs`}
          icon={<Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        />
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Used This Month
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(billingStats.usedThisMonth)}
              </p>
              <div className="mt-3">
                <ProgressBar
                  value={usagePercentage}
                  color={usagePercentage > 80 ? 'amber' : 'indigo'}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatNumber(billingStats.usedThisMonth)} /{' '}
                  {formatNumber(billingStats.monthlyLimit)} credits
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
        <StatCard
          title="Unit Price"
          value={formatCurrency(billingStats.unitPrice)}
          subtitle="Per complexity unit"
          icon={<DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />}
        />
      </div>

      {/* Transaction History */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Description</TableCell>
              <TableCell isHeader>Credits</TableCell>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Invoice</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-12 text-gray-500 dark:text-gray-400" colSpan={4}>
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <span className="font-medium">{tx.description}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-medium',
                        tx.credits > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {tx.credits > 0 ? '+' : ''}
                      {formatNumber(tx.credits)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDate(tx.date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {tx.hasInvoice ? (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Purchase Credits Modal */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={handleCancel}
        title="Purchase Credits"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Credit Amount"
            type="number"
            min={100}
            step={100}
            error={errors.credits?.message}
            {...register('credits')}
          />
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">Credits</span>
              <span className="text-gray-900 dark:text-white">
                {formatNumber(creditsAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">Unit Price</span>
              <span className="text-gray-900 dark:text-white">
                {formatCurrency(billingStats.unitPrice)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Purchase</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
