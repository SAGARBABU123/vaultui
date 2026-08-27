import type { Preview } from "@storybook/react";

// Load design tokens globally so every story is themed
import "@vaultui/tokens/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Introduction", ["Welcome"], "Free Tier", ["Button"]],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;