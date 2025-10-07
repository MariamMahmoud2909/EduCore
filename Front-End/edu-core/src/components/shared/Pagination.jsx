import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const items = [];
  const maxPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <BSPagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page}
      </BSPagination.Item>
    );
  }

  return (
    <BSPagination className="justify-content-center">
      <BSPagination.First 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1} 
      />
      <BSPagination.Prev 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      {items}
      <BSPagination.Next 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
      <BSPagination.Last 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    </BSPagination>
  );
};

export default Pagination;