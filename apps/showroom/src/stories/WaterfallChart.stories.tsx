import { WaterfallChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof WaterfallChart> = {
  title: "Charts/WaterfallChart",
  component: WaterfallChart,
  argTypes: {
    format: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const ProfitWalk: Story = {
  args: {
    steps: [
      { label: "Revenue", value: 100, type: "total" },
      { label: "COGS", value: -35 },
      { label: "Marketing", value: -18 },
      { label: "R&D", value: -12 },
      { label: "Ops", value: -8 },
      { label: "Net", value: 27, type: "total" },
    ],
  },
};

export const SignedNet: Story = {
  render: (args) => (
    <div className="max-w-lg">
      <WaterfallChart
        format={(n) => `$${Math.round(n)}k`}
        steps={[
          { label: "Open", value: 420, type: "total" },
          { label: "Won", value: -180 },
          { label: "Lost", value: -90 },
          { label: "Reopened", value: 40 },
          { label: "Close", value: 190, type: "total" },
        ]}
      />
    </div>
  ),
};