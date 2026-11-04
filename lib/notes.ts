export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export const STORAGE_KEY = "notes-app:v1";

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  const n = value as Record<string, unknown>;
  return (
    typeof n.id === "string" &&
    typeof n.title === "string" &&
    typeof n.body === "string" &&
    typeof n.updatedAt === "number"
  );
}

/** Parse stored JSON, dropping anything that isn't a well-formed note. */
export function parseNotes(raw: string | null): Note[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isNote) : [];
  } catch {
    return [];
  }
}

export function createNote(now = Date.now(), id = crypto.randomUUID()): Note {
  return { id, title: "", body: "", updatedAt: now };
}

export function updateNote(
  notes: Note[],
  id: string,
  changes: Partial<Pick<Note, "title" | "body">>,
  now = Date.now(),
): Note[] {
  return notes.map((n) => (n.id === id ? { ...n, ...changes, updatedAt: now } : n));
}

export function sortByRecent(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function displayTitle(note: Note): string {
  return note.title.trim() || "Untitled note";
}

export function preview(note: Note, max = 80): string {
  const line = note.body.split("\n").find((l) => l.trim()) ?? "";
  const text = line.trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
