import { Card } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    shadow: { control: "select", options: ["none", "soft", "raised"] },
    bordered: { control: "boolean" },
    hover: { control: "boolean" },
  },
  args: {
    children: "Card content",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Soft: Story = { args: { shadow: "soft", children: "Soft shadow" } };

export const Raised: Story = { args: { shadow: "raised", children: "Raised shadow" } };

export const Bordered: Story = {
  args: { bordered: true, children: "Bordered card" },
};

export const Hover: Story = {
  args: { hover: true, children: "Hover me — this card lifts" },
};

export const Example: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Card bordered padding="md" hover>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-surface-800">Monthly revenue</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-surface-900">$48,290</p>
            <p className="mt-1 text-xs text-surface-400">+12% vs last month</p>
          </div>
          <span className="rounded-xl bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
            ▲ 12.4%
          </span>
        </div>
      </Card>
    </div>
  ),
};