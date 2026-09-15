import { DonutChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DonutChart> = {
  title: "Charts/DonutChart",
  component: DonutChart,
  argTypes: {
    size: { control: { type: "number", min: 80, max: 260 } },
    thickness: { control: { type: "number", min: 8, max: 48 } },
    legend: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const Plans: Story = {
  args: {
    data: [
      { label: "Pro", value: 42 },
      { label: "Free", value: 30 },
      { label: "Enterprise", value: 18 },
      { label: "Trial", value: 10 },
    ],
    centerValue: "100",
    centerLabel: "plans",
  },
};

export const Traffic: Story = {
  args: {
    data: [
      { label: "Direct", value: 44, color: "var(--color-brand-600)" },
      { label: "Organic", value: 28, color: "var(--color-info-500)" },
      { label: "Paid", value: 18, color: "var(--color-warning-500)" },
      { label: "Social", value: 10, color: "var(--color-danger-500)" },
    ],
    centerValue: "8.4k",
    centerLabel: "visits",
    size: 190,
  },
};

export const NoLegend: Story = {
  args: {
    data: [
      { label: "Passed", value: 84 },
      { label: "Failed", value: 16 },
    ],
    size: 120,
    thickness: 18,
    legend: false,
    centerValue: "84%",
  },
};