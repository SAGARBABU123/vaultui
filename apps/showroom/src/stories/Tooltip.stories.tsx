import { Tooltip, Button } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: { control: "select", options: ["top", "bottom"] },
    label: { control: "text" },
  },
  args: {
    label: "Tooltip label",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6 p-6">
      <Tooltip {...args} label="Save changes">
        <Button variant="primary">Save</Button>
      </Tooltip>
    </div>
  ),
};

export const Bottom: Story = {
  render: (args) => (
    <div className="p-6">
      <Tooltip {...args} label="Copies the share link" placement="bottom">
        <Button variant="secondary">Share</Button>
      </Tooltip>
    </div>
  ),
};

export const PlainTextTrigger: Story = {
  render: (args) => (
    <div className="p-6">
      <Tooltip {...args} label="Hover me, I'm helpful">
        <span className="cursor-help underline decoration-dotted underline-offset-4">What is a token?</span>
      </Tooltip>
    </div>
  ),
};