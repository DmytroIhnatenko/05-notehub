// src/components/NoteList/NoteList.tsx
import React from "react";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  items: Note[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

const NoteList: React.FC<NoteListProps> = ({ items, onDelete, deletingId }) => {
  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          {n.content && <p className={css.content}>{n.content}</p>}
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button
              className={css.button}
              onClick={() => onDelete?.(n.id)}
              disabled={deletingId === n.id}
            >
              {deletingId === n.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
