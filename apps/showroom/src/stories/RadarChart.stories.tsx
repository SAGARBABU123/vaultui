import { RadarChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RadarChart> = {
  title: "Charts/RadarChart",
  component: RadarChart,
  argTypes: {
    colorClass: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
  args: {
    axes: [
      { label: "Design", value: 90 },
      { label: "Code", value: 78 },
      { label: "Speed", value: 60 },
      { label: "Docs", value: 84 },
      { label: "A11y", value: 96 },
      { label: "Theming", value: 70 },
    ],
  },
};

export const Success: Story = {
  args: {
    colorClass: "text-success-500",
    axes: [
      { label: "Perf", value: 88 },
      { label: "Size", value: 92 },
      { label: "Caching", value: 70 },
      { label: "SSR", value: 76 },
      { label: "DX", value: 82 },
    ],
  },
};

export const Danger: Story = {
  args: {
    colorClass: "text-danger-500",
    axes: [
      { label: "Inbox", value: 30 },
      { label: "Alerts", value: 45 },
      { label: "Backups", value: 60 },
      { label: "Uptime", value: 25 },
      { label: "On-call", value: 40 },
    ],
  },
};