import { BarChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
  argTypes: {
    showValues: { control: "boolean" },
    height: { control: { type: "number", min: 80, max: 320 } },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Weekly: Story = {
  args: {
    data: [
      { label: "Mon", value: 42 },
      { label: "Tue", value: 58 },
      { label: "Wed", value: 36 },
      { label: "Thu", value: 71 },
      { label: "Fri", value: 49 },
      { label: "Sat", value: 22 },
      { label: "Sun", value: 30 },
    ],
  },
};

export const Negative: Story = {
  args: {
    data: [
      { label: "Jan", value: 12 },
      { label: "Feb", value: -8 },
      { label: "Mar", value: 5 },
      { label: "Apr", value: -14 },
      { label: "May", value: 9 },
      { label: "Jun", value: -3 },
    ],
  },
};

export const Colored: Story = {
  args: {
    data: [
      { label: "Pro", value: 64, color: "var(--color-brand-600)" },
      { label: "Free", value: 80, color: "var(--color-info-500)" },
      { label: "Ent", value: 28, color: "var(--color-success-500)" },
      { label: "Trial", value: 34, color: "var(--color-warning-500)" },
    ],
  },
};

export const HiddenValues: Story = {
  args: {
    showValues: false,
    data: [
      { label: "Marketing", value: 40 },
      { label: "Sales", value: 65 },
      { label: "Support", value: 35 },
      { label: "Eng", value: 50 },
    ],
  },
};