import { Avatar, AvatarGroup } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    name: "Ada Lovelace",
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: {
    name: "Ada Lovelace",
    src: "https://i.pravatar.cc/96?img=47",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Small One" size="sm" />
      <Avatar name="Medium One" />
      <Avatar name="Large One" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup
      max={4}
      size="md"
      avatars={[
        { name: "Ada Lovelace" },
        { name: "Grace Hopper" },
        { name: "Katherine Johnson", src: "https://i.pravatar.cc/96?img=44" },
        { name: "Alan Turing" },
        { name: "Margaret Hamilton" },
        { name: "Edsger Dijkstra" },
        { name: "Barbara Liskov" },
      ]}
    />
  ),
};