import React from 'react';

export interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  onRowClick?: (index: number) => void;
}

export function Table({ headers, rows, onRowClick }: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="table-th">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={onRowClick ? 'table-tr cursor-pointer' : 'table-tr'}
            onClick={() => onRowClick?.(rowIndex)}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="table-td">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
