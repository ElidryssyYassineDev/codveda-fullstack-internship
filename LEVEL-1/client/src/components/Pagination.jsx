import { ChevronLeft, ChevronRight } from 'lucide-react'

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      <button className="btn btn--secondary" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={15} />
      </button>
      <span className="pagination__label">Page {page} of {totalPages}</span>
      <button className="btn btn--secondary" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

export default Pagination