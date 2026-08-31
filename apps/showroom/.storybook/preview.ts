import type { Preview } from "@storybook/react";

// Design tokens + Tailwind entry (imports @vaultui/tokens/tokens.css)
import "./tailwind.css";
// Scan-independent component styles
import "@vaultui/ui/button.css";
import "@vaultui/ui/primitives.css";
import "@vaultui/data-viz/dataviz.css";
import "@vaultui/marketing/marketing.css";

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