import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.528 5.832L.057 23.885a.5.5 0 0 0 .623.612l6.248-1.637A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75A9.745 9.745 0 0 1 6.682 20.3l-.346-.206-3.585.94.955-3.498-.226-.359A9.744 9.744 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

const WA_URL = `https://wa.me/919475002048?text=Hello%20AyurCare%2B%2C%20I%20need%20support.`;

export default function FloatingWhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // Slide in after 2s (slightly after AI chat button at 1.5s)
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '24px',
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(120px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      {/* Round floating WhatsApp button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25d366 0%, #128c4a 100%)',
          border: '2px solid rgba(37,211,102,0.4)',
          boxShadow: '0 8px 24px rgba(37,211,102,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          textDecoration: 'none',
          animation: 'waGlow 2.5s ease-in-out infinite',
          transition: 'transform 0.2s ease',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        title="Chat with us on WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </a>

      {/* Keyframes */}
      <style>{`
        @keyframes waPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        @keyframes waGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(37,211,102,0.35), 0 0 0 0 rgba(37,211,102,0.3); }
          50% { box-shadow: 0 8px 32px rgba(37,211,102,0.55), 0 0 0 8px rgba(37,211,102,0.08); }
        }
      `}</style>
    </div>
  );
}
