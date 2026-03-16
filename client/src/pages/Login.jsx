import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('signal_token')) navigate('/');
  }, [navigate]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      localStorage.setItem('signal_token', data.token);
      localStorage.setItem('signal_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: '#0d0d18', border: '1px solid #1e1e2e',
    borderRadius: 10, padding: '13px 16px',
    color: '#eeeef5', fontSize: 15, outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#eeeef5', letterSpacing: 3 }}>SIGNAL</span>
          </Link>
          <p style={{ margin: '12px 0 0', color: '#4a4a6a', fontSize: 14 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#0f0f1a', border: '1px solid #1c1c2e', borderRadius: 18, padding: '32px 28px' }}>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '11px 14px',
              color: '#f87171', fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && (
              <input
                style={inputStyle}
                placeholder="Full name"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                onFocus={e => e.target.style.borderColor = '#6c63ff'}
                onBlur={e => e.target.style.borderColor = '#1e1e2e'}
              />
            )}
            <input
              style={inputStyle}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
              onFocus={e => e.target.style.borderColor = '#6c63ff'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onFocus={e => e.target.style.borderColor = '#6c63ff'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                background: loading ? '#1e1e2e' : 'linear-gradient(90deg, #6c63ff, #a78bfa)',
                color: loading ? '#4a4a6a' : '#fff',
                border: 'none', borderRadius: 10,
                padding: '14px', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#4a4a6a' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0 }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#2a2a3e' }}>
          AI · Finance · Crypto — curated in real time
        </p>
      </div>
    </div>
  );
}
