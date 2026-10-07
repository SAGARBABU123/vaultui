import { useEffect, useState } from "react";

/**
 * Pinned docs entries (localStorage) + a tiny subscription so every surface
 * (overview, component header, palette) stays in sync without a store lib.
 */

const KEY = "vaultui.favorites.v1";
const EVENT = "vaultui:favorites-change";

export function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): void {
  if (!id) return;
  try {
    const current = readFavorites();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — pins are a progressive enhancement */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Reactive favorites for React surfaces. */
export function useFavorites(): {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
} {
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());

  useEffect(() => subscribe(() => setFavorites(readFavorites())), []);

  return {
    favorites,
    isFavorite: (id: string) => favorites.includes(id),
    toggle: (id: string) => toggleFavorite(id),
  };
}
