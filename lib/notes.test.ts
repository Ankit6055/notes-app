import { describe, expect, test } from "vitest";
import { createNote, displayTitle, parseNotes, preview, sortByRecent, updateNote } from "./notes";

const note = (id: string, updatedAt: number, title = "", body = "") => ({ id, title, body, updatedAt });

describe("parseNotes", () => {
  test("returns an empty list for missing, broken or non-array data", () => {
    expect(parseNotes(null)).toEqual([]);
    expect(parseNotes("{not json")).toEqual([]);
    expect(parseNotes('{"id":"a"}')).toEqual([]);
  });

  test("keeps valid notes and drops malformed entries", () => {
    const raw = JSON.stringify([note("a", 1, "Hi"), { id: "b" }, null, "x"]);
    expect(parseNotes(raw)).toEqual([note("a", 1, "Hi")]);
  });
});

test("createNote starts blank with the given time", () => {
  expect(createNote(42, "id-1")).toEqual(note("id-1", 42));
});

test("updateNote changes only the target note and bumps its time", () => {
  const notes = [note("a", 1, "A"), note("b", 2, "B")];
  const next = updateNote(notes, "a", { body: "hello" }, 10);
  expect(next).toEqual([note("a", 10, "A", "hello"), note("b", 2, "B")]);
  expect(notes[0].body).toBe("");
});

test("sortByRecent puts the newest first without mutating", () => {
  const notes = [note("old", 1), note("new", 3), note("mid", 2)];
  expect(sortByRecent(notes).map((n) => n.id)).toEqual(["new", "mid", "old"]);
  expect(notes[0].id).toBe("old");
});

test("displayTitle and preview fall back sensibly", () => {
  expect(displayTitle(note("a", 1, "   "))).toBe("Untitled note");
  expect(preview(note("a", 1, "", "\n\n  first line \nsecond"))).toBe("first line");
  expect(preview(note("a", 1, "", "x".repeat(100)), 10)).toBe("xxxxxxxxx…");
});
