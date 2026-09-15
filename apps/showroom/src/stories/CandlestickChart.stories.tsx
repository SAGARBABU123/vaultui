import { CandlestickChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CandlestickChart> = {
  title: "Charts/CandlestickChart",
  component: CandlestickChart,
};

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

export const Weekly: Story = {
  args: {
    data: [
      { label: "Mon", open: 128, high: 134, low: 126, close: 132 },
      { label: "Tue", open: 132, high: 138, low: 130, close: 131 },
      { label: "Wed", open: 131, high: 133, low: 124, close: 127 },
      { label: "Thu", open: 127, high: 131, low: 121, close: 130 },
      { label: "Fri", open: 130, high: 136, low: 129, close: 135 },
      { label: "Sat", open: 135, high: 137, low: 132, close: 133 },
      { label: "Sun", open: 133, high: 140, low: 132, close: 139 },
    ],
  },
};

export const Intraday: Story = {
  args: {
    data: [
      { label: "09:30", open: 100, high: 102, low: 99, close: 101 },
      { label: "10:00", open: 101, high: 104, low: 100, close: 103 },
      { label: "10:30", open: 103, high: 103, low: 99, close: 100 },
      { label: "11:00", open: 100, high: 101, low: 97, close: 98 },
      { label: "11:30", open: 98, high: 100, low: 97, close: 99 },
      { label: "12:00", open: 99, high: 99, low: 95, close: 96 },
    ],
  },
};