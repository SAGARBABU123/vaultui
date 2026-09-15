import {
  Button,
  EmptyState as VaultEmptyState,
  Progress as VaultProgress,
  Skeleton as VaultSkeleton,
} from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VaultSkeleton> = {
  title: "Components/Feedback",
  component: VaultSkeleton,
};

export default meta;
type Story = StoryObj<typeof VaultSkeleton>;

export const Skeleton: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-3">
        <VaultSkeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <VaultSkeleton className="h-3 w-2/3 rounded" />
          <VaultSkeleton className="h-3 w-1/3 rounded" />
        </div>
      </div>
      <VaultSkeleton className="h-24 w-full rounded-xl" />
    </div>
  ),
};

export const ProgressBar: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-6">
      <VaultProgress value={35} />
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-surface-500">
          <span>Uploading assets…</span>
          <span>72%</span>
        </div>
        <VaultProgress value={72} size="lg" />
      </div>
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <VaultEmptyState
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v11.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V4.5Zm0 0 2.25 6.75h13.5L20.25 4.5M9 18h6M10.5 14.25V18M13.5 14.25V18" />
          </svg>
        }
        title="No invoices yet"
        body="Invoices will appear here once your first subscription is billed."
        action={
          <div className="flex gap-2">
            <Button size="sm">Create invoice</Button>
            <Button variant="ghost" size="sm">View docs</Button>
          </div>
        }
      />
    </div>
  ),
};