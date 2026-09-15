import { TimelineSlider } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TimelineSlider> = {
  title: "Charts/TimelineSlider",
  component: TimelineSlider,
  argTypes: {
    intervalMs: { control: { type: "number", min: 100, max: 3000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineSlider>;

export const RevenueByMonth: Story = {
  args: {
    points: [
      { time: "Jan", value: 12 },
      { time: "Feb", value: 18 },
      { time: "Mar", value: 15 },
      { time: "Apr", value: 24 },
      { time: "May", value: 29 },
      { time: "Jun", value: 27 },
      { time: "Jul", value: 34 },
      { time: "Aug", value: 40 },
      { time: "Sep", value: 38 },
      { time: "Oct", value: 44 },
      { time: "Nov", value: 51 },
      { time: "Dec", value: 58 },
    ],
    format: (n) => `$${Math.round(n)}k`,
  },
};

export const SlowPlayback: Story = {
  args: {
    intervalMs: 2000,
    points: [
      { time: "Q1", value: 8 },
      { time: "Q2", value: 12 },
      { time: "Q3", value: 9 },
      { time: "Q4", value: 14 },
    ],
  },
};