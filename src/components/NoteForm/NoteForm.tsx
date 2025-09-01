// src/components/NoteForm/NoteForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage as FMError } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteServices"; 
import type { CreateNoteDto } from "../../services/noteServices";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
export type Tag = (typeof TAGS)[number];

const schema = Yup.object({
  title: Yup.string().trim().min(3, "Min 3").max(50, "Max 50").required("Required"),
  content: Yup.string().trim().max(500, "Max 500"),
  tag: Yup.string().oneOf(TAGS, "Invalid tag").required("Required"),
});

interface NoteFormProps {
  onCancel: () => void;              
}

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const qc = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: CreateNoteDto) => createNote(values),
    onSuccess: () => {
     
      qc.invalidateQueries({ queryKey: ["notes"] });
     
      onCancel();
    },
  });

  const initialValues: CreateNoteDto = { title: "", content: "", tag: "Todo" };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => mutate(values)}
    >
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FMError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <FMError name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <FMError name="tag" component="span" className={css.error} />
          </div>

          {isError && (
            <div className={css.error} role="alert">
              {(error as Error)?.message || "Failed to create note"}
            </div>
          )}

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={!isValid || isPending}>
              {isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
