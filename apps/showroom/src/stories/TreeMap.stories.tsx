import { TreeMap } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TreeMap> = {
  title: "Charts/TreeMap",
  component: TreeMap,
};

export default meta;
type Story = StoryObj<typeof TreeMap>;

export const Default: Story = {
  args: {
    items: [
      { id: "storage", label: "Storage", value: 320 },
      { id: "compute", label: "Compute", value: 210 },
      { id: "network", label: "Network", value: 120 },
      { id: "support", label: "Support", value: 80 },
      { id: "licenses", label: "Licenses", value: 45 },
      { id: "misc", label: "Misc", value: 25 },
    ],
  },
};

export const Tall: Story = {
  args: {
    heightClass: "h-[420px]",
    items: [
      { id: "a", label: "Direct", value: 480 },
      { id: "b", label: "Organic", value: 300 },
      { id: "c", label: "Referral", value: 220 },
      { id: "d", label: "Social", value: 140 },
      { id: "e", label: "Email", value: 90 },
      { id: "f", label: "Paid", value: 160 },
      { id: "g", label: "Partner", value: 70 },
      { id: "h", label: "Other", value: 30 },
    ],
  },
};