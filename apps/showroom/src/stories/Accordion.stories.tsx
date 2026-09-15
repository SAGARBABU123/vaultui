import { Accordion } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: {
    multiple: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  {
    title: "Is Vault UI free?",
    content: "Yes — the free tier covers all core components under the MIT-style commercial license.",
  },
  {
    title: "Can I use it in commercial projects?",
    content: "Absolutely. The commercial license is included with every paid tier.",
  },
  {
    title: "Do components support dark mode?",
    content: "Every surface is token-driven, so themes swap in one line: document.documentElement.dataset.theme.",
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Accordion items={items} />
    </div>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Accordion multiple items={items} />
    </div>
  ),
};