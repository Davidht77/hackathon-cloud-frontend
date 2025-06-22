// src/utils/diagramApi.js
const API_BASE = "https://q21cw17oy6.execute-api.us-east-1.amazonaws.com/dev/diagrama"


export async function generateAwsDiagram(code, token) {
  const res = await fetch(`${API_BASE}/aws`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `${token}`
    },
    body: JSON.stringify({ code })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  const { diagram_url } = await res.json()
  return diagram_url
}



export async function generateER(code, token) {
  const res = await fetch(`${API_BASE}/ER`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `${token}`
    },
    body: JSON.stringify({ code })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  const { diagram_url } = await res.json()
  return diagram_url
}
