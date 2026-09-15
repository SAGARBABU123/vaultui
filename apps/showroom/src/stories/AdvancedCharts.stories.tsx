import { ScatterChart, FunnelChart, GaugeChart, BulletChart } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ScatterChart> = {
  title: "Charts/Advanced",
  component: ScatterChart,
};

export default meta;
type Story = StoryObj<typeof ScatterChart>;

export const Scatter: Story = {
  render: () => (
    <div className="w-full max-w-lg rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
      <ScatterChart
        height={200}
        points={[
          { x: 2, y: 30, label: "cheap & quiet" },
          { x: 4, y: 52, label: "" },
          { x: 5, y: 48, label: "" },
          { x: 6, y: 61, label: "" },
          { x: 8, y: 44, label: "" },
          { x: 9, y: 70, label: "sweet spot" },
          { x: 10, y: 58, label: "" },
          { x: 12, y: 74, label: "" },
          { x: 14, y: 88, label: "" },
          { x: 15, y: 66, label: "" },
          { x: 16, y: 92, label: "high perf" },
        ]}
      />
    </div>
  ),
};

export const Funnel: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-xl border border-surface-200 bg-surface-0 p-6 shadow-soft">
      <FunnelChart
        stages={[
          { label: "Visited", value: 1000 },
          { label: "Signed up", value: 540 },
          { label: "Activated", value: 320 },
          { label: "Paid", value: 190 },
        ]}
      />
    </div>
  ),
};

export const Gauge: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <GaugeChart value={68} label="health" size={180} />
      <GaugeChart value={42} label="adoption" size={150} />
      <GaugeChart value={97} label="uptime" size={170} />
    </div>
  ),
};

export const Bullet: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-5">
      <BulletChart value={72} target={90} max={120} label="Active users" />
      <BulletChart value={32} target={40} max={60} q1={25} q2={48} label="Churn risk" />
      <BulletChart value={115} target={110} max={150} label="Feature requests" />
    </div>
  ),
};