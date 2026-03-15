import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(endpoint, form);
      localStorage.setItem('signal_token', data.token);
      localStorage.setItem('signal_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || 'Something went wrong'); }
    setLoading(false);
  };

  const s = {
    wrap: { maxWidth:'380px', margin:'60px auto', padding:'0 16px' },
    card: { background:'#111', border:'1px solid #1e1e1e', borderRadius:'20px', padding:'32px' },
    title: { fontSize:'24px', fontWeight:800, margin:'0 0 24px', textAlign:'center' },
    input: { width:'100%', background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'12px 16px', color:'#fff', fontSize:'15px', marginBottom:'12px', boxSizing:'border-box', outline:'none' },
    btn: { width:'100%', background: loading ? '#555':'#00ff88', color:'#000', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:700, cursor:'pointer', marginTop:'4px' },
    toggle: { textAlign:'center', marginTop:'20px', fontSize:'13px', color:'#888' },
    toggleBtn: { background:'none', border:'none', color:'#00ff88', cursor:'pointer', fontWeight:600, fontSize:'13px' },
    err: { background:'#ff000022', border:'1px solid #ff000044', borderRadius:'8px', padding:'10px 14px', color:'#ff6666', fontSize:'13px', marginBottom:'12px' }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={s.title}>{mode === 'login' ? 'Welcome back ⚡' : 'Join SIGNAL ⚡'}</h2>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && <input style={s.input} placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />}
          <input style={s.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div style={s.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button style={s.toggleBtn} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
