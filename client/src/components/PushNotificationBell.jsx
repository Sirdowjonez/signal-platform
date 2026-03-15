import React, { useState } from 'react';

export default function PushNotificationBell() {
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = () => {
    // OneSignal integration stub
    if (window.OneSignal) {
      window.OneSignal.push(() => window.OneSignal.registerForPushNotifications());
    }
    setSubscribed(true);
    alert('Push notifications enabled! You will receive SIGNAL breaking news alerts.');
  };
  const s = {
    btn: { background:'none', border:'1px solid #333', borderRadius:'8px', color: subscribed ? '#00ff88' : '#aaa', padding:'8px 12px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', gap:'6px' },
    label: { fontSize:'12px', fontWeight:600 }
  };
  return (
    <button style={s.btn} onClick={handleSubscribe} title="Enable push notifications">
      {subscribed ? '🔔' : '🔕'} <span style={s.label}>{subscribed ? 'Alerts ON' : 'Get Alerts'}</span>
    </button>
  );
}
