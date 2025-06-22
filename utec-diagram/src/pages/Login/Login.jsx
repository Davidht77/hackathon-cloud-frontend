import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logo.png';
import { login } from '../../utils/authApi';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass,  setPass ] = useState('');
  const nav = useNavigate();
const { login: saveToken } = useAuth();
  const submit = async e => {
    e.preventDefault();
    try {
      const { token } = await login({
        tenant_id: 'peru',
        email,
        password: pass
      });

      console.log()

      localStorage.setItem('token', token);
      saveToken(token);    
      nav('/app');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="login-page">
      <main className="login-card">
        <form onSubmit={submit}>
          <div className="header">
            <h1>Login</h1>
            <p className="subtitle">Access your diagram space.</p>
          </div>

          {/* E-mail */}
          <label className="input-label">E-mail
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 8.25v7.5A2.25 2.25 0 0118.75 18H5.25A2.25 2.25 0 013 15.75V8.25M21 8.25L12 13.5 3 8.25" />
              </svg>
            </div>
          </label>

          {/* Password */}
          <label className="input-label">Contraseña
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 11V7a5 5 0 00-10 0v4M5 11h14v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" />
              </svg>
            </div>
          </label>

          <button className="btn-primary">Sign In</button>

          <a className="secondary-link" onClick={() => nav('/register')}>
            Don't have an account? Create an account
          </a>
        </form>
      </main>

      <div className="login-image">
        <img src={logo} alt="Diagram with Code logo" />
      </div>
    </div>
  );
}
