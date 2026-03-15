import React from 'react';
import { Link } from 'react-router-dom';

const s = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', background:'#0d0d0d', borderBottom:'1px solid #1e1e1e', position:'sticky', top:0, zIndex:100 },
  logo: { fontSize:'22px', fontWeight:800, color:'#00ff88', textDecoration:'none', letterSpacing:'-0.5px' },
  links: { display:'flex', gap:'20px', alignItems:'center' },
  link: { color:'#aaa', textDecoration:'none', fontSize:'14px', fontWeight:500 },
  cta: { background:'#00ff88', color:'#000', padding:'8px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'13px', fontWeight:700 }
};

export default function Navbar() {
  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>⚡ SIGNAL</Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Feed</Link>
        <Link to="/login" style={s.link}>Login</Link>
        <Link to="/subscribe" style={s.cta}>Go Premium $29/mo</Link>
      </div>
    </nav>
  );
}
