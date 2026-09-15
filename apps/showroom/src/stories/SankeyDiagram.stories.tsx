import { SankeyDiagram } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SankeyDiagram> = {
  title: "Charts/SankeyDiagram",
  component: SankeyDiagram,
};

export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

export const TrafficSources: Story = {
  args: {
    nodes: [
      { id: "direct", label: "Direct", value: 400 },
      { id: "organic", label: "Organic", value: 320 },
      { id: "paid", label: "Paid", value: 240 },
      { id: "social", label: "Social", value: 180 },
      { id: "newsletter", label: "Email", value: 130 },
      { id: "trial", label: "Trial", value: 420 },
      { id: "signup", label: "Signup", value: 380 },
      { id: "purchase", label: "Purchase", value: 250 },
      { id: "churn", label: "Churn", value: 220 },
    ],
    links: [
      { from: "direct", to: "trial", value: 180 },
      { from: "direct", to: "signup", value: 160 },
      { from: "direct", to: "churn", value: 60 },
      { from: "organic", to: "trial", value: 120 },
      { from: "organic", to: "signup", value: 140 },
      { from: "organic", to: "churn", value: 60 },
      { from: "paid", to: "trial", value: 70 },
      { from: "paid", to: "signup", value: 60 },
      { from: "paid", to: "churn", value: 110 },
      { from: "social", to: "signup", value: 40 },
      { from: "social", to: "churn", value: 140 },
      { from: "newsletter", to: "signup", value: 50 },
      { from: "newsletter", to: "churn", value: 80 },
      { from: "trial", to: "purchase", value: 150 },
      { from: "trial", to: "churn", value: 270 },
      { from: "signup", to: "purchase", value: 100 },
      { from: "signup", to: "churn", value: 280 },
    ],
  },
};