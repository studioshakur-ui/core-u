// src/utils/exporters/rapportinoPdf.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportRapportinoPDF(containerId, filename="rapportino.pdf"){
  const el = document.getElementById(containerId);
  if (!el) throw new Error("contenitore non trovato");
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#0F1117" });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageW - w) / 2, y = 10;
  pdf.addImage(img, "PNG", x, y, w, h);
  pdf.save(filename);
}
