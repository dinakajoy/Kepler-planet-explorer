import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { IPlanet } from "@/types/planet.type";

const ExoplanetTable = ({
  filteredPlanets,
}: {
  filteredPlanets: IPlanet[];
}) => {
  const columns = useMemo<ColumnDef<IPlanet>[]>(
    () => [
      {
        accessorKey: "kepoi_name",
        header: "KOI Name",
      },
      {
        accessorKey: "kepler_name",
        header: "Kepler Name",
      },
      {
        accessorKey: "koi_disposition",
        header: "Disposition Status",
      },
      {
        accessorKey: "koi_teq",
        header: "Temperature (K)",
        cell: (info) => Number(info.getValue()).toFixed(0),
      },
      {
        accessorKey: "koi_insol",
        header: "Insolation (Earth flux)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
      {
        accessorKey: "koi_prad",
        header: "Radius (Earth)",
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
      {
        accessorKey: "koi_period",
        header: "Period (days)",
        cell: (info) => Number(info.getValue()).toFixed(4),
      },
      {
        accessorKey: "koi_steff",
        header: "Stellar Temp (K)",
      },
      {
        accessorKey: "koi_srad",
        header: "Stellar Radius",
        cell: (info) => Number(info.getValue()).toFixed(2),
      },
    ],
    []
  );

  // Memoize the table instance
  const table = useReactTable({
    data: filteredPlanets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, value) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  });

  return (
    <div className="overflow-x-auto overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-800 mb-10">
      <table className="w-full">
        <thead className="bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 cursor-pointer text-left border-8 border-slate-900 min-w-[120px]"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" ? " ⬆️" : ""}
                  {header.column.getIsSorted() === "desc" ? " ⬇️" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 min-w-[200px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExoplanetTable;
