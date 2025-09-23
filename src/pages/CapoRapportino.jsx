import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/** Logo minimal en base64 (remplace par le tien plus tard) */
const LOGO =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='60'>
      <rect rx='8' width='240' height='60' fill='#4f46e5'/>
      <text x='30' y='38' font-size='24' font-family='Arial' fill='white'>CORE v11</text>
    </svg>`
  );

/** jeu d'opérateurs démo pour la sélection rapide */
const DEMO_OPERAI = [
  { id: "u1", nome: "Halim", cognome: "Abdul" },
  { id: "u2", nome: "Ciro", cognome: "Rossi" },
  { id: "u3", nome: "Khan", cognome: "RMon" },
  { id: "u4", nome: "Massimo", cognome: "Conte" },
  { id: "u5", nome: "Alan", cognome: "Celnik" }
];

const STORAGE_KEY = "core_v11_rapportino_demo";

/** Ligne de rapport : multi-opérateurs + ore individuali, previsto/prodotto condivisi */
function newRow() {
  return {
    commessa: "",
    descrizione: "",
    operatori: [], // [{id, nome, cognome, ore}]
    previsto: "",
    prodotto: "",
    note: ""
  };
}

export default function CapoRapportino() {
  const [data, setData] = useState({
    data: dayjs().format("YYYY-MM-DD"),
    capo: { nome: "Nome", cognome: "Cognome" },
    manager: { nome: "Manager", cognome: "Cognome" },
    cantiere: "Fuori Cabina / SDCN",
    commessa: "6313",
    righe: [newRow(), newRow(), newRow()]
  });

  // charger localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setData(JSON.parse(raw)); } catch {}
    }
  }, []);
  // autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const oreTotali = useMemo(() => {
    let tot = 0;
    for (const r of data.righe) {
      for (const op of r.operatori) tot += Number(op.ore || 0);
    }
    return tot;
  }, [data]);

  function updateRow(i, patch) {
    setData(d => {
      const righe = d.righe.slice();
      righe[i] = { ...righe[i], ...patch };
      return { ...d, righe };
    });
  }

  function addOperatore(i, op) {
    setData(d => {
      const righe = d.righe.slice();
      const r = { ...righe[i] };
      const exists = r.operatori.some(o => o.id === op.id);
      if (!exists) r.operatori = [...r.operatori, { ...op, ore: 8 }];
      righe[i] = r;
      return { ...d, righe };
    });
  }

  function rmOperatore(i, opId) {
    setData(d => {
      const righe = d.righe.slice();
      const r = { ...righe[i] };
      r.operatori = r.operatori.filter(o => o.id !== opId);
      righe[i] = r;
      return { ...d, righe };
    });
  }

  function addRow() {
    setData(d => ({ ...d, righe: [...d.righe, newRow()] }));
  }
  function rmRow(i) {
    setData(d => ({ ...d, righe: d.righe.filter((_, idx) => idx !== i) }));
  }

  function exportPDF() {
    const doc = new jsPDF("p", "pt", "a4");
    const marginX = 40;

    // Header
    doc.addImage(LOGO, "PNG", marginX, 30, 120, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RAPPORINO GIORNALIERO", 200, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Metadati
    const meta = [
      [`DATA: ${dayjs(data.data).format("DD/MM/YYYY")}`, `COMMESSA: ${data.commessa}`],
      [`CANTIERE: ${data.cantiere}`, `CAPO SQUADRA: ${data.capo.nome} ${data.capo.cognome}`]
    ];
    autoTable(doc, {
      startY: 80,
      body: meta,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 }
    });

    // Table principale
    const head = [["DESCRIZIONE ATTIVITA'", "OPERATORI (ORE)", "PREVISTO", "PRODOTTO", "NOTE"]];
    const body = data.righe.map(r => [
      r.descrizione || "",
      r.operatori.map(o => `${o.nome} ${o.cognome} (${o.ore}h)`).join("\n"),
      r.previsto || "",
      r.prodotto || "",
      r.note || ""
    ]);

    autoTable(doc, {
      head,
      body,
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontSize: 10, cellPadding: 4, minCellHeight: 18 },
      headStyles: { fillColor: [79, 70, 229], halign: "center", valign: "middle", textColor: 255 },
      columnStyles: {
        0: { cellWidth: 200 },
        1: { cellWidth: 160 },
        2: { cellWidth: 70, halign: "center" },
        3: { cellWidth: 70, halign: "center" },
        4: { cellWidth: "auto" }
      }
    });

    // Totale & firme
    const y = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "bold");
    doc.text(`TOTALE ORE: ${oreTotali}`, marginX, y);

    doc.setFont("helvetica", "normal");
    doc.text("Firma Capo:", marginX, y + 40);
    doc.text(`${data.capo.nome} ${data.capo.cognome}`, marginX + 90, y + 40);

    doc.text("Firma Manager:", marginX + 270, y + 40);
    doc.text(`${data.manager.nome} ${data.manager.cognome}`, marginX + 380, y + 40);

    doc.save(`Rapportino_${data.commessa}_${dayjs(data.data).format("YYYYMMDD")}.pdf`);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Barra alta: meta + azioni */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500">Data</label>
          <input
            type="date"
            value={data.data}
            onChange={(e)=>setData(d=>({ ...d, data: e.target.value }))}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Commessa</label>
          <input
            value={data.commessa}
            onChange={(e)=>setData(d=>({ ...d, commessa: e.target.value }))}
            className="border rounded p-2"
          />
        </div>
        <div className="grow min-w-[220px]">
          <label className="block text-xs text-gray-500">Cantiere</label>
          <input
            value={data.cantiere}
            onChange={(e)=>setData(d=>({ ...d, cantiere: e.target.value }))}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Capo — Nome</label>
          <input
            value={data.capo.nome}
            onChange={(e)=>setData(d=>({ ...d, capo:{...d.capo, nome:e.target.value} }))}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Capo — Cognome</label>
          <input
            value={data.capo.cognome}
            onChange={(e)=>setData(d=>({ ...d, capo:{...d.capo, cognome:e.target.value} }))}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Manager — Nome</label>
          <input
            value={data.manager.nome}
            onChange={(e)=>setData(d=>({ ...d, manager:{...d.manager, nome:e.target.value} }))}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Manager — Cognome</label>
          <input
            value={data.manager.cognome}
            onChange={(e)=>setData(d=>({ ...d, manager:{...d.manager, cognome:e.target.value} }))}
            className="border rounded p-2"
          />
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={addRow} className="px-4 py-2 bg-gray-200 rounded">+ Riga</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-indigo-600 text-white rounded shadow">
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabella stile cartaceo */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left w-[26%]">DESCRIZIONE ATTIVITA'</th>
              <th className="p-3 text-left w-[28%]">OPERATORI (ORE)</th>
              <th className="p-3 text-center w-[12%]">PREVISTO</th>
              <th className="p-3 text-center w-[12%]">PRODOTTO</th>
              <th className="p-3 text-left">NOTE</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.righe.map((r, i) => (
              <tr key={i} className="border-t align-top">
                <td className="p-2">
                  <textarea
                    value={r.descrizione}
                    onChange={(e)=>updateRow(i,{ descrizione:e.target.value })}
                    className="border rounded p-2 w-full min-h-[70px] resize-y"
                    placeholder="Carpenteria staffe SDCN…"
                  />
                </td>

                {/* Operatori + ore individuali */}
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    {r.operatori.map(op => (
                      <div key={op.id} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                        <span className="font-medium">{op.nome} {op.cognome}</span>
                        <input
                          type="number" min={0} max={12} step={0.5}
                          value={op.ore}
                          onChange={(e)=>{
                            const ore = Number(e.target.value);
                            updateRow(i, {
                              operatori: r.operatori.map(o => o.id===op.id ? { ...o, ore } : o)
                            });
                          }}
                          className="w-16 border rounded px-1 py-0.5 text-right"
                        />
                        <span>h</span>
                        <button
                          onClick={()=>rmOperatore(i, op.id)}
                          className="ml-1 text-red-600 hover:underline"
                          title="Rimuovi"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Picker rapido demo */}
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {DEMO_OPERAI.map(op => (
                      <button
                        key={op.id}
                        onClick={()=>addOperatore(i, op)}
                        className="px-2 py-1 border rounded hover:bg-gray-50"
                      >
                        {op.nome} {op.cognome}
                      </button>
                    ))}
                  </div>
                </td>

                {/* Previsto / Prodotto condivisi */}
                <td className="p-2 text-center">
                  <input
                    value={r.previsto}
                    onChange={(e)=>updateRow(i,{ previsto:e.target.value })}
                    className="border rounded p-2 w-24 text-center"
                    placeholder="es. 0,2 / 32pz"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    value={r.prodotto}
                    onChange={(e)=>updateRow(i,{ prodotto:e.target.value })}
                    className="border rounded p-2 w-24 text-center"
                    placeholder="es. 18 / 480mt"
                  />
                </td>

                {/* Note */}
                <td className="p-2">
                  <textarea
                    value={r.note}
                    onChange={(e)=>updateRow(i,{ note:e.target.value })}
                    className="border rounded p-2 w-full min-h-[70px] resize-y"
                    placeholder="PT 5 FZ 2-5, Zona 6…"
                  />
                </td>

                <td className="p-2">
                  <button onClick={()=>rmRow(i)} className="text-red-600 hover:underline">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totale & help */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Suggerimento: puoi aggiungere più operatori sulla stessa riga (binomio/trinomio), ognuno con ore diverse.
        </div>
        <div className="text-lg font-semibold">Totale ore: {oreTotali}</div>
      </div>
    </div>
  );
}
