import React, { useState } from 'react';
import axios from 'axios';

const PERKS = ['Unlimited premium stories', 'AI-generated market briefs (every 30 min)', 'Early access to breaking news', 'No ads, ever', 'Cancel anytime'];

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/subscribe', { email });
      if (data.url) window.location.href = data.url;
      else alert('Subscription flow started! (Connect Stripe to complete.)');
    } catch { alert('Stripe not yet configured. Add STRIPE_SECRET_KEY to .env'); }
    setLoading(false);
  };

  const s = {
    wrap: { maxWidth:'440px', margin:'40px auto', padding:'0 16px' },
    card: { background:'#111', border:'1px solid #1e1e1e', borderRadius:'20px', padding:'32px' },
    badge: { background:'#00ff8822', color:'#00ff88', fontSize:'12px', fontWeight:700, padding:'4px 10px', borderRadius:'4px', display:'inline-block', marginBottom:'16px' },
    title: { fontSize:'28px', fontWeight:800, margin:'0 0 8px' },
    price: { fontSize:'42px', fontWeight:800, margin:'20px 0 4px', color:'#00ff88' },
    perks: { listStyle:'none', padding:0, margin:'20px 0 24px' },
    perk: { padding:'8px 0', borderBottom:'1px solid #1a1a1a', fontSize:'14px', color:'#ccc', display:'flex', alignItems:'center', gap:'10px' },
    input: { width:'100%', background:'#1a1a1a', border:'1px solid #333', borderRadius:'10px', padding:'12px 16px', color:'#fff', fontSize:'15px', marginBottom:'12px', boxSizing:'border-box', outline:'none' },
    btn: { width:'100%', background: loading ? '#555' : '#00ff88', color:'#000', border:'none', borderRadius:'10px', padding:'14px', fontSize:'16px', fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer' }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <span style={s.badge}>SIGNAL PREMIUM</span>
        <h1 style={s.title}>Bloomberg for the<br/>AI-native generation.</h1>
        <div style={s.price}>$29<span style={{fontSize:'18px', color:'#888'}}>/mo</span></div>
        <ul style={s.perks}>{PERKS.map(p => <li key={p} style={s.perk}><span>✓</span>{p}</li>)}</ul>
        <form onSubmit={handleSubscribe}>
          <input style={s.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Redirecting...' : 'Start Premium Access →'}</button>
        </form>
      </div>
    </div>
  );
}
