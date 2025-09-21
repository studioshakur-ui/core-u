# AI Guide (CORE v9.1)

## Principes
- Minimisation des données : n’envoyer que le nécessaire (texte OCR nettoyé, pas de PII).
- IA = suggestion : l’humain confirme (seuils: Haute>=0.85, Moyenne 0.6–0.85, Basse<0.6).
- Offline d’abord : OCR local (`tesseract.js`), LLM optionnel.

## Intégration
- OCR: `src/lib/ocr.js`
- Normalisation & résumé: `src/lib/ai.js` + `src/ai/prompts.js`

## Env
- `.env` -> `OPENAI_API_KEY`
- `VITE_AI_ENABLED=true` pour activer

## Appels
- `normalizeActivity(raw, catalog)` -> `{ match_code, confidence, clean_title, notes[] }`
- `summarizeReport(rows)` -> string (bullet points)

## Sécurité
- Ne jamais envoyer d’images brutes au LLM (OCR local).
- Pas de noms complets d’opérateurs (initiales si besoin).
- Journaliser les prompts en local seulement si opt-in.
