// src/components/Pagination/Pagination.tsx
import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;              
  currentPage: number;            
  onPageChange: (page: number) => void; 
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <nav aria-label="Notes pagination" className={css.wrapper}>
      <ReactPaginate
        pageCount={pageCount}
        forcePage={currentPage - 1}
        onPageChange={(sel) => onPageChange(sel.selected + 1)}
        containerClassName={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousClassName={css.prevNext}
        nextClassName={css.prevNext}
        disabledClassName={css.disabled}
        previousLabel="←"
        nextLabel="→"
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
      />
    </nav>
  );
};

export default Pagination;
