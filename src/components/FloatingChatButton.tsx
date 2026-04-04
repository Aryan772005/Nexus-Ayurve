import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, X, MessageCircle } from 'lucide-react';

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show on the chat page itself
  const isChatPage = location.pathname === '/chat';

  useEffect(() => {
    if (isChatPage || dismissed) return;
    // Slide in after 1.5s
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [isChatPage, dismissed]);

  if (isChatPage || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '24px',
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(120px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      {/* Tooltip bubble above button */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
          border: '1px solid rgba(52,211,153,0.25)',
          borderRadius: '16px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.1)',
          cursor: 'pointer',
          userSelect: 'none',
          backdropFilter: 'blur(12px)',
        }}
        onClick={() => navigate('/chat')}
      >
        {/* Pulsing leaf icon */}
        <span
          style={{
            background: 'rgba(52,211,153,0.2)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            animation: 'leafPulse 2s ease-in-out infinite',
          }}
        >
          <Leaf style={{ color: '#34d399', width: '16px', height: '16px' }} />
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#ecfdf5',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
            }}
          >
            Chat with AI
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(52,211,153,0.7)',
              lineHeight: 1.2,
            }}
          >
            Know your disease
          </span>
        </div>

        {/* Dismiss X */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setTimeout(() => setDismissed(true), 400);
          }}
          style={{
            marginLeft: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(52,211,153,0.5)',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50%',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(52,211,153,0.5)')}
          title="Dismiss"
        >
          <X size={13} />
        </button>
      </div>

      {/* Round floating icon button */}
      <button
        onClick={() => navigate('/chat')}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
          border: '2px solid rgba(52,211,153,0.4)',
          boxShadow: '0 8px 24px rgba(52,211,153,0.35), 0 0 0 0 rgba(52,211,153,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          animation: 'buttonGlow 2.5s ease-in-out infinite',
          transition: 'transform 0.2s ease',
          alignSelf: 'flex-end',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="Chat with AI"
      >
        <MessageCircle style={{ color: '#052e16', width: '24px', height: '24px' }} />
      </button>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes leafPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(52,211,153,0.35), 0 0 0 0 rgba(52,211,153,0.3); }
          50% { box-shadow: 0 8px 32px rgba(52,211,153,0.5), 0 0 0 8px rgba(52,211,153,0.1); }
        }
      `}</style>
    </div>
  );
}
