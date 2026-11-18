# @vaultui/icons-mcp

MCP server for [Abhayaui Icons](https://icons.abhayaui.workers.dev) — 2,474 original icons in six weights (`thin`, `light`, `regular`, `bold`, `fill`, `duotone`).

Lets Claude, Cursor, VS Code and any MCP client search the library, fetch the exact SVG, and get correct React / Vue / Svelte imports instead of guessing names.

## Remote endpoint

```json
{
  "mcpServers": {
    "vaultui-icons": {
      "type": "streamable-http",
      "url": "https://icons.abhayaui.workers.dev/mcp"
    }
  }
}
```

No auth, read-only, stateless.

## Local (stdio)

```bash
npx -y @vaultui/icons-mcp
```

```json
{
  "mcpServers": {
    "vaultui-icons": {
      "command": "npx",
      "args": ["-y", "@vaultui/icons-mcp"]
    }
  }
}
```

Set `VAULTUI_ICONS_BASE` to point at a different deployment (default `https://icons.abhayaui.workers.dev`).

## Tools

| Tool | Description |
| --- | --- |
| `search_icons` | Fuzzy search by concept, name, tag or alias; paginated. |
| `get_icon` | SVG + import/usage for React, Vue, Svelte or HTML; weight, size, color. |
| `list_categories` | Ten categories with ids, labels and counts. |
| `list_icons` | Page through the inventory, optionally by category. |
| `get_usage` | Install and usage instructions. |

## Development

```bash
pnpm --filter @vaultui/icons build        # generates the icon dataset
pnpm --filter @vaultui/icons-mcp build    # generates the MCP index + bundles dist
node --test packages/icons-mcp/test
```

License: MIT. Icon geometry generated from Phosphor Icons (MIT) — see `packages/icons/THIRD-PARTY.md`.
