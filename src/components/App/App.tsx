
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, deleteNote, createNote} from "../../services/noteServices"; 
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
//import type { FetchNotesResponse } from "../../services/noteServices";
import SearchBox from "../SearchBox/SearchBox";           
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { Loader } from "../Loader/Loader";
import ErrorMessage from "../Error/Error"; 
import css from "./App.module.css";
import {useMutation, useQueryClient,  } from "@tanstack/react-query";


const PER_PAGE = 12;

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const qc = useQueryClient();
const [deletingId, setDeletingId] = useState<string | null>(null);
const [isCreateOpen, setCreateOpen] = useState(false);


const { mutate: addNote, isPending: isCreating } = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    setCreateOpen(false);
    setPage(1);
    qc.invalidateQueries({ queryKey: ["notes"] });
  },
});


const { mutate: removeNote } = useMutation({
  mutationFn: (id: string) => deleteNote(id),
  onSuccess: () => {
   
    qc.invalidateQueries({ queryKey: ["notes"] });
  },
  onSettled: () => setDeletingId(null),
});



  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const notes = data?.notes ?? [];      // ← было data?.data
const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  
const handleDelete = (id: string) => {
  setDeletingId(id);
  removeNote(id);
};

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
     <button className={css.button} onClick={() => setCreateOpen(true)}>
  Create note +
</button>
      </header>
      
      {(isPending || isFetching) && <Loader />}



{notes.length > 0 && (
  <NoteList items={notes} onDelete={handleDelete} deletingId={deletingId} />
)}

{!isPending && !isFetching && !isError && notes.length === 0 && (
  <div style={{ padding: 16 }}>No notes yet</div>
)}
      {isError && (
        <ErrorMessage
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      )}

      
      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)}>
  <NoteForm
    onCancel={() => setCreateOpen(false)}
    onSubmit={(values) => addNote(values)}
    isSubmitting={isCreating}
  />
</Modal>
    </div>
  );
};

export default App;
