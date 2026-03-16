import React, { useState, useEffect, useRef } from 'react';

const VIDEO_SRC = 'https://www.w3schools.com/html/mov_bbb.mp4';

const FEATURED = {
  title: 'BREAKING: Fed Emergency Meeting — Markets Brace for Historic Rate Decision',
  category: 'finance',
  duration: 180,
};

function fmtViewers(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

function ActionButton({ icon, label, active, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={() => { setPressed(p => !p); onClick && onClick(); }}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '6px 4px',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: pressed || active ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${pressed || active ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
        transition: 'background 0.2s, transform 0.15s',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.3 }}>
        {label}
      </span>
    </button>
  );
}

export default function FeaturedVideo() {
  const videoRef = useRef(null);
  const [viewers, setViewers] = useState(14200);
  const [elapsed, setElapsed] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(3847);
  const [muted, setMuted] = useState(true);

  // Fluctuate viewer count
  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => Math.max(12000, v + Math.floor((Math.random() - 0.45) * 120)));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Progress timer
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(e => (e >= FEATURED.duration ? 0 : e + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function toggleMute() {
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }

  function handleLike() {
    setLiked(l => {
      setLikeCount(c => l ? c - 1 : c + 1);
      return !l;
    });
  }

  const progress = (elapsed / FEATURED.duration) * 100;
  const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 520,
      margin: '0 auto 24px',
      borderRadius: 18,
      overflow: 'hidden',
      background: '#000',
      aspectRatio: '9/16',
      maxHeight: '72vh',
    }}>
      {/* Video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Dark vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top row — BREAKING badge + viewers + mute */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: '#ef4444', color: '#fff',
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
            padding: '4px 10px', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block',
              animation: 'liveDot 1.2s ease-in-out infinite',
            }} />
            BREAKING
          </span>
          <span style={{
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ color: '#ef4444', fontSize: 10 }}>●</span>
            {fmtViewers(viewers)} watching
          </span>
        </div>

        <button
          onClick={toggleMute}
          style={{
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: 36, height: 36,
            color: '#fff', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >{muted ? '🔇' : '🔊'}</button>
      </div>

      {/* Right-side TikTok-style action buttons */}
      <div style={{
        position: 'absolute', right: 12, bottom: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <ActionButton
          icon={liked ? '❤️' : '🤍'}
          label={likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}
          active={liked}
          onClick={handleLike}
        />
        <ActionButton icon="↗️" label="Share" />
        <ActionButton icon="🔖" label="Save" />
        <ActionButton icon="➕" label="Follow" />
      </div>

      {/* Bottom overlay — title + progress */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 16px 16px',
      }}>
        {/* Category */}
        <span style={{
          display: 'inline-block',
          fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          color: '#34d399', background: 'rgba(52,211,153,0.15)',
          border: '1px solid rgba(52,211,153,0.3)',
          padding: '3px 8px', borderRadius: 4, marginBottom: 8,
        }}>
          Finance
        </span>

        {/* Title */}
        <h2 style={{
          margin: '0 0 12px',
          fontSize: 15, fontWeight: 800, lineHeight: 1.35, color: '#fff',
          textShadow: '0 1px 8px rgba(0,0,0,0.8)',
          paddingRight: 60,
        }}>
          {FEATURED.title}
        </h2>

        {/* Progress bar */}
        <div style={{ marginBottom: 6 }}>
          <div style={{
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.2)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
              borderRadius: 2,
              transition: 'width 0.9s linear',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: 4,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{fmtTime(elapsed)}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{fmtTime(FEATURED.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
