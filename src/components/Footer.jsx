import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Share2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-matcha-950 text-matcha-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <span className="text-2xl font-bold text-white mb-6 inline-block flex items-center gap-2">
              {settings.logo_url && (
                <img src={settings.logo_url} alt={settings.business_name} className="h-10 w-auto object-contain brightness-0 invert" />
              )}
              {(!settings.logo_url) && settings.business_name}
            </span>
            <p className="text-matcha-200 mb-6 leading-relaxed">
              Layanan catering modern dan profesional untuk setiap momen berharga Anda. Menyajikan kualitas bintang lima dengan harga terjangkau.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-matcha-800 flex items-center justify-center text-white hover:bg-matcha-600 transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Tautan Cepat</h4>
            <ul className="space-y-3">
              {['Tentang Kami', 'Menu', 'Galeri', 'Testimoni', 'Kontak'].map((item) => (
                <li key={item}>
                  <ScrollLink 
                    to={item === 'Tentang Kami' ? 'about' : item.toLowerCase()} 
                    smooth={true} 
                    className="text-matcha-200 hover:text-white cursor-pointer transition-colors"
                  >
                    {item}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Layanan</h4>
            <ul className="space-y-3 text-matcha-200">
              <li>Wedding Catering</li>
              <li>Corporate Event</li>
              <li>Nasi Kotak & Bento</li>
              <li>Tumpeng Tradisional</li>
              <li>Coffee Break</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Newsletter</h4>
            <p className="text-matcha-200 mb-4">Dapatkan info promo dan menu terbaru dari kami.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="bg-matcha-900 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-matcha-500 border border-matcha-800 border-r-0"
              />
              <button 
                type="button" 
                className="bg-matcha-600 px-4 py-2 rounded-r-md hover:bg-matcha-500 transition-colors font-medium text-white"
              >
                Kirim
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="border-t border-matcha-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-matcha-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-matcha-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
