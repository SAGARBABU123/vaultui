import { HeatmapCalendar } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HeatmapCalendar> = {
  title: "Charts/HeatmapCalendar",
  component: HeatmapCalendar,
  argTypes: {
    max: { control: { type: "number", min: 1, max: 20 } },
    weeks: { control: { type: "number", min: 4, max: 26 } },
    monthEvery: { control: { type: "number", min: 0, max: 12 } },
  },
};

export default meta;
type Story = StoryObj<typeof HeatmapCalendar>;

const values = Array.from({ length: 70 }, (_, i) =>
  Math.floor(Math.abs(Math.sin(i * 1.7) * 9) % 5),
);

export const Default: Story = {
  args: { values, max: 4, weeks: 10, monthEvery: 5 },
};

export const WithMonthLabels: Story = {
  args: { values, max: 4, weeks: 26, monthEvery: 4 },
};

export const NoLabels: Story = {
  args: { values, max: 4, weeks: 12, monthEvery: 0 },
};