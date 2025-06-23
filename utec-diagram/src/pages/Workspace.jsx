import { useState, useEffect } from 'react'
import EditorPanel from '../components/EditorPanel'
import FileUploader from '../components/FileUploader'
import DiagramTypeSelector from '../components/DiagramTypeSelector'
import DiagramViewer from '../components/DiagramViewer'
import { fetchFromGitHub } from '../utils/githubFetch'
import { useAuth } from '../contexts/AuthContext'
import { generateAwsDiagram, generateER, generateJSON } from '../utils/diagramApi'

const DEFAULT_CODE = `// AWS example 
Diagrama 'InfraestructuraCompleta'
VPC "VPC-Produccion"
Subnet "Publica-1" conectado a VPC "VPC-Produccion"
Subnet "Publica-2" conectado a VPC "VPC-Produccion"
Subnet "Privada-1" conectado a VPC "VPC-Produccion"
Subnet "Privada-2" conectado a VPC "VPC-Produccion"

IGW "InternetGateway" conectado a VPC "VPC-Produccion"
RouteTable "RT-Publica" conectado a Subnet "Publica-1"
RouteTable "RT-Publica" conectado a Subnet "Publica-2"
RouteTable "RT-Privada" conectado a Subnet "Privada-1"
RouteTable "RT-Privada" conectado a Subnet "Privada-2"

EC2 "WebServer-1" conectado a Subnet "Publica-1"
EC2 "WebServer-2" conectado a Subnet "Publica-2"

ALB "LoadBalancer" conectado a Subnet "Publica-1"
ALB "LoadBalancer" conectado a Subnet "Publica-2"
ALB "LoadBalancer" conectado a EC2 "WebServer-1"
ALB "LoadBalancer" conectado a EC2 "WebServer-2"

NAT "NAT-Gateway" conectado a Subnet "Publica-1"
NAT "NAT-Gateway" conectado a RouteTable "RT-Privada"

ECSCluster "ECS-Cluster" conectado a Subnet "Privada-1"
ECSService "API-Service" conectado a ECSCluster "ECS-Cluster"
API "API-Gateway" conectado a ECSService "API-Service"

RDS "PostgresDB" conectado a Subnet "Privada-2"
ElastiCache "RedisCache" conectado a Subnet "Privada-2"

S3 "StaticAssets" conectado a CloudFront "CDN"
CloudFront "CDN" conectado a Route53 "DNS"
ACM "CertificadoTLS" conectado a CloudFront "CDN"
Route53 "DNS" conectado a ALB "LoadBalancer"

Lambda "ThumbnailGen" conectado a S3 "StaticAssets"
SNS "Notificaciones" conectado a Lambda "ThumbnailGen"
SQS "ColaTrabajo" conectado a Lambda "ThumbnailGen"

User "VisitanteWeb" conectado a ALB "LoadBalancer"
Admin "Administrador" conectado a EC2 "WebServer-1"

`

export default function Workspace() {

  const [code, setCode] = useState(() => {
    return localStorage.getItem('diagramCode') || DEFAULT_CODE
  })

  const [type, setType] = useState('aws')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [gitUrl, setGitUrl] = useState('')
  const { logout } = useAuth();

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
      else if (type === 'json') {
        let parsed
        try {
          parsed = JSON.parse(code)
        } catch {
          throw new Error('Tu código JSON no es válido')
        }
        diagramUrl = await generateJSON(parsed, token)
      }
      setUrl(diagramUrl)
    } catch (e) {
      console.error(e)
      alert(e.message || 'Diagram generating error')
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
      alert("I couldn't upload from GitHub")
    }
  }

  useEffect(() => {
    localStorage.setItem('diagramCode', code)
  }, [code])

  return (
    <div style={{ height: "100vh", width: "100%", display: "grid", gridTemplateRows: "70px auto" }}>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "auto 20px" }}>
        <h1 style={{ fontSize: "28px", marginTop: "14px", color: "#0f0f0f" }}>Diagram with code</h1>

        <button
          className="btn btn-outline-danger"
          style={{ width: "120px", height: "40px", marginTop: "20px" }}
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('diagramCode')
            logout();
            window.location = '/login'
          }
          }

        >Log out</button>

      </div>
      <div style={{ display: 'grid', gridTemplateColumns: "1fr 1fr", alignItems: "center", justifyContent: "center", gap: "20px", padding: "40px", backgroundColor: "#fbfbf6 " }}>
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

        <div style={{height: "100%"}} >
          {url && <DiagramViewer url={url} />}
        </div>
      </div>

    </div>
  )
}
