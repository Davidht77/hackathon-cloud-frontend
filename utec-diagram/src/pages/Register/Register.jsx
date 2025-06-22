import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css';
import './Register.css';
import logo from '../../assets/logo.png';
import { signup } from '../../utils/authApi';

export default function Register() {
  const [form, setForm] = useState({
    email: '', pass: '', pass2: ''
  });
  const nav = useNavigate();
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (form.pass !== form.pass2) return alert('Las contraseñas no coinciden');
    try {
      const response = await signup({
        tenant_id: 'peru',
        email: form.email,
        password: form.pass
      });
      console.log(response)
      nav('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <main className="register-card">
        <form onSubmit={submit}>
          <h1 className="header-title">Create account</h1>
          <p className="subtitle">Sign up to start building diagrams as code.</p>

          {/* E-mail */}
          <label className="input-label">Email
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={update}
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
          <label className="input-label">Password
            <div className="input-wrapper">
              <input
                type="password"
                name="pass"
                placeholder="Create a password"
                value={form.pass}
                onChange={update}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 11V7a5 5 0 00-10 0v4M5 11h14v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" />
              </svg>
            </div>
          </label>

          {/* Confirmación */}
          <label className="input-label">Confirm password
            <div className="input-wrapper">
              <input
                type="password"
                name="pass2"
                placeholder="Repeat your password"
                value={form.pass2}
                onChange={update}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 11V7a5 5 0 00-10 0v4M5 11h14v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z" />
              </svg>
            </div>
          </label>

          <button className="btn-primary">Register</button>

          <a className="secondary-link" onClick={() => nav('/login')}>
            Already have an account? Log in
          </a>
        </form>
      </main>

      <div className="login-image">
        <img src={logo} alt="Diagram with Code logo" />
      </div>
    </div>
  );
}
