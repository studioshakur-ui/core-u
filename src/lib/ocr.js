// Stub OCR : renvoie une chaîne vide ou un texte d'exemple si tu veux tester
export async function runOCR(file) {
  try {
    if (!file) return ''
    // Si un PDF texte est déposé, on essaie de lire comme texte brut (fallback simple)
    if (file.type === 'text/plain') {
      return await file.text()
    }
    // Pour le moment on retourne vide (tu pourras brancher Tesseract.js ici)
    // Exemple de retour de test :
    // return 'Saldatura supporto lampada PT 3FZ 2 ore 6 operatori'
    return ''
  } catch (e) {
    console.error('[OCR]', e)
    return ''
  }
}
