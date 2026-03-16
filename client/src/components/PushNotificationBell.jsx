import React, { useState, useEffect } from 'react';

export default function PushNotificationBell() {
  const [state, setState] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied'

  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') setState('granted');
      if (Notification.permission === 'denied')  setState('denied');
    }
  }, []);

  async function handleClick() {
    if (state === 'granted' || state === 'denied') return;
    setState('requesting');

    // OneSignal path
    if (window.OneSignal) {
      try {
        await window.OneSignal.push(() => window.OneSignal.registerForPushNotifications());
        setState('granted');
        return;
      } catch {}
    }

    // Native Notifications API fallback
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setState(result === 'granted' ? 'granted' : 'denied');
      return;
    }

    setState('denied');
  }

  const label   = { idle: 'Alerts', requesting: '...', granted: 'Alerts ON', denied: 'Blocked' };
  const icon    = { idle: '🔕', requesting: '🔔', granted: '🔔', denied: '🚫' };
  const color   = { idle: '#4a4a6a', requesting: '#6c63ff', granted: '#34d399', denied: '#ef4444' };
  const title   = { idle: 'Enable breaking-news alerts', requesting: 'Requesting permission...', granted: 'Push alerts are on', denied: 'Notifications blocked in browser settings' };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'requesting' || state === 'granted' || state === 'denied'}
      title={title[state]}
      style={{
        background: 'none',
        border: `1px solid ${color[state]}44`,
        borderRadius: 8,
        color: color[state],
        padding: '6px 12px',
        cursor: state === 'idle' ? 'pointer' : 'default',
        fontSize: 12,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'border-color 0.2s, color 0.2s',
        animation: state === 'granted' ? 'liveDot 2s ease-in-out 1' : 'none',
      }}
    >
      <span style={{ fontSize: 14 }}>{icon[state]}</span>
      {label[state]}
    </button>
  );
}
