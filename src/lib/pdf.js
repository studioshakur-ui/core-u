// src/lib/pdf.js
// Export PDF simple : génère une page HTML imprimable.
// L’utilisateur peut ensuite "Enregistrer au format PDF" via le navigateur.

export async function downloadReportinoPDF({ header, rows, attachments = [], hash = '' }) {
  const win = window.open('', '_blank')
  if (!win) return

  const style = `
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; margin: 24px; color:#0f172a; }
      h1 { font-size: 20px; margin:0 0 8px; }
      .meta { font-size:12px; color:#475569; margin-bottom:16px }
      table { width:100%; border-collapse: collapse; font-size:12px; }
      th, td { border:1px solid #e2e8f0; padding:8px; text-align:left; }
      th { background:#f8fafc; }
      .attachments { font-size:12px; margin-top:12px; }
      .footer { margin-top:24px; font-size:11px; color:#64748b }
    </style>
  `

  const headerHtml = `
    <h1>${header?.titolo || 'Rapportino Giornaliero'}</h1>
    <div class="meta">
      Commessa: <b>${header?.commessa || '-'}</b> ·
      Data: <b>${header?.data || '-'}</b> ·
      Capo: <b>${header?.capo || '-'}</b> ·
      Org: <b>${header?.org || '-'}</b>
    </div>
  `

  const rowsHtml =
    rows && rows.length
      ? rows
          .map(
            (r) => `
        <tr>
          <td>${escapeHtml(r.attivita || '')}</td>
          <td>${Array.isArray(r.operatori) ? r.operatori.join(', ') : ''}</td>
          <td>${r.zona || ''}</td>
          <td style="text-align:right">${r.previsto ?? ''}</td>
          <td style="text-align:right">${r.prodotto ?? ''}</td>
          <td style="text-align:right">${r.ore_totali ?? ''}</td>
        </tr>`
          )
          .join('')
      : `<tr><td colspan="6" style="text-align:center;color:#64748b">Aucune ligne</td></tr>`

  const attHtml = attachments.length
    ? `<div class="attachments"><b>Allegati (${attachments.length})</b><br>${attachments
        .map((a) => `- ${a.name} (${a.type || 'file'})`)
        .join('<br>')}</div>`
    : ''

  const totalOre = (rows || []).reduce(
    (a, r) => a + (Number(r.ore_totali) || 0),
    0
  )

  win.document.write(`
    <!doctype html><html><head><meta charset="utf-8">${style}</head>
    <body>
      ${headerHtml}
      <table>
        <thead><tr>
          <th>Attività</th><th>Operatori</th><th>Zona</th><th>Prev</th><th>Prod</th><th>Ore</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="text-align:right"><b>Totale ore</b></td>
            <td style="text-align:right"><b>${totalOre.toFixed(2)}</b></td>
          </tr>
        </tfoot>
      </table>
      ${attHtml}
      <div class="footer">Hash: ${hash || '-'} · Generato da CORE</div>
      <script>window.onload = () => setTimeout(()=>window.print(), 300)</script>
    </body></html>
  `)
  win.document.close()
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
