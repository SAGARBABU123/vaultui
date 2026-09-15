import { useState } from "react";
import { Calendar } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  argTypes: {
    weekStart: { control: { type: "select", options: [0, 1] } },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: (args) => <Calendar {...args} />,
};

export const Selectable: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="space-y-3">
        <Calendar value={date} onSelect={setDate} {...args} />
        <p className="text-sm text-surface-500">
          Selected: {date ? date.toDateString() : "none"}
        </p>
      </div>
    );
  },
};

export const MondayStart: Story = {
  render: (args) => <Calendar weekStart={1} value={new Date()} />,
};