import { Switch } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    label: "Toggle",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = { args: { defaultChecked: false } };

export const On: Story = { args: { defaultChecked: true } };

export const Small: Story = { args: { size: "sm", defaultChecked: true } };

export const WithLabel: Story = {
  args: { defaultChecked: true, label: "Push notifications" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled toggle" },
};

export const SettingsRow: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-4">
      {[
        { label: "Email digests", on: true },
        { label: "Weekly report", on: true },
        { label: "Product tips", on: false },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-surface-700">{row.label}</span>
          <Switch defaultChecked={row.on} label={row.label} />
        </div>
      ))}
    </div>
  ),
};