import { useCallback, useState } from 'react';

interface PaginationResult<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  currentTableData: T[];
  totalPage: number;
}

function usePagination<T>(data: T[], itemsPerPage: number): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const attTableData = useCallback(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const finishIndex = data.length;
    if (endIndex >= finishIndex) {
      return [...data].slice(startIndex, finishIndex);
    }
    return [...data].slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const currentTableData = attTableData();

  const totalPage = Math.ceil(data.length / itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    currentTableData,
    totalPage
  };
}

export default usePagination;
