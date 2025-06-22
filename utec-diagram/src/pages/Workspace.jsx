import { useState, useEffect } from 'react'
import EditorPanel from '../components/EditorPanel'
import FileUploader from '../components/FileUploader'
import DiagramTypeSelector from '../components/DiagramTypeSelector'
import DiagramViewer from '../components/DiagramViewer'
import { fetchFromGitHub } from '../utils/githubFetch'
import { useAuth } from '../contexts/AuthContext'
import { generateAwsDiagram, generateER } from '../utils/diagramApi'

const DEFAULT_CODE = `// write your diagram here`

export default function Workspace() {

  const [code, setCode] = useState(() => {
    return localStorage.getItem('diagramCode') || DEFAULT_CODE
  })

  const [type, setType] = useState('aws')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [gitUrl, setGitUrl] = useState('')
  const { token, logout } = useAuth();

  const generate = async () => {
    if (!code.trim()) return alert('Agrega código primero')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let diagramUrl

      if (type === 'aws') {
        diagramUrl = await generateAwsDiagram(code, token)
      }
      else if (type === 'er') {
        diagramUrl = await generateER(code, token)
      }
      // else if (type === 'json') { ... }

      setUrl(diagramUrl)
    } catch (e) {
      console.error(e)
      alert(e.message || 'Error generando diagrama')
    } finally {
      setLoading(false)
    }
  }

  const loadFromGit = async () => {
    if (!gitUrl.trim()) return
    try {
      const txt = await fetchFromGitHub(gitUrl)
      setCode(txt)
    } catch {
      alert('No pude cargar de GitHub')
    }
  }

  useEffect(() => {
    localStorage.setItem('diagramCode', code)
  }, [code])

  return (
    <div style={{ height: "100vh", width: "100%", display: "grid", gridTemplateRows: "70px auto"}}>
      
      <div style={{display: "flex", justifyContent: "space-between", margin: "auto 20px"}}>
        <h1 style={{fontSize: "28px", marginTop: "14px", color: "#0f0f0f"}}>Diagram with code</h1>

        <button
          className="btn btn-outline-danger"
          style={{width: "120px", height: "40px", marginTop: "20px"}}
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('diagramCode')
            logout();
            window.location = '/login'

          }
          }


        >Log out</button>
        
      </div>
      <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr", alignItems: "center", justifyContent: "center", gap: "20px", padding: "40px", backgroundColor: "#fbfbf6 "}}>
        <div>

          <DiagramTypeSelector type={type} setType={setType} />

          <div className="my-2" style={{ border: "none" }}>
            <EditorPanel code={code} setCode={setCode} />
          </div>

          <div className="d-flex gap-2 mb-3">
            <FileUploader onLoad={setCode} />
            <button
              className="btn btn-secondary"
              onClick={async () => {
                const text = await navigator.clipboard.readText()
                setCode(text)
              }}
              style={{ backgroundColor: "#00d0ff", border: "none" }}
            >Clipboard</button>
            <input
              type="text"
              className="form-control"
              placeholder="URL raw GitHub"
              value={gitUrl}
              onChange={e => setGitUrl(e.target.value)}
            />
            <button className="btn btn-info text-white" onClick={loadFromGit}>
              Load from GitHub
            </button>
          </div>

          <button
            className="btn btn-primary mb-4"
            onClick={generate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate diagram'}
          </button>
        </div>

        <div >
          {url && <DiagramViewer url={url} />}
        </div>
      </div>

    </div>
  )
}
