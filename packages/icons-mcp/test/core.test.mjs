import assert from "node:assert/strict";
import test from "node:test";
import { createCore, MCP_INDEX, componentName } from "../dist/index.js";

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"></svg>';

function core() {
  return createCore(MCP_INDEX, async () => ({ house: SVG }), "https://example.test");
}

test("index matches the generated inventory", () => {
  assert.equal(MCP_INDEX.total, 2474);
  assert.equal(MCP_INDEX.categories.length, 10);
  assert.equal(MCP_INDEX.icons.length, MCP_INDEX.total);
  assert.deepEqual(MCP_INDEX.weights, ["thin", "light", "regular", "bold", "fill", "duotone"]);
});

test("search finds canonical names", () => {
  const result = core().search({ query: "home", limit: 10 });
  assert.ok(result.total > 0);
  assert.ok(result.items.some((icon) => icon.name === "house"));
  assert.equal(result.items.length, Math.min(10, result.total));
});

test("search is paginated with a cursor", () => {
  const first = core().search({ query: "arrow", limit: 5 });
  assert.equal(first.items.length, 5);
  assert.ok(first.nextCursor);
  const second = core().search({ query: "arrow", limit: 5, cursor: first.nextCursor });
  assert.ok(second.items.length > 0);
  assert.notDeepEqual(
    first.items.map((icon) => icon.name),
    second.items.map((icon) => icon.name),
  );
});

test("category filter is validated and applied", () => {
  const result = core().list({ category: "core-ui", limit: 100 });
  assert.equal(result.total, 435);
  assert.ok(result.items.every((icon) => icon.category === "core-ui"));
  assert.throws(() => core().list({ category: "nope" }), /Unknown category/);
});

test("get resolves icon metadata", () => {
  const meta = core().get("house");
  assert.ok(meta);
  assert.equal(meta.name, "house");
  assert.equal(meta.pageUrl, "https://example.test/icons/house");
});

test("render returns svg and framework imports", async () => {
  const result = await core().render({ name: "house", weight: "bold", format: "react" });
  assert.equal(result.name, "house");
  assert.equal(componentName("house", "bold"), "HouseBold");
  assert.match(result.importLine ?? "", /HouseBold.*@vaultui\/icons-react/);
  assert.match(result.svg, /<svg/);
});

test("render rejects unknown icons and bad input", async () => {
  await assert.rejects(() => core().render({ name: "not-an-icon", weight: "regular", format: "svg" }), /Unknown icon/);
  await assert.rejects(() => core().render({ name: "house", weight: "nope", format: "svg" }), /Unknown weight/);
  await assert.rejects(
    () => core().render({ name: "house", weight: "regular", format: "svg", color: "red" }),
    /color must be/,
  );
});
