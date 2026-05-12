import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Image as ImageIcon, Briefcase, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: '',
    whatsapp_number: '',
    email: '',
    address: '',
    logo_url: ''
  });

  // Sinkronisasi local state dengan global context
  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || '',
        whatsapp_number: settings.whatsapp_number || '',
        email: settings.email || '',
        address: settings.address || '',
        logo_url: settings.logo_url || ''
      });
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('catering-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('catering-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error.message);
      alert('Gagal mengupload logo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('settings')
        .update({
          business_name: formData.business_name,
          whatsapp_number: formData.whatsapp_number,
          email: formData.email,
          address: formData.address,
          logo_url: formData.logo_url,
          updated_at: new Date()
        })
        .eq('id', 1);
        
      if (error) throw error;
      
      // Refresh global context
      await refreshSettings();
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error saving settings:', error.message);
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pengaturan Usaha</h1>
        <p className="text-gray-500 mt-2">Atur identitas merek, logo, dan informasi kontak publik Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Identitas & Logo */}
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <Briefcase size={20} className="text-matcha-600" /> Profil & Logo
            </h3>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Logo Area */}
              <div className="md:col-span-1 flex flex-col items-center justify-start">
                <div className="w-full max-w-[200px]">
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Logo Saat Ini</label>
                  
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:border-matcha-400 transition-colors shadow-inner group">
                    {formData.logo_url ? (
                      <>
                        <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-transform shadow-lg">
                            Ganti Logo
                            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer text-center text-gray-400 p-6 w-full h-full flex flex-col items-center justify-center hover:text-matcha-600 transition-colors">
                        <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                        <span className="text-sm font-medium">{uploading ? 'Mengupload...' : 'Klik untuk Upload Logo'}</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                      </label>
                    )}
                  </div>
                  
                  {formData.logo_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logo_url: '' })}
                      className="mt-3 w-full block text-center text-red-500 hover:text-red-700 text-sm font-bold transition-colors py-2"
                    >
                      Hapus Logo
                    </button>
                  )}
                </div>
              </div>
              
              {/* Inputs Area */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Usaha / Merek <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 hover:bg-white text-gray-800 font-medium"
                    placeholder="Cth: Catering-in"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Akan tampil di bagian Navbar jika tidak ada logo gambar.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">URL Logo <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <input 
                    type="text" 
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 hover:bg-white text-sm"
                    placeholder="Atau paste link gambar (https://...)"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Gunakan ini jika Anda mengunggah logo ke layanan pihak ketiga (seperti Imgur).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Kontak Publik */}
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <Phone size={20} className="text-matcha-600" /> Informasi Kontak Publik
            </h3>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={16} className="text-gray-400" /> WhatsApp Pemesanan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-bold text-gray-500">+</span>
                  <input 
                    type="text" 
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 hover:bg-white font-medium tracking-wide"
                    placeholder="6281234567890"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Gunakan kode negara (62) tanpa angka 0 di depan.</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={16} className="text-gray-400" /> Email Publik <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 hover:bg-white font-medium"
                  placeholder="halo@catering-in.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={16} className="text-gray-400" /> Alamat Fisik <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all resize-none bg-gray-50 hover:bg-white leading-relaxed"
                  placeholder="Jl. Raya Makanan No. 123..."
                ></textarea>
                <p className="text-[11px] text-gray-400 mt-1.5">Alamat ini akan ditampilkan di halaman kontak dan footer website.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Bar - Sticky */}
        <div className="sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex justify-end items-center mt-8">
          <button 
            type="submit"
            disabled={loading || uploading}
            className="bg-matcha-600 hover:bg-matcha-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl flex items-center gap-3 font-extrabold transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            <Save size={20} />
            {loading ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
