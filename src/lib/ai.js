import OpenAI from 'openai'
import { z } from 'zod'
import { PROMPTS } from '../ai/prompts'

const schemaNormalize = z.object({
  match_code: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  clean_title: z.string(),
  notes: z.array(z.string()).optional().default([])
})

const AI_ENABLED = (import.meta.env.VITE_AI_ENABLED === 'true' || process.env.VITE_AI_ENABLED === 'true')
let _client
function client(){
  if(!AI_ENABLED) throw new Error('AI disabled');
  if(!_client){
    _client = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY })
  }
  return _client
}

// Safety: never send PII, just raw field
export async function normalizeActivity(raw, catalog){
  const prompt = PROMPTS.normalizeActivity({ raw, catalog })
  const res = await client().chat.completions.create({
    model: 'gpt-5-thinking', // alias expected
    messages: [{ role:'user', content: prompt }],
    temperature: 0.2
  })
  const text = res.choices?.[0]?.message?.content ?? '{}'
  let data
  try{
    data = JSON.parse(text)
  }catch(e){
    data = { match_code:null, confidence:0, clean_title: raw.slice(0,60), notes: ['LLM parse fallback'] }
  }
  const parsed = schemaNormalize.safeParse(data)
  if(!parsed.success){
    return { match_code:null, confidence:0, clean_title: raw.slice(0,60), notes:['schema_invalid'] }
  }
  return parsed.data
}

export async function summarizeReport(rows){
  const prompt = PROMPTS.summarizeReport({ rows })
  const res = await client().chat.completions.create({
    model: 'gpt-5-thinking',
    messages: [{ role:'user', content: prompt }],
    temperature: 0.2
  })
  return res.choices?.[0]?.message?.content ?? ''
}
