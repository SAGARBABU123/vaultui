import { useState } from "react";
import { Checkbox as VaultCheckbox, RadioGroup as VaultRadioGroup } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VaultCheckbox> = {
  title: "Components/Checkbox & Radio",
  component: VaultCheckbox,
};

export default meta;
type Story = StoryObj<typeof VaultCheckbox>;

export const Checkbox: Story = {
  render: () => (
    <div className="space-y-3">
      <VaultCheckbox defaultChecked>Accept terms</VaultCheckbox>
      <VaultCheckbox>Subscribe to updates</VaultCheckbox>
      <VaultCheckbox disabled>Legacy option (disabled)</VaultCheckbox>
    </div>
  ),
};

export const RadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState("pro");
    return (
      <VaultRadioGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise", value: "enterprise" },
          { label: "Retired plan", value: "legacy", disabled: true },
        ]}
      />
    );
  },
};