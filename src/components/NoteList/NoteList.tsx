import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService"; 
import css from "./NoteList.module.css";

interface NoteListProps {
  items: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ items }) => {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      // после удаления перезапрашиваем список
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  if (!items.length) return null;

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
              onClick={() => mutate(n.id)}
              disabled={deletingId === n.id || isPending}
            >
              {deletingId === n.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
      {isError && (
        <li className={css.listItem}>
          <div className={css.error}>
            {(error as Error)?.message || "Failed to delete note"}
          </div>
        </li>
      )}
    </ul>
  );
};

export default NoteList;
