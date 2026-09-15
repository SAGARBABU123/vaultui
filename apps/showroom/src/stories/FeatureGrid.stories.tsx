import { FeatureGrid } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FeatureGrid> = {
  title: "Marketing/Feature Grid",
  component: FeatureGrid,
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
      <path fillRule="evenodd" d={d} clipRule="evenodd" />
    </svg>
  );
}

export const Default: Story = {
  render: () => (
    <div className="bg-surface-50 p-6 sm:p-10">
      <FeatureGrid
        features={[
          {
            icon: <Icon d="M5.5 3a.75.75 0 0 0-.75.75v.5c0 .414-.336.75-.75.75h-.5a.75.75 0 0 0 0 1.5h.5c.414 0 .75.336.75.75v.5a.75.75 0 0 0 1.5 0V7.5c0-.414.336-.75.75-.75h.5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 1-.75-.75V3.75A.75.75 0 0 0 5.5 3Z" />,
            title: "Token-driven theming",
            body: "Swap light, dark and brand themes in one line — every surface re-skins automatically.",
          },
          {
            icon: <Icon d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
            title: "Zero dependencies",
            body: "Pure React + Tailwind. No charting library, no date engine, no lock-in.",
          },
          {
            icon: <Icon d="M11.3 1.046a1 1 0 0 1 1.36.578l.97 2.91 3.066.445a1 1 0 0 1 .555 1.706l-2.218 2.163.523 3.054a1 1 0 0 1-1.45 1.054L10 11.92l-2.738 1.44a1 1 0 0 1-1.45-1.055l.523-3.054L4.113 6.93a1 1 0 0 1 .554-1.706l3.067-.445.97-2.91a1 1 0 0 1 1.36-.578L10 1.75l1.3-.704Z" />,
            title: "WCAG 2.1 AA",
            body: "Rotving tabindexes, focus traps, aria wiring and reduced-motion support built in.",
          },
          {
            icon: <Icon d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v3.5c0 .198.079.389.22.53l2 2a.75.75 0 1 0 1.06-1.06L10.75 9.7V6.75Z" />,
            title: "Fast by default",
            body: "Sub-second story loads and tree-shaken builds — only what you import ships.",
          },
        ]}
      />
    </div>
  ),
};