/**
 * Recently-viewed docs entries (localStorage). Powers the "Recent" group in
 * the ⌘K palette so a user can jump back to what they were just reading
 * without hunting through the rail.
 */

const KEY = "vaultui.recent.v1";
const MAX = 6;

export function readRecents(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]).slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecent(id: string): void {
  if (!id || id === "overview") return;
  try {
    const next = [id, ...readRecents().filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — recents are a progressive enhancement */
  }
}
