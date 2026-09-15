import { Sparkline } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Sparkline> = {
  title: "Charts/Sparkline",
  component: Sparkline,
  argTypes: {
    colorClass: { control: "text" },
    fill: { control: "boolean" },
    strokeWidth: { control: { type: "number", min: 1, max: 5 } },
  },
  args: {
    data: [3, 7, 5, 9, 12, 11, 15, 14, 18, 22, 21, 25],
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

export const Default: Story = {};

export const Brand: Story = {};

export const Success: Story = {
  args: { colorClass: "text-success-500" },
};

export const Danger: Story = {
  args: { colorClass: "text-danger-500" },
};

export const NoFill: Story = {
  args: { fill: false, colorClass: "text-brand-600" },
};

export const Wide: Story = {
  args: {
    data: [5, 8, 6, 12, 10, 15, 13, 18, 22, 19, 26, 30, 28, 34, 31, 38, 42, 40, 46, 51],
  },
};