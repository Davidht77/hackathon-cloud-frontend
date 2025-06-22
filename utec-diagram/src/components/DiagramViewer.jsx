import { jsPDF } from 'jspdf'
import { useState } from 'react'

export default function DiagramViewer({ url }) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const downloadPDF = async () => {
    setPdfLoading(true)
    try {
      // 1) Obtén el blob
      const blob = await fetch(url).then(r => r.blob())

      // 2) Crea un objeto Image para medir tamaño
      const img = await new Promise((resolve, reject) => {
        const i = new Image()
        i.onload = () => resolve(i)
        i.onerror = reject
        i.src = URL.createObjectURL(blob)
      })

      const imgW = img.naturalWidth
      const imgH = img.naturalHeight

      // 3) Crea el DataURL (solo necesitas el dataURL para jsPDF)
      const dataUrl = await new Promise(res => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.readAsDataURL(blob)
      })

      // 4) Instancia jsPDF en orientación “landscape”
      const pdf = new jsPDF({ orientation: 'l' })

      // 5) Calcula área útil (márgenes de 10mm)
      const pageW = pdf.internal.pageSize.getWidth() - 20  // 10mm margen a cada lado
      const pageH = pdf.internal.pageSize.getHeight() - 20  // 10mm margen arriba/abajo

      // 6) Calcula escala sin deformar (fit dentro del área)
      const ratio = Math.min(pageW / imgW, pageH / imgH)
      const wDoc = imgW * ratio
      const hDoc = imgH * ratio

      // 7) Centra en la página
      const x = (pdf.internal.pageSize.getWidth() - wDoc) / 2
      const y = (pdf.internal.pageSize.getHeight() - hDoc) / 2

      // 8) Añade la imagen escalada
      pdf.addImage(dataUrl, 'PNG', x, y, wDoc, hDoc)
      pdf.save('diagram.pdf')
    } catch (e) {
      console.error('Error generando PDF:', e)
      alert('No pude generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }


  return (
    <div className="border p-3">
      <div style={{ display: "grid", justifyContent: "center"}}>
        <h5>Diagram:</h5>
        <img src={url} alt="diagram" className="img-fluid border"/>
      </div>
      <div className="mt-2 d-flex gap-2" >
        <a href={url} download="diagram.svg" target="_blank" className="btn btn-success btn-sm">
          SVG
        </a>
        <a
          href={url.replace('.svg', '.png')}
          download="diagram.png"
          className="btn btn-success btn-sm"
          target="_blank"
        >
          PNG
        </a>
        <button
          className="btn btn-dark btn-sm"
          onClick={downloadPDF}
          disabled={pdfLoading}

        >
          {pdfLoading ? 'PDF…' : 'PDF'}
        </button>
      </div>
    </div>
  )
}
