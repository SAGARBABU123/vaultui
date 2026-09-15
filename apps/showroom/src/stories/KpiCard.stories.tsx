import { KpiCard } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KpiCard> = {
  title: "Charts/KpiCard",
  component: KpiCard,
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "number" } },
    delta: { control: { type: "number" } },
    hint: { control: "text" },
  },
  args: {
    label: "Revenue",
    value: 48290,
    delta: 12.4,
    hint: "vs last month",
    format: (n) => `$${Math.round(n).toLocaleString()}`,
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

const trend = [10, 12, 9, 14, 18, 16, 22, 26, 24, 31, 35, 42];

export const Default: Story = {
  args: { trend },
};

export const Up: Story = {
  args: { label: "Active users", value: 12480, delta: 8.1, hint: "vs last week", trend: [4, 6, 5, 9, 12, 11, 14, 16] },
};

export const Down: Story = {
  args: { label: "Churn rate", value: 3.2, delta: -1.4, hint: "improving", trend: [2, 3, 2, 4, 3, 2, 1.5, 1.2] },
};

export const NoDelta: Story = {
  args: { label: "Monthly MRR", value: 190400, hint: "in recurring revenue", format: (n) => `$${Math.round(n).toLocaleString()}`, delta: undefined, trend },
};