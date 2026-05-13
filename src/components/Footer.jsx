import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useSettings } from '../context/SettingsContext';
import { Share2, MessageCircle, MapPin, Phone, Mail, ChefHat, Heart } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();

  const navLinks = [
    { label: 'Tentang Kami', to: 'about' },
    { label: 'Menu', to: 'menu' },
    { label: 'Galeri', to: 'gallery' },
    { label: 'Testimoni', to: 'testimonials' },
    { label: 'Kontak', to: 'contact' },
  ];

  const services = [
    'Wedding Catering',
    'Corporate Event',
    'Nasi Kotak & Bento',
    'Tumpeng Tradisional',
    'Coffee Break',
    'Birthday Party',
  ];

  return (
    <footer className="bg-gray-950 text-gray-300">
      
      {/* Top CTA band */}
      <div className="bg-matcha-700 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-1">
              Siap Membuat Event Anda Berkesan?
            </h3>
            <p className="text-matcha-100/80 text-sm">
              Konsultasikan kebutuhan catering Anda dengan tim kami sekarang.
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.whatsapp_number || '6281234567890'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-matcha-800 font-extrabold px-8 py-3.5 rounded-xl hover:bg-matcha-50 transition-colors shadow-lg hover:shadow-xl text-sm inline-flex items-center gap-2"
          >
            <MessageCircle size={18} />
            Chat via WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.business_name} className="h-10 w-auto object-contain brightness-0 invert" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-matcha-600 rounded-xl flex items-center justify-center">
                    <ChefHat size={22} className="text-white" />
                  </div>
                  <span className="text-white text-xl font-extrabold">{settings.business_name}</span>
                </>
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Layanan catering modern dan profesional untuk setiap momen berharga Anda. Kualitas bintang lima dengan harga terjangkau.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-matcha-700 hover:text-white transition-all">
                <Share2 size={18} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp_number || '6281234567890'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <ScrollLink
                    to={link.to}
                    smooth={true}
                    className="text-gray-400 hover:text-matcha-300 cursor-pointer transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-matcha-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s} className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-matcha-600 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-4">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-matcha-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm leading-relaxed">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-matcha-500 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-gray-400 text-sm hover:text-matcha-300 transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-matcha-500 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-gray-400 text-sm hover:text-matcha-300 transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {!settings.address && !settings.phone && !settings.email && (
                <li className="text-gray-500 text-sm">Atur di pengaturan admin.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} {settings.business_name}. Dibuat dengan
            <Heart size={13} className="text-red-400 fill-red-400" />
          </p>
          <div className="flex gap-5 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
