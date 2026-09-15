import { CodeBlock } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  argTypes: {
    language: { control: "text" },
    title: { control: "text" },
    copyable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const example = `import { Button, Badge } from "@vaultui/ui";

export function Hero({ plan }) {
  return (
    <div className="flex items-center gap-3">
      <Badge variant="success" dot>Live</Badge>
      <Button size="lg" leadingIcon={<SparklesIcon />}>
        Get started
      </Button>
    </div>
  );
}`;

export const Default: Story = {
  args: {
    code: example,
    language: "tsx",
    title: "Hero.tsx",
  },
};

export const NoTitle: Story = {
  args: {
    code: `const token = "theme";
export default token;`,
    language: "ts",
  },
};

export const NotCopyable: Story = {
  args: {
    code: example,
    language: "tsx",
    copyable: false,
  },
};