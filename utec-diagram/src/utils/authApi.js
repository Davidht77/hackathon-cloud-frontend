// Pequeña capa de abstracción sobre los 3 endpoints de usuario

const base = 'https://q21cw17oy6.execute-api.us-east-1.amazonaws.com/dev/usuario';

export async function signup({ tenant_id, email, password }) {
  const res = await fetch(`${base}/signup`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ tenant_id, email, password })
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Error registrando');
  }
  return res.json(); 
}

export async function login({ tenant_id, email, password }) {
  const res = await fetch(`${base}/login`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ tenant_id, email, password })
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Credenciales inválidas');
  }
  return res.json(); // { token, expires, ... }
}

export async function validateToken(token) {
  const res = await fetch(`${base}/validar`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ token })
  });
  if (!res.ok) throw new Error('Token inválido');
  return res.json(); // { tenant_id, user_id, expires }
}
