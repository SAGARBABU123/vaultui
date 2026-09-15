import { StatBand } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof StatBand> = {
  title: "Marketing/StatBand",
  component: StatBand,
};

export default meta;
type Story = StoryObj<typeof StatBand>;

export const Default: Story = {
  render: () => (
    <div className="rounded-2xl bg-surface-0 p-6 shadow-soft sm:p-8">
      <StatBand
        stats={[
          { value: "4,000+", label: "Teams building with Vault UI" },
          { value: "120+", label: "Ready-made components" },
          { value: "4", label: "Design themes out of the box" },
          { value: "99.9%", label: "Storybook uptime" },
        ]}
      />
    </div>
  ),
};