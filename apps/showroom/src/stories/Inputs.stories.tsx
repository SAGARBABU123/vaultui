import { Field, Input as VaultInput, Select as VaultSelect, Textarea as VaultTextarea } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Field> = {
  title: "Components/Form Inputs",
  component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

const options = [
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "enterprise" },
];

export const Input: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-4">
      <Field label="Email" hint="We'll never share it.">
        <VaultInput type="email" placeholder="you@company.com" />
      </Field>
      <Field label="With error" error="That email is already in use.">
        <VaultInput defaultValue="ada@vaultui.dev" aria-invalid />
      </Field>
      <VaultInput placeholder="Bare input" />
    </div>
  ),
};

export const Select: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <Field label="Plan">
        <VaultSelect options={options} placeholder="Choose a plan" />
      </Field>
    </div>
  ),
};

export const Textarea: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Field label="Release notes" hint="Markdown supported.">
        <VaultTextarea placeholder="What changed in this release…" />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-3">
      <VaultInput size="sm" placeholder="Small" />
      <VaultInput placeholder="Medium (default)" />
      <VaultInput size="lg" placeholder="Large" />
    </div>
  ),
};