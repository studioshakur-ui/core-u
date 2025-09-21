import React from "react";
export default function TableEditable({ columns, rows, onChange }) {
  return (
    <div className="overflow-x-auto bg-white border border-core-border rounded-lg shadow-e0">
      <table className="min-w-full text-sm">
        <thead className="bg-core-surface">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="text-left font-medium text-core-muted px-3 py-2 border-b border-core-border">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={row.id || rIdx} className="border-b border-core-border">
              {columns.map(col => (
                <td key={col.key} className="px-3 py-2">
                  {col.editable ? (
                    <input className="w-full border border-core-border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-core-violet"
                      value={row[col.key] ?? ""} onChange={(e) => onChange(rIdx, col.key, e.target.value)} />
                  ) : (<span>{row[col.key]}</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}