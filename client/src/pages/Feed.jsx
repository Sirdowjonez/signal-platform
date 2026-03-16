import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import PushNotificationBell from '../components/PushNotificationBell';
import FeaturedVideo from '../components/FeaturedVideo';
import Shorts from '../components/Shorts';
import VideoCarousel from '../components/VideoCarousel';
import SideBar from '../components/SideBar';
import MorningBriefing from '../components/MorningBriefing';

const FILTERS = ['All', 'AI', 'Finance', 'Crypto'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cat = filter === 'All' ? '' : `?category=${filter.toLowerCase()}`;
    setLoading(true);
    fetch(`/api/posts${cat}`)
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false); })
      .catch(() => { setError('Could not load posts.'); setLoading(false); });
  }, [filter]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

      {/* Main feed column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block',
              animation: 'liveDot 1.5s ease-in-out infinite',
            }} />
            Live Feed
          </h1>
          <PushNotificationBell />
        </div>

        {/* Morning Briefing */}
        <MorningBriefing />

        {/* Featured hero video */}
        <FeaturedVideo />

        {/* Shorts */}
        <Shorts />

        {/* Trending video carousel */}
        <VideoCarousel title="Trending Now" />

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: active ? '#6c63ff' : '#0f0f1a',
                  color: active ? '#fff' : '#4a4a6a',
                  border: `1px solid ${active ? '#6c63ff' : '#1c1c2e'}`,
                  borderRadius: 20, padding: '7px 18px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
              >{f}</button>
            );
          })}
        </div>

        {/* Content */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 260, borderRadius: 14, overflow: 'hidden',
                background: 'linear-gradient(90deg, #0f0f1a 25%, #16162a 50%, #0f0f1a 75%)',
                backgroundSize: '1000px 100%',
                animation: 'shimmer 1.6s ease-in-out infinite',
              }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p style={{ textAlign: 'center', color: '#f87171', padding: '60px 0' }}>{error}</p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#3a3a5a', padding: '60px 0', fontSize: 15 }}>No posts yet.</p>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(p => <VideoCard key={p.id} post={p} />)}
          </div>
        )}
      </div>

      {/* Sidebar — hidden on narrow screens via media query */}
      <style>{`
        @media (max-width: 860px) { .signal-sidebar { display: none !important; } }
      `}</style>
      <div className="signal-sidebar">
        <SideBar />
      </div>
    </div>
  );
}
