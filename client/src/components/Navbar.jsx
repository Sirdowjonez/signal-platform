import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PushNotificationBell from './PushNotificationBell';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('signal_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    localStorage.removeItem('signal_token');
    localStorage.removeItem('signal_user');
    setUser(null);
    navigate('/');
  }

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#eeeef5' : '#4a4a6a',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: isActive(path) ? 700 : 500,
    letterSpacing: 0.2,
    transition: 'color 0.15s',
    paddingBottom: 2,
    borderBottom: isActive(path) ? '1px solid #6c63ff' : '1px solid transparent',
  });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 56,
      background: scrolled ? 'rgba(8,8,16,0.92)' : '#080810',
      borderBottom: `1px solid ${scrolled ? '#1c1c2e' : 'transparent'}`,
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      transition: 'background 0.2s, border-color 0.2s, backdrop-filter 0.2s',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: '#eeeef5', letterSpacing: 3 }}>SIGNAL</span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: '#6c63ff',
          background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
          padding: '2px 6px', borderRadius: 3,
        }}>LIVE</span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link to="/" style={linkStyle('/')}>Feed</Link>
        <Link to="/subscribe" style={linkStyle('/subscribe')}>Subscribe</Link>
        {user ? (
          <>
            <PushNotificationBell />
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: '1px solid #2a2a3e', borderRadius: 8,
                color: '#6a6a8a', fontSize: 12, fontWeight: 600, padding: '6px 14px', cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff55'; e.currentTarget.style.color = '#eeeef5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a3e'; e.currentTarget.style.color = '#6a6a8a'; }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>Sign in</Link>
            <Link to="/subscribe" style={{
              background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
              color: '#fff', textDecoration: 'none',
              fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
              padding: '8px 18px', borderRadius: 8,
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Go Pro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
