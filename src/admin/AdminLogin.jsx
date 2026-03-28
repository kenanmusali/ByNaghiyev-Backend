import React, { useState } from 'react';
import { ADMIN_CREDENTIALS } from '../config/github';
import LogoSvg from '../../public/assets/svg/logo.svg';

const AdminLogin = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 500));

    // Guard: env vars may be undefined if .env is not configured
    const expectedEmail    = ADMIN_CREDENTIALS?.email    ?? '';
    const expectedPassword = ADMIN_CREDENTIALS?.password ?? '';

    if (!expectedEmail || !expectedPassword) {
      setError('Admin credentials are not configured. Please set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in your .env file.');
      setLoading(false);
      return;
    }

    if (
      email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
      password === expectedPassword
    ) {
      sessionStorage.setItem('adm_auth', '1');
      onLogin();
    } else {
      setError('Invalid email or password.');
    }

    setLoading(false);
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-logo">
          <img src={LogoSvg} alt="By Naghiyev" />
        </div>
        <h2 className="adm-login-title">Admin Panel</h2>
        <p className="adm-login-sub">Sign in to manage your website</p>

        <form onSubmit={handleSubmit}>
          <div className="adm-field">
            <label className="adm-label">Email address</label>
            <input
              type="email"
              className="adm-input"
              placeholder="admin@bynaghiyev.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="adm-field">
            <label className="adm-label">Password</label>
            <input
              type="password"
              className="adm-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="adm-login-btn" disabled={loading}>
            {loading
              ? <><span className="adm-spinner" /> Signing in…</>
              : 'Sign In'}
          </button>
        </form>

        {error && <div className="adm-login-error">{error}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;