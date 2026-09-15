import { Tabs } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  argTypes: {
    ariaLabel: { control: "text" },
  },
  args: {
    ariaLabel: "Documentation sections",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabs = [
  { id: "overview", label: "Overview", content: <p className="m-0 text-sm text-surface-600">Install, import and theme Vault UI in under a minute.</p> },
  { id: "usage", label: "Usage", content: <p className="m-0 text-sm text-surface-600">Copy-paste snippets for every component and variant.</p> },
  { id: "api", label: "API", content: <p className="m-0 text-sm text-surface-600">Full prop tables, events and accessibility notes.</p> },
  { id: "changelog", label: "Changelog", content: <p className="m-0 text-sm text-surface-600">What's new in each release.</p>, disabled: true },
];

export const Default: Story = {
  render: (args) => <Tabs {...args} tabs={tabs} defaultValue="overview" />,
};

export const SecondTabActive: Story = {
  render: (args) => <Tabs {...args} tabs={tabs} defaultValue="usage" />,
};