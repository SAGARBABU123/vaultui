import { ProgressRadial } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProgressRadial> = {
  title: "Charts/ProgressRadial",
  component: ProgressRadial,
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    size: { control: { type: "number", min: 48, max: 200 } },
    stroke: { control: { type: "number", min: 2, max: 24 } },
    tone: { control: "select", options: ["brand", "success", "warning", "danger"] },
    label: { control: "text" },
    sublabel: { control: "text" },
  },
  args: {
    value: 72,
    label: "72",
    sublabel: "score",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRadial>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-8">
      <ProgressRadial value={65} tone="brand" label="65" sublabel="brand" />
      <ProgressRadial value={85} tone="success" label="85" sublabel="success" />
      <ProgressRadial value={45} tone="warning" label="45" sublabel="warning" />
      <ProgressRadial value={20} tone="danger" label="20" sublabel="danger" />
    </div>
  ),
};

export const Large: Story = {
  args: { value: 92, size: 160, stroke: 12, label: "92", sublabel: "health" },
};