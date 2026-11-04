"use client";

import { useEffect, useRef, useState } from "react";
import { createNote, displayTitle, preview, sortByRecent, updateNote, type Note } from "@/lib/notes";
import { useNotes, writeNotes } from "@/lib/notes-store";

function formatSaved(ts: number): string {
  const d = new Date(ts);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function NotesApp() {
  const notes = useNotes();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const all = notes ?? [];
  const active = all.find((n) => n.id === activeId) ?? null;

  function save(next: Note[]) {
    setSaveFailed(!writeNotes(next));
  }

  function handleCreate() {
    const note = createNote();
    save([note, ...all]);
    setActiveId(note.id);
  }

  return (
    <div className="app" data-view={active ? "editor" : "list"}>
      <aside className="cover" aria-label="Your notes">
        <div className="cover-head">
          <h1 className="cover-title">Notes</h1>
          <button type="button" className="new-button" onClick={handleCreate} disabled={!notes}>
            New note
          </button>
        </div>

        {notes && all.length === 0 && (
          <p className="cover-empty">No notes yet. What you write stays in this browser.</p>
        )}

        <ul className="note-list">
          {sortByRecent(all).map((note) => (
            <li key={note.id}>
              <button
                type="button"
                className="note-item"
                aria-current={note.id === activeId ? "true" : undefined}
                onClick={() => setActiveId(note.id)}
              >
                <span className="note-item-title">{displayTitle(note)}</span>
                {preview(note) && <span className="note-item-preview">{preview(note)}</span>}
                <span className="note-item-date">{formatSaved(note.updatedAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="page">
        {saveFailed && (
          <p role="alert" className="save-error">
            This browser blocked saving. Free up site storage or leave private browsing, then edit
            again to retry.
          </p>
        )}
        {active ? (
          <Editor
            key={active.id}
            note={active}
            onBack={() => setActiveId(null)}
            onChange={(changes) => save(updateNote(all, active.id, changes))}
          />
        ) : (
          <div className="page-empty">
            <p>
              {all.length > 0
                ? "Pick a note from the list, or start a new one."
                : "Your notes are kept in this browser and never leave it."}
            </p>
            <button type="button" className="text-button" onClick={handleCreate} disabled={!notes}>
              New note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Editor({
  note,
  onBack,
  onChange,
}: {
  note: Note;
  onBack: () => void;
  onChange: (changes: Partial<Pick<Note, "title" | "body">>) => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note.title && !note.body) titleRef.current?.focus();
    // Only on open: focus a fresh note's title so typing can start immediately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="editor">
      <button type="button" className="back-button" onClick={onBack}>
        All notes
      </button>
      <input
        ref={titleRef}
        className="editor-title"
        aria-label="Title"
        placeholder="Untitled note"
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <p className="editor-meta">Saved {formatSaved(note.updatedAt)}</p>
      <textarea
        className="editor-body"
        aria-label="Note"
        placeholder="Start writing…"
        value={note.body}
        onChange={(e) => onChange({ body: e.target.value })}
      />
    </article>
  );
}
