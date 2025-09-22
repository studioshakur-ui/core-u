// src/lib/ocr.js
import Tesseract from 'tesseract.js'

export async function runOCR(file) {
  // images conseillées; pour pdf, extraire la 1ère page en image côté navigateur si besoin
  const { data: { text } } = await Tesseract.recognize(file, 'eng+ita', {
    tessedit_pageseg_mode: 6
  })
  return (text || '').replace(/\s+\n/g, '\n').trim()
}
