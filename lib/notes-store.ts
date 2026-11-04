import { useSyncExternalStore } from "react";
import { parseNotes, STORAGE_KEY, type Note } from "./notes";

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedNotes: Note[] = [];

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// useSyncExternalStore needs a stable reference, so only re-parse when the raw string changes.
function getSnapshot(): Note[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedNotes = parseNotes(raw);
  }
  return cachedNotes;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Keep other tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeNotes(notes: Note[]): boolean {
  let ok = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    ok = false;
  }
  listeners.forEach((l) => l());
  return ok;
}

/** Notes from localStorage, or null during server render before the browser takes over. */
export function useNotes(): Note[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
