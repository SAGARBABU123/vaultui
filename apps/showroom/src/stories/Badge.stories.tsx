import { Badge } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "success", "warning", "danger", "info"],
    },
    size: { control: "select", options: ["sm", "md"] },
    dot: { control: "boolean" },
  },
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { variant: "neutral", children: "Neutral" } };
export const Brand: Story = { args: { variant: "brand", children: "Brand" } };
export const Success: Story = { args: { variant: "success", children: "Active" } };
export const Warning: Story = { args: { variant: "warning", children: "Pending" } };
export const Danger: Story = { args: { variant: "danger", children: "Blocked" } };
export const Info: Story = { args: { variant: "info", children: "Info" } };

export const WithDot: Story = {
  args: { variant: "success", dot: true, children: "Live" },
};

export const Small: Story = {
  args: { variant: "brand", size: "sm", children: "v1.2.0" },
};

export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="brand">Brand</Badge>
      <Badge variant="success" dot>Live</Badge>
      <Badge variant="warning">Beta</Badge>
      <Badge variant="danger" dot>Offline</Badge>
      <Badge variant="info">New</Badge>
      <Badge variant="neutral">Archived</Badge>
    </div>
  ),
};