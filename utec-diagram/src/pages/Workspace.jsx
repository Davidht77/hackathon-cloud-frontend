import { useState } from 'react'
import EditorPanel from '../components/EditorPanel'
import FileUploader from '../components/FileUploader'
import DiagramTypeSelector from '../components/DiagramTypeSelector'
import DiagramViewer from '../components/DiagramViewer'
import { fetchFromGitHub } from '../utils/githubFetch'
import { useAuth } from '../contexts/AuthContext'

export default function Workspace(){
  const [code, setCode]     = useState('// escribe tu diagrama aquí')
  const [type, setType]     = useState('aws')
  const [url, setUrl]       = useState('')
  const [loading, setLoading] = useState(false)
  const [gitUrl, setGitUrl] = useState('')
  const { token, logout } = useAuth();

  const generate = async () => {
    if(!code.trim()) return alert('Agrega código primero')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(import.meta.env.VITE_API_URL + '/diagram', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, code })
      })
      if(!res.ok) throw new Error()
      const { url } = await res.json()
      setUrl(url)
    } catch {
      alert('Error generando diagrama')
    } finally {
      setLoading(false)
    }
  }

  const loadFromGit = async () => {
    if(!gitUrl.trim()) return
    try {
      const txt = await fetchFromGitHub(gitUrl)
      setCode(txt)
    } catch {
      alert('No pude cargar de GitHub')
    }
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>UTEC Diagram</h3>
        <button
          className="btn btn-outline-danger"
          onClick={()=>{
            localStorage.removeItem('token')
            logout();
            window.location='/login'
            
           }
          }

           
        >Cerrar sesión</button>
      </div>

      <DiagramTypeSelector type={type} setType={setType}/>

      <div className="my-2">
        <EditorPanel code={code} setCode={setCode}/>
      </div>

      <div className="d-flex gap-2 mb-3">
        <FileUploader onLoad={setCode}/>
        <button
          className="btn btn-secondary"
          onClick={async()=>{
            const text = await navigator.clipboard.readText()
            setCode(text)
          }}
        >Pegar portapapeles</button>
        <input
          type="text"
          className="form-control"
          placeholder="URL raw GitHub"
          value={gitUrl}
          onChange={e=>setGitUrl(e.target.value)}
        />
        <button className="btn btn-info text-white" onClick={loadFromGit}>
          Cargar GitHub
        </button>
      </div>

      <button
        className="btn btn-primary mb-4"
        onClick={generate}
        disabled={loading}
      >
        {loading ? 'Generando…' : 'Generar diagrama'}
      </button>

      {url && <DiagramViewer url={url}/>}
    </div>
  )
}
