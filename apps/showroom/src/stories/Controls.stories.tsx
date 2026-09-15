import { useState } from "react";
import {
  Button,
  Combobox as VaultCombobox,
  CopyButton as VaultCopyButton,
  DropdownMenu as VaultDropdownMenu,
  Kbd as VaultKbd,
  Slider as VaultSlider,
  Stepper as VaultStepper,
} from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VaultKbd> = {
  title: "Components/Controls",
  component: VaultKbd,
};

export default meta;
type Story = StoryObj<typeof VaultKbd>;

export const Keyboard: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 text-sm text-surface-600">
      <span>Press <VaultKbd>⌘</VaultKbd> <VaultKbd>K</VaultKbd> to search</span>
      <span>
        <VaultKbd>Shift</VaultKbd> + <VaultKbd>?</VaultKbd> for shortcuts
      </span>
    </div>
  ),
};

export const Slider: Story = {
  render: () => {
    const [value, setValue] = useState(42);
    return (
      <div className="w-full max-w-sm space-y-5">
        <VaultSlider label="Budget" min={0} max={1000} step={10} value={value} onChange={setValue} />
        <VaultSlider label="Volume" value={70} onChange={(v) => setValue(v)} />
      </div>
    );
  },
};

export const CopyButton: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <VaultCopyButton value="pnpm add @vaultui/ui" label="Copy install command" />
      <VaultCopyButton value="npx storybook dev" size="md" label="Copy storybook command" />
      <VaultCopyButton value="git clone https://github.com/vault-ui/vault-ui" size="lg" label="Copy clone command" />
    </div>
  ),
};

export const Combobox: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("react");
    return (
      <div className="w-full max-w-xs">
        <VaultCombobox
          value={value}
          onValueChange={setValue}
          placeholder="Search frameworks…"
          options={[
            { label: "React", value: "react", keywords: ["vite", "spa"] },
            { label: "Vue", value: "vue", keywords: ["vite"] },
            { label: "Svelte", value: "svelte", keywords: ["kit"] },
            { label: "Solid", value: "solid", keywords: ["vite"] },
            { label: "Angular", value: "angular", keywords: ["cli"] },
          ]}
        />
      </div>
    );
  },
};

export const Dropdown: Story = {
  render: () => (
    <div className="p-8">
      <VaultDropdownMenu
        trigger={<Button variant="secondary">Actions</Button>}
        items={[
          { label: "Rename", onSelect: () => alert("rename") },
          { label: "Duplicate", onSelect: () => alert("duplicate") },
          { separator: true },
          { label: "Archive", onSelect: () => alert("archive") },
          { label: "Delete", danger: true, onSelect: () => alert("delete") },
        ]}
      />
    </div>
  ),
};

export const Stepper: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <VaultStepper
        current={1}
        steps={[
          { label: "Details", description: "Project name & repo" },
          { label: "Billing", description: "Choose a plan" },
          { label: "Deploy", description: "Ship to production" },
        ]}
      />
    </div>
  ),
};