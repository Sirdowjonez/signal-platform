import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import PushNotificationBell from '../components/PushNotificationBell';
import axios from 'axios';

const FILTERS = ['All', 'AI', 'Finance', 'Crypto'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/posts').then(r => { setPosts(r.data.posts); setLoading(false); })
      .catch(() => { setPosts([]); setLoading(false); });
  }, []);

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  const s = {
    wrap: { maxWidth: '480px', margin: '0 auto', padding: '16px' },
    header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
    title: { fontSize:'20px', fontWeight:800, margin:0 },
    filters: { display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' },
    pill: active => ({ background: active ? '#00ff88' : '#1a1a1a', color: active ? '#000' : '#aaa', border: 'none', borderRadius:'20px', padding:'7px 16px', fontSize:'13px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }),
    empty: { textAlign:'center', color:'#555', padding:'60px 0', fontSize:'15px' },
    pulse: { display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'#00ff88', marginRight:'6px', animation:'pulse 1.5s infinite' }
  };

  return (
    <div style={s.wrap}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      <div style={s.header}>
        <h1 style={s.title}><span style={s.pulse} />Live Feed</h1>
        <PushNotificationBell />
      </div>
      <div style={s.filters}>
        {FILTERS.map(f => <button key={f} style={s.pill(filter===f)} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      {loading ? <p style={s.empty}>Loading signals...</p>
        : filtered.length === 0 ? <p style={s.empty}>No posts yet.</p>
        : filtered.map(p => <VideoCard key={p.id} post={p} />)}
    </div>
  );
}
