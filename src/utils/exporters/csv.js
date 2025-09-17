// src/utils/exporters/csv.js
export function exportCsv(filename, rows) {
  const header = ["Operatore", "Ore", "Descrizione", "Prodotto", "Previsto", "Impianto", "Note"];
  const lines = [header.join(",")].concat(
    rows.map(r => [
      q(r.operatore), q(r.ore), q(r.descrizione), q(r.prodotto), q(r.previsto), q(r.impianto), q(r.note)
    ].join(","))
  );
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function q(v){ if (v==null) return ""; const s = String(v).replace(/"/g,'""'); return /[",\n]/.test(s) ? `"${s}"` : s; }
