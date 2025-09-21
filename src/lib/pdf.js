// remplace toute utilisation de Buffer:
const base64 = qrDataUrl.split(',')[1]
const binary = atob(base64)
const bytes = new Uint8Array(binary.length)
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
// puis embed bytes avec pdf-lib
