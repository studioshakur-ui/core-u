import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchTeams } from "../utils/dataClient";

function Row({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-core-border rounded-lg bg-white shadow-e0 p-3 flex items-center justify-between"
    >
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-core-muted">
          Capo: {item.capo} · Membri: {item.members}
        </div>
      </div>
      <button className="text-sm text-core-violet">Apri</button>
    </div>
  );
}

export default function Manager() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTeams({ q, page, pageSize }).then(({ rows, total }) => {
      setRows(rows);
      setTotal(total);
    });
  }, [q, page]);

  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function onDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    setRows(arrayMove(rows, oldIndex, newIndex));
    // TODO: persister l'ordre si nécessaire
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Manager</h1>

        {/* Barre de recherche */}
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Cerca squadra o capo..."
            className="w-full max-w-sm border border-core-border rounded-md px-3 py-2"
          />
        </div>

        {/* Drag & Drop grid */}
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {rows.map((item) => (
                <Row key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-core-muted">Totale: {total}</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-md border"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-sm">
              Pagina {page}/{totalPages}
            </span>
            <button
              className="px-3 py-1 rounded-md border"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
