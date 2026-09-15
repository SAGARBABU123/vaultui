import { Breadcrumb } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Components", href: "#" },
        { label: "Navigation" },
      ]}
    />
  ),
};

export const Deep: Story = {
  render: (args) => (
    <Breadcrumb
      items={[
        { label: "Workspace", href: "#" },
        { label: "Projects", href: "#" },
        { label: "Acme Corp", href: "#" },
        { label: "Settings" },
      ]}
    />
  ),
};