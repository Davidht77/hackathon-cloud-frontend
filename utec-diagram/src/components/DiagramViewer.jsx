import { jsPDF } from 'jspdf'
import { useState } from 'react'

export default function DiagramViewer({ url }) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const downloadBlob = async (blob, filename) => {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  }

  const downloadSVG = async () => {
    try {
      const blob = await fetch(url).then(r => r.blob())
      downloadBlob(blob, 'diagram.svg')
    } catch (e) {
      console.error(e)
      alert('Error descargando SVG')
    }
  }

  const downloadPNG = async () => {
    try {
      const pngUrl = url.replace(/\.svg$/, '.png')
      const blob   = await fetch(pngUrl).then(r => r.blob())
      downloadBlob(blob, 'diagram.png')
    } catch (e) {
      console.error(e)
      alert('Error descargando PNG')
    }
  }

  const downloadPDF = async () => {
    setPdfLoading(true)
    try {
      // 1) Descargamos el PNG como blob
      const pngUrl = url.replace(/\.svg$/, '.png')
      const blob   = await fetch(pngUrl).then(r => r.blob())

      // 2) Medimos la imagen
      const img = await new Promise((res, rej) => {
        const i = new Image()
        i.onload  = () => res(i)
        i.onerror = rej
        i.src     = URL.createObjectURL(blob)
      })

      // 3) Creamos dataURL
      const dataUrl = await new Promise(res => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.readAsDataURL(blob)
      })

      // 4–8) jsPDF igual que antes
      const pdf   = new jsPDF({ orientation: img.width > img.height ? 'l' : 'p' })
      const pageW = pdf.internal.pageSize.getWidth()  - 20
      const pageH = pdf.internal.pageSize.getHeight() - 20
      const ratio = Math.min(pageW / img.naturalWidth, pageH / img.naturalHeight)
      const wDoc  = img.naturalWidth * ratio
      const hDoc  = img.naturalHeight * ratio
      const x     = (pdf.internal.pageSize.getWidth()  - wDoc) / 2
      const y     = (pdf.internal.pageSize.getHeight() - hDoc) / 2

      pdf.addImage(dataUrl, 'PNG', x, y, wDoc, hDoc)
      pdf.save('diagram.pdf')
    } catch (e) {
      console.error(e)
      alert('No pude generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="border p-3">
      <div style={{ textAlign: 'center' }}>
        <h5>Diagram:</h5>
        <img src={url} alt="diagram" className="img-fluid border" />
      </div>

      <div className="mt-3 d-flex gap-2">
        {/* Botones directos */}
        <a href={url} download="diagram.svg" target="_blank" className="btn btn-success btn-sm" style={{backgroundColor: "#00d0ff", border: "none", fontSize: "18px"}}>
            visualize with SVG
          </a>

          <a
            href={url.replace('.svg', '.png')}
            download="diagram.png"
            className="btn btn-success btn-sm"
            target="_blank"
            style={{backgroundColor: "#00d0ff", border: "none", fontSize: "18px"}}
          >
            visualize with PNG
          </a>

        <div className="dropdown ms-auto">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="exportDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{width: "200px", fontSize: "18px"}}
          >
            Exportar diagrama
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="exportDropdown">
            <li>
              <button className="dropdown-item" onClick={downloadSVG}>
                Descargar SVG
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={downloadPNG}>
                Descargar PNG
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={downloadPDF}
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Descargando PDF…' : 'Descargar PDF'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
