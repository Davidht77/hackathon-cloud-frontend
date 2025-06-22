import { jsPDF } from 'jspdf'
import { useState } from 'react'

export default function DiagramViewer({ url }){
  const [pdfLoading, setPdfLoading] = useState(false)

  const downloadPDF = async () => {
    setPdfLoading(true)
    // convierte la imagen remota a base64
    const blob = await fetch(url).then(r=>r.blob())
    const dataUrl = await new Promise(res=>{
      const r = new FileReader()
      r.onload = ()=>res(r.result)
      r.readAsDataURL(blob)
    })
    const pdf = new jsPDF({ orientation:'l' })
    pdf.addImage(dataUrl, 'PNG', 10, 10, 280, 150)
    pdf.save('diagram.pdf')
    setPdfLoading(false)
  }

  return (
    <div className="border p-3">
      <h5>Resultado</h5>
      <img src={url} alt="diagram" className="img-fluid border"/>
      <div className="mt-2 d-flex gap-2">
        <a href={url} download="diagram.svg" className="btn btn-success btn-sm">
          SVG
        </a>
        <a
          href={url.replace('.svg','.png')}
          download="diagram.png"
          className="btn btn-success btn-sm"
        >
          PNG
        </a>
        <button
          className="btn btn-dark btn-sm"
          onClick={downloadPDF}
          disabled={pdfLoading}
        >
          {pdfLoading? 'PDF…' : 'PDF'}
        </button>
      </div>
    </div>
  )
}
