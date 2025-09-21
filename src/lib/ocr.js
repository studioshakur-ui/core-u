import Tesseract from 'tesseract.js'

export async function ocrImage(file){
  const { data } = await Tesseract.recognize(file, 'ita+eng', { logger: ()=>{} })
  // basic cleanup
  return data.text.replace(/[\t\r]+/g,' ').replace(/ +/g,' ').trim()
}
