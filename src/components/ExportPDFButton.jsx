import React from 'react'
import { downloadReportinoPDF } from '../lib/pdf'

export default function ExportPDFButton({ header, rows, attachments, hash }){
  return (
    <button onClick={()=>downloadReportinoPDF({ header, rows, attachments, hash })}>
      Esporta PDF
    </button>
  )
}
