import React from 'react'
import { downloadReportinoPDF } from '../lib/pdf'

export default function ExportPDFButton({ header, rows, attachments, hash }){
  return (
    <button
      onClick={async()=>await downloadReportinoPDF({ header, rows, attachments, hash })}
      className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
      disabled={!rows?.length}
    >
      Esporta PDF
    </button>
  )
}
