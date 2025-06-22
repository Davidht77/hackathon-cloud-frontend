import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    // ejemplo de fetch a tu API de auth
    const res = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password: pass })
    })
    if(!res.ok) return alert('Credenciales inválidas')
    const { token } = await res.json()
    localStorage.setItem('token', token)
    nav('/app')
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Iniciar sesión</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={pass}
            onChange={e=>setPass(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  )
}
