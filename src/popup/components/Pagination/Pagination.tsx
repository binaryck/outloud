import React from "react";
import Button from "../Button/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 2) {
        pages.push("...");
      }

      // Show only current page if it's not first or last
      if (currentPage > 1 && currentPage < totalPages) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          text="Prev"
          icon={false}
          variant="ghost"
        />

        <div className="pagination-pages">
          {generatePageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="pagination-ellipsis">...</span>
              ) : (
                <Button
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  text={page.toString()}
                  icon={false}
                  variant={page === currentPage ? "primary" : "ghost"}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          text="Next"
          icon={false}
          variant="ghost"
        />
      </div>

      <div className="pagination-info">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
}
