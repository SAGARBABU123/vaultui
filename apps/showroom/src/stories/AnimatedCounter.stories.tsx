import { useState } from "react";
import { AnimatedCounter } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AnimatedCounter> = {
  title: "Charts/AnimatedCounter",
  component: AnimatedCounter,
  argTypes: {
    value: { control: { type: "number" } },
    duration: { control: { type: "number", min: 0, max: 4000, step: 100 } },
  },
  args: {
    value: 48290,
    duration: 800,
    format: (n) => Math.round(n).toLocaleString(),
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {};

export const Currency: Story = {
  args: {
    value: 1234567,
    format: (n) => `$${Math.round(n).toLocaleString()}`,
  },
};

export const Percent: Story = {
  args: {
    value: 87.3,
    duration: 1200,
    format: (n) => `${n.toFixed(1)}%`,
  },
};

export const StepDemo: Story = {
  render: (args) => {
    const [value, setValue] = useState(10);
    const numbers = [10, 26, 41, 58, 73, 95, 100];
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="text-4xl font-bold tracking-tight text-surface-900">
          <AnimatedCounter value={value} duration={500} format={(n) => Math.round(n).toString()} />
        </div>
        <div className="flex flex-wrap gap-2">
          {numbers.map((n) => (
            <button
              key={n}
              onClick={() => setValue(n)}
              className="rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-200"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  },
};