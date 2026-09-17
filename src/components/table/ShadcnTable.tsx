import React, {useState, useMemo, useRef, useEffect} from 'react'
import {createPortal} from 'react-dom'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {useThemeMode} from '@/components/theme'

export interface ShadcnColumn<T> {
  id: string
  header: string
  accessor?: keyof T | ((item: T) => any)
  sortable?: boolean
  className?: string
  headerClassName?: string
  render?: (item: T, index: number) => React.ReactNode
}

interface ShadcnTableProps<T> {
  data: T[]
  columns: ShadcnColumn<T>[]
  defaultPageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  keyExtractor?: (item: T, index: number) => string | number
  onRowClick?: (item: T) => void
  highlightedRowId?: string | number | null
  highlightedColId?: string | null
}

export function ShadcnTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  emptyMessage = 'No records found',
  keyExtractor = (item, index) => item.id || index,
  onRowClick,
  highlightedRowId,
  highlightedColId,
}: ShadcnTableProps<T>) {
  const [columns, setColumns] = useState<ShadcnColumn<T>[]>(initialColumns)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [activeDropdownCol, setActiveDropdownCol] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{top: number; left: number}>({top: 0, left: 0})
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const {mode} = useThemeMode()

  // Update columns when initialColumns change
  useEffect(() => {
    setColumns(initialColumns)
  }, [initialColumns])

  // Close dropdown on outside click, window/table scroll, or window resize
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!activeDropdownCol) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownCol(null)
      }
    }

    const handleScrollOrResize = () => {
      setActiveDropdownCol(null)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [activeDropdownCol])

  // Handle Column Header click to toggle dropdown
  const handleHeaderClick = (e: React.MouseEvent, colId: string) => {
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const menuWidth = 175
    const menuHeight = 220

    // Viewport-relative top position (position-fixed: do NOT add window.scrollY)
    let top = rect.bottom + 4
    // If opening downwards exceeds viewport bottom, flip upwards above header
    if (top + menuHeight > window.innerHeight && rect.top > menuHeight) {
      top = Math.max(8, rect.top - menuHeight - 4)
    }

    // Viewport-relative left position (position-fixed: do NOT add window.scrollX)
    let left = rect.left
    // If opening to the right exceeds viewport width, align with right edge of header
    if (left + menuWidth > window.innerWidth - 10) {
      left = Math.max(10, rect.right - menuWidth)
    }

    setDropdownPosition({top, left})
    setActiveDropdownCol((prev) => (prev === colId ? null : colId))
  }

  // Column operations
  const handleSort = (colId: string, direction: 'asc' | 'desc') => {
    setSortColumn(colId)
    setSortDirection(direction)
    setActiveDropdownCol(null)
    setCurrentPage(1)
  }

  const handleMoveColumn = (colId: string, direction: 'left' | 'right') => {
    const idx = columns.findIndex((c) => c.id === colId)
    if (idx < 0) return
    const newIdx = direction === 'left' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= columns.length) return
    const newCols = [...columns]
    const [moved] = newCols.splice(idx, 1)
    newCols.splice(newIdx, 0, moved)
    setColumns(newCols)
    setActiveDropdownCol(null)
  }

  const handlePinColumn = (colId: string, position: 'left' | 'right') => {
    const idx = columns.findIndex((c) => c.id === colId)
    if (idx < 0) return
    const newCols = [...columns]
    const [pinned] = newCols.splice(idx, 1)
    if (position === 'left') {
      newCols.unshift(pinned)
    } else {
      newCols.push(pinned)
    }
    setColumns(newCols)
    setActiveDropdownCol(null)
  }

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data
    const col = columns.find((c) => c.id === sortColumn)
    if (!col) return data

    return [...data].sort((a, b) => {
      let valA: any
      let valB: any

      if (typeof col.accessor === 'function') {
        valA = col.accessor(a)
        valB = col.accessor(b)
      } else if (col.accessor) {
        valA = a[col.accessor]
        valB = b[col.accessor]
      } else {
        valA = a[col.id]
        valB = b[col.id]
      }

      if (valA === undefined || valA === null) valA = ''
      if (valB === undefined || valB === null) valB = ''

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }, [data, sortColumn, sortDirection, columns])

  // Paginated data
  const totalItems = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalItems, currentPage * pageSize)

  return (
    <div className='shadcn-table-wrapper w-100 rounded-3'>
      {/* Table Container */}
      <div className='table-responsive'>
        <table className='table align-middle gs-0 gy-4 mb-0' style={{minWidth: '700px'}}>
          <thead>
            <tr className='shadcn-table-header-row text-uppercase fs-8 fw-bold'>
              {columns.map((col) => {
                const isSorted = sortColumn === col.id
                return (
                  <th
                    key={col.id}
                    className={`py-3.5 px-4 text-nowrap user-select-none ${col.headerClassName || ''}`}
                    style={{cursor: 'pointer'}}
                    onClick={(e) => handleHeaderClick(e, col.id)}
                  >
                    <div className='shadcn-header-title d-inline-flex align-items-center gap-1.5 hover-primary'>
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className='text-gray-400'>
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={13} className='text-primary' />
                            ) : (
                              <ArrowDown size={13} className='text-primary' />
                            )
                          ) : (
                            <ArrowUpDown size={12} className='text-gray-400 opacity-60' />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className='shadcn-table-body fw-semibold fs-7'>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-10 text-muted fs-7'>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const rowKey = keyExtractor(item, rowIdx)
                const isHighlightedRow =
                  highlightedRowId != null && String(highlightedRowId) === String(rowKey)

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`shadcn-table-row transition-colors ${
                      isHighlightedRow ? 'shadcn-row-highlighted' : ''
                    }`}
                    style={{cursor: onRowClick ? 'pointer' : 'default'}}
                  >
                    {columns.map((col) => {
                      const isHighlightedCell =
                        isHighlightedRow &&
                        highlightedColId != null &&
                        col.id === highlightedColId

                      let cellContent: React.ReactNode = null
                      if (col.render) {
                        cellContent = col.render(item, rowIdx)
                      } else if (typeof col.accessor === 'function') {
                        cellContent = col.accessor(item)
                      } else if (col.accessor) {
                        cellContent = item[col.accessor]
                      } else {
                        cellContent = item[col.id]
                      }

                      return (
                        <td
                          key={col.id}
                          className={`py-3.5 px-4 align-middle ${col.className || ''} ${
                            isHighlightedCell ? 'shadcn-cell-highlighted' : ''
                          }`}
                        >
                          {cellContent}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Column Header Dropdown Menu (Rendered to body via Portal to avoid overflow clipping) */}
      {activeDropdownCol &&
        createPortal(
          <div
            ref={dropdownRef}
            className='card shadcn-column-dropdown position-fixed py-2 rounded-3'
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 99999,
              minWidth: '175px',
            }}
          >
            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handleSort(activeDropdownCol, 'asc')}
            >
              <ArrowUp size={14} className='text-muted' />
              <span>Asc</span>
            </button>
            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handleSort(activeDropdownCol, 'desc')}
            >
              <ArrowDown size={14} className='text-muted' />
              <span>Desc</span>
            </button>

            <div className='separator my-1'></div>

            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handlePinColumn(activeDropdownCol, 'left')}
            >
              <Pin size={13} className='text-muted rotate-45' />
              <span>Pin to left</span>
            </button>
            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handlePinColumn(activeDropdownCol, 'right')}
            >
              <Pin size={13} className='text-muted' />
              <span>Pin to right</span>
            </button>

            <div className='separator my-1'></div>

            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handleMoveColumn(activeDropdownCol, 'left')}
            >
              <ArrowLeft size={14} className='text-muted' />
              <span>Move to Left</span>
            </button>
            <button
              type='button'
              className='dropdown-item d-flex align-items-center gap-2 px-4 py-2 fs-7 btn btn-flush text-start'
              onClick={() => handleMoveColumn(activeDropdownCol, 'right')}
            >
              <ArrowRight size={14} className='text-muted' />
              <span>Move to Right</span>
            </button>
          </div>,
          document.body
        )}

      {/* Shadcn UI Pagination Footer */}
      <div className='shadcn-table-pagination d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 px-4 py-3 rounded-bottom-3'>
        {/* Column-format: Count on top, Rows per page below */}
        <div className='d-flex flex-column gap-1'>
          <span className='fs-8 fw-bold text-gray-800'>
            {startItem}–{endItem} of {totalItems}
          </span>
          <div className='d-flex align-items-center gap-2'>
            <span className='fs-8 text-muted fw-medium'>Rows per page:</span>
            <select
              className='form-select form-select-sm form-select-solid w-70px py-0 fs-8'
              style={{height: '28px', minHeight: '28px', padding: '2px 8px'}}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Navigation */}
        <div className='d-flex align-items-center gap-2 w-100 w-sm-auto justify-content-between justify-content-sm-end'>
          <button
            type='button'
            className='btn btn-xs btn-light fw-bold px-3 py-1'
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} className='me-1' /> Previous
          </button>
          <span className='fs-8 fw-semibold px-2 text-gray-700'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type='button'
            className='btn btn-xs btn-light fw-bold px-3 py-1'
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight size={14} className='ms-1' />
          </button>
        </div>
      </div>
    </div>
  )
}
