import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'lacasitademathi_favs_v1';
const FAVORITES_UPDATED_EVENT = 'mathi:favorites-updated';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function readFavorites(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(productId: string): string[] {
  const current = readFavorites();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  if (isBrowser()) {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: next }));
    } catch {
      // ignore storage errors
    }
  }
  return next;
}

export function useFavorites(): {
  favorites: string[];
  toggleFavorite: (id: string) => void;
} {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
    const sync = () => setFavorites(readFavorites());

    window.addEventListener(FAVORITES_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return {
    favorites,
    toggleFavorite: (id: string) => setFavorites(toggleFavoriteId(id)),
  };
}
