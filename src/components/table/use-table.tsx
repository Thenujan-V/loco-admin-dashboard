import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export type Order = 'asc' | 'desc';
export type RowId = string | number;

interface UseTableProps {
  defaultDense?: boolean;
  defaultCurrentPage?: number;
  defaultOrderBy?: string;
  defaultRowsPerPage?: number;
  defaultOrder?: Order;
  defaultSelected?: RowId[];
}

interface UpdateDeleteRowsParams {
  totalRows: number;
  totalRowsInPage: number;
  totalRowsFiltered: number;
}

export default function useTable(props?: UseTableProps) {
  const [dense, setDense] = useState<boolean>(!!props?.defaultDense);

  const [page, setPage] = useState<number>(props?.defaultCurrentPage || 0);

  const [orderBy, setOrderBy] = useState<string>(props?.defaultOrderBy || 'name');

  const [rowsPerPage, setRowsPerPage] = useState<number>(props?.defaultRowsPerPage || 5);

  const [order, setOrder] = useState<Order>(props?.defaultOrder || 'asc');

  const [selected, setSelected] = useState<RowId[]>(props?.defaultSelected || []);

  // SORT
  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  // SELECT SINGLE ROW
  const onSelectRow = useCallback(
    (inputValue: RowId) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  // ROWS PER PAGE
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
    },
    []
  );

  // DENSE MODE
  const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  }, []);

  // SELECT ALL
  const onSelectAllRows = useCallback((checked: boolean, inputValue: RowId[]) => {
    if (checked) {
      setSelected(inputValue);
      return;
    }
    setSelected([]);
  }, []);

  // PAGE CHANGE
  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  // DELETE SINGLE ROW
  const onUpdatePageDeleteRow = useCallback(
    (totalRowsInPage: number) => {
      setSelected([]);
      if (page) {
        if (totalRowsInPage < 2) {
          setPage(page - 1);
        }
      }
    },
    [page]
  );

  // DELETE MULTIPLE ROWS
  const onUpdatePageDeleteRows = useCallback(
    ({ totalRows, totalRowsInPage, totalRowsFiltered }: UpdateDeleteRowsParams) => {
      const totalSelected = selected.length;

      setSelected([]);

      if (page) {
        if (totalSelected === totalRowsInPage) {
          setPage(page - 1);
        } else if (totalSelected === totalRowsFiltered) {
          setPage(0);
        } else if (totalSelected > totalRowsInPage) {
          const newPage = Math.ceil((totalRows - totalSelected) / rowsPerPage) - 1;
          setPage(newPage);
        }
      }
    },
    [page, rowsPerPage, selected.length]
  );

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeDense,
    onResetPage,
    onChangeRowsPerPage,
    onUpdatePageDeleteRow,
    onUpdatePageDeleteRows,
    //
    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setSelected,
    setRowsPerPage,
  };
}
