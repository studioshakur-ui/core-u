// Prompt templates (minimization + structure)
// IMPORTANT: send only normalized fields. No PII beyond role initials.
export const PROMPTS = {
  normalizeActivity: ({raw, catalog}) => `You are a production data normalizer.
Return ONLY valid JSON matching this schema:
{
  "match_code": "string|null",    // best catalog code
  "confidence": 0..1,             // float
  "clean_title": "string",        // human label
  "notes": "string[]"             // extracted hints
}
Catalog codes: ${catalog.map(c => c.code + ":" + c.title_it).join("; ")}
Text: ${raw}
If uncertain, set match_code:null and confidence<=0.5. No commentary.`,
  summarizeReport: ({rows}) => `You are a supervisor. Create a 3-bullet Italian summary from these rows:
${JSON.stringify(rows).slice(0,4000)}
Rules: max 30 words per bullet, no names, focus on outcomes & blockers.`
};
