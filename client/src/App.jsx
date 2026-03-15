import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

// ── Page stubs (replace with full page components) ────────────────────────────

function HomePage() {
  return (
    <main className="page">
      <h1>SIGNAL</h1>
      <p className="tagline">AI · Finance · Crypto — curated in real time.</p>
      <section className="feed-placeholder">
        <p>News feed loads here.</p>
      </section>
    </main>
  );
}

function PostPage() {
  const { id } = useParams();
  return (
    <main className="page">
      <h2>Post #{id}</h2>
      <p>Article content loads here.</p>
    </main>
  );
}

function SubscribePage() {
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) setStatus('success');
    if (params.get('canceled')) setStatus('canceled');
  }, []);

  return (
    <main className="page">
      <h2>Subscribe to SIGNAL</h2>
      {status === 'success' && <p className="alert success">Subscription activated!</p>}
      {status === 'canceled' && <p className="alert canceled">Checkout canceled.</p>}
      <div className="plans">
        <div className="plan-card">
          <h3>Basic</h3>
          <p className="price">$9.99 / mo</p>
          <ul>
            <li>Full article access</li>
            <li>Daily digest email</li>
          </ul>
          <button>Get Basic</button>
        </div>
        <div className="plan-card featured">
          <h3>Pro</h3>
          <p className="price">$19.99 / mo</p>
          <ul>
            <li>Everything in Basic</li>
            <li>Real-time alerts</li>
            <li>API access</li>
          </ul>
          <button>Get Pro</button>
        </div>
      </div>
    </main>
  );
}

function LoginPage() {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      localStorage.setItem('signal_token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page narrow">
      <h2>Sign in to SIGNAL</h2>
      {error && <p className="alert error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <p>
        Don't have an account? <Link to="/subscribe">Subscribe</Link>
      </p>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="page">
      <h2>404 — Page not found</h2>
      <Link to="/">Go home</Link>
    </main>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">SIGNAL</Link>
      <div className="nav-links">
        <Link to="/">Feed</Link>
        <Link to="/subscribe">Subscribe</Link>
        <Link to="/login">Sign in</Link>
      </div>
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

import React from 'react';
import { useParams } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
