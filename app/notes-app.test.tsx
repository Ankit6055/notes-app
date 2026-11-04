import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { STORAGE_KEY } from "@/lib/notes";
import { NotesApp } from "./notes-app";

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

beforeEach(() => localStorage.clear());
afterEach(cleanup);

test("creates a note and saves what you type to localStorage", async () => {
  const user = userEvent.setup();
  render(<NotesApp />);
  expect(screen.getByText(/No notes yet/)).toBeTruthy();

  await user.click(screen.getAllByRole("button", { name: "New note" })[0]);
  await user.keyboard("Groceries"); // new note's title is focused
  await user.type(screen.getByRole("textbox", { name: "Note" }), "Eggs and rice");

  expect(stored()).toMatchObject([{ title: "Groceries", body: "Eggs and rice" }]);
  const item = screen.getByRole("button", { name: /Groceries/ });
  expect(item.getAttribute("aria-current")).toBe("true");
});

test("lists saved notes newest first and opens one for editing", async () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      { id: "1", title: "Older", body: "", updatedAt: 1 },
      { id: "2", title: "Newer", body: "Draft", updatedAt: 2 },
    ]),
  );
  const user = userEvent.setup();
  render(<NotesApp />);

  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items[0]).toMatch(/^Newer/);
  expect(items[1]).toMatch(/^Older/);

  await user.click(screen.getByRole("button", { name: /Older/ }));
  const title = screen.getByRole("textbox", { name: "Title" });
  await user.clear(title);
  await user.type(title, "Renamed");

  expect(stored().find((n: { id: string }) => n.id === "1").title).toBe("Renamed");
  expect(screen.getByRole("button", { name: /Renamed/ })).toBeTruthy();
});
