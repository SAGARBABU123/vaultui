import { LineChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LineChart> = {
  title: "Charts/LineChart",
  component: LineChart,
  argTypes: {
    area: { control: "boolean" },
    height: { control: { type: "number", min: 80, max: 320 } },
  },
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Single: Story = {
  args: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    series: [{ label: "Visitors", points: [12, 19, 15, 24, 29, 27, 34, 40] }],
  },
};

export const MultiSeries: Story = {
  args: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    series: [
      { label: "Signups", points: [10, 14, 12, 18, 22, 20, 26, 31, 35, 44], color: "var(--color-brand-600)" },
      { label: "Upgrades", points: [4, 5, 8, 9, 12, 14, 13, 17, 21, 26], color: "var(--color-success-500)" },
      { label: "Cancels", points: [2, 1, 3, 2, 3, 4, 3, 2, 4, 3], color: "var(--color-danger-500)" },
    ],
  },
};

export const NoArea: Story = {
  args: {
    area: false,
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    series: [{ label: "Latency", points: [80, 75, 90, 70, 60, 65, 55, 58, 50, 52, 45, 42], color: "var(--color-info-500)" }],
  },
};