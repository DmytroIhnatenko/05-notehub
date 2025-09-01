// src/components/App/App.tsx
import { useState } from "react";
import {
  useQuery,
 
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../services/noteService"; 
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { Loader } from "../Loader/Loader";
import ErrorMessage from "../Error/Error"; 
import css from "./App.module.css";

const PER_PAGE = 12;

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
 
  const [isCreateOpen, setCreateOpen] = useState(false);
   

 
 
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
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

      {isError && (
        <ErrorMessage message={(error as Error)?.message} onRetry={() => refetch()} />
      )}

      {!isPending && !isFetching && !isError && notes.length === 0 && (
        <div style={{ padding: 16 }}>No notes yet</div>
      )}

      {notes.length > 0 && <NoteList items={notes} />}

      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)}>
      
        <NoteForm onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
};

export default App; 
