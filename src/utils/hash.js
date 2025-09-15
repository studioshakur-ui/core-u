export async function sha256File(file){
  const buf = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buf)
  const bytes = Array.from(new Uint8Array(hashBuffer))
  return bytes.map(b=>b.toString(16).padStart(2,'0')).join('')
}