import React from 'react';
import { Leaf, MapPin, Phone, Users, Mail } from 'lucide-react';

// WhatsApp SVG logo inline (official green brand)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.528 5.832L.057 23.885a.5.5 0 0 0 .623.612l6.248-1.637A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75A9.745 9.745 0 0 1 6.682 20.3l-.346-.206-3.585.94.955-3.498-.226-.359A9.744 9.744 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

export default function Footer() {
  const whatsappUrl = `https://wa.me/919475002048?text=Hello%20AyurCare%2B%2C%20I%20need%20support%20with%20my%20appointment.`;

  return (
    <footer className="bg-moss/20 border-t border-white/5 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">

        {/* Brand & Location */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 opacity-50">
            <Leaf size={24} className="text-emerald-accent" />
            <span className="font-display font-bold text-xl text-cream">Ayurcare+</span>
          </div>
          <p className="text-xs text-emerald-accent/30 flex items-center gap-1 mt-1">
            <MapPin size={12} /> Desh Bhagat University, Mandi Govindgarh
          </p>
        </div>

        {/* Core Team Details */}
        <div className="flex flex-col items-center md:items-start text-sm text-emerald-accent/60 gap-1.5 bg-forest/40 p-5 rounded-2xl border border-white/5 shadow-inner">
          <p className="flex items-center gap-2 font-bold text-cream mb-1 text-base">
            <Users size={16} className="text-emerald-accent" /> Team Leadership
          </p>
          <p><strong className="text-cream/90">CEO:</strong> Aryan Singh Tariani</p>
          <p><strong className="text-cream/90">Business Analyst:</strong> Rounak</p>
          <p><strong className="text-cream/90">Data Management:</strong> Nitin Gupta</p>
          <a href="tel:+919475002048" className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-emerald-accent hover:text-white transition-colors font-medium">
            <Phone size={14} /> +91 94750 02048
          </a>
        </div>

        {/* Support Section */}
        <div className="flex flex-col items-center md:items-end gap-4">

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #25d366 0%, #128c4a 100%)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(37,211,102,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.35)';
            }}
          >
            <WhatsAppIcon />
            Chat with us
          </a>

          {/* Email Support */}
          <a
            href="mailto:aryansinghtariani@gmail.com"
            className="flex items-center gap-2 text-sm text-emerald-accent/60 hover:text-emerald-accent transition-colors"
          >
            <Mail size={14} />
            aryansinghtariani@gmail.com
          </a>

          {/* Links + Copyright */}
          <div className="flex items-center gap-4 text-sm font-medium text-emerald-accent/60">
            <a href="#" className="hover:text-emerald-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-accent transition-colors">Terms of Service</a>
          </div>
          <p className="text-sm text-emerald-accent/40 text-center md:text-right">
            &copy; {new Date().getFullYear()} Aryan Singh Tariani.<br />All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
