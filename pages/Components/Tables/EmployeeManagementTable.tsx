/* eslint-disable react/jsx-key */
import React, { useMemo } from "react";
// import MOCK_DATA from './MOCK_DATA.json'
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';

import { BiPencil } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { GrNext, GrPrevious } from "react-icons/gr";
import Link from "next/link";
import { GlobalFilterTable } from "./GlobalFilterTable";



const EmployeeManagementTable = (props: any) => {
  const columns = useMemo(() => props.COLOUMNS, [props.COLOUMNS]);
  const data = useMemo(() => props.tableData, [props.tableData]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
  } = useTable<any>(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;
  return (
    <div className="flex flex-col">
      <GlobalFilterTable filter={globalFilter} setFilter={setGlobalFilter} />
      <table id="employeeManagementTable" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span className="text-blue-500 text-sm">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ⇂"
                          : " ↿"
                        : " ⥮"}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        page {pageIndex + 1} of {pageOptions.length}
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          className="disabled:bg-slate-400 disabled:opacity-25 bg-slate-200 my-2 mx-1 rounded px-2 py-2"
        >
          <GrPrevious />
        </button>
        <button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          className="disabled:bg-slate-400 disabled:opacity-25 bg-slate-200 my-2 mx-1 rounded px-2 py-2"
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default EmployeeManagementTable;
