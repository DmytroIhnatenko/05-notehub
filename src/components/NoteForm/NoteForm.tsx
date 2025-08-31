import React from "react";
import { Formik, Form, Field, ErrorMessage as FMError } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { CreateNoteDto } from "../../services/noteServices"; 

const TAGS = ["Todo","Work","Personal","Meeting","Shopping"] as const;
export type Tag = typeof TAGS[number];

const schema = Yup.object({
  title: Yup.string().min(3, "Min 3").max(50, "Max 50").required("Required"),
  content: Yup.string().max(500, "Max 500"),
  tag: Yup.string().oneOf(TAGS, "Invalid tag").required("Required"),
});

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: CreateNoteDto) => void;
  isSubmitting?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCancel, onSubmit, isSubmitting }) => {
  const initialValues: CreateNoteDto = { title: "", content: "", tag: "Todo" };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
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
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </Field>
            <FMError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={!isValid || !!isSubmitting}>
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
