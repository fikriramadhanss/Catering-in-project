import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Image as ImageIcon, Briefcase, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const inputCls = "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all";
const labelCls = "block text-sm font-bold text-gray-300 mb-1.5";
const hintCls = "text-[11px] text-gray-600 mt-1.5";

const AdminSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '', whatsapp_number: '', email: '', address: '', logo_url: ''
  });

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
      const { error: uploadError } = await supabase.storage.from('catering-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('catering-images').getPublicUrl(filePath);
      setFormData({ ...formData, logo_url: data.publicUrl });
    } catch (error) {
      alert('Gagal mengupload logo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.from('settings').update({
        business_name: formData.business_name,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        address: formData.address,
        logo_url: formData.logo_url,
        updated_at: new Date()
      }).eq('id', 1);
      if (error) throw error;
      await refreshSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-2">
        <Icon size={16} className="text-matcha-400" />
        <h3 className="text-sm font-extrabold text-white">{title}</h3>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Pengaturan Usaha</h1>
        <p className="text-gray-500 mt-1 text-sm">Atur identitas merek, logo, dan informasi kontak publik Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section 1: Profil & Logo */}
        <SectionCard icon={Briefcase} title="Profil & Logo">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Upload */}
            <div className="md:col-span-1 flex flex-col items-center">
              <label className={labelCls + " text-center w-full"}>Logo Usaha</label>
              <div className="relative w-full max-w-[160px] aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-600 bg-gray-900 flex items-center justify-center hover:border-matcha-500 transition-colors group cursor-pointer">
                {formData.logo_url ? (
                  <>
                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                        Ganti
                        <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer text-center text-gray-600 p-6 w-full h-full flex flex-col items-center justify-center hover:text-matcha-400 transition-colors">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                    <span className="text-xs font-medium">{uploading ? 'Mengupload...' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                  </label>
                )}
              </div>
              {formData.logo_url && (
                <button type="button" onClick={() => setFormData({ ...formData, logo_url: '' })} className="mt-2 text-red-400 hover:text-red-300 text-xs font-bold transition-colors">
                  Hapus Logo
                </button>
              )}
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className={labelCls}>Nama Usaha / Merek <span className="text-red-400">*</span></label>
                <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} required className={inputCls} placeholder="Cth: Catering-in" />
                <p className={hintCls}>Tampil di Navbar jika tidak ada logo gambar.</p>
              </div>
              <div>
                <label className={labelCls}>URL Logo <span className="text-gray-600 font-normal">(Opsional)</span></label>
                <input type="text" name="logo_url" value={formData.logo_url} onChange={handleInputChange} className={`${inputCls} text-sm`} placeholder="Atau paste link gambar (https://...)" />
                <p className={hintCls}>Gunakan ini jika Anda upload logo ke layanan pihak ketiga.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 2: Kontak Publik */}
        <SectionCard icon={Phone} title="Informasi Kontak Publik">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-500" /> WhatsApp Pemesanan <span className="text-red-400">*</span></span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 font-bold text-gray-500 text-sm">+</span>
                <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleInputChange} required className={`${inputCls} pl-8`} placeholder="6281234567890" />
              </div>
              <p className={hintCls}>Gunakan kode negara (62) tanpa angka 0 di depan.</p>
            </div>

            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-500" /> Email Publik <span className="text-red-400">*</span></span>
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputCls} placeholder="halo@catering-in.com" />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-500" /> Alamat Fisik <span className="text-red-400">*</span></span>
              </label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3" className={`${inputCls} resize-none`} placeholder="Jl. Raya Makanan No. 123..." />
              <p className={hintCls}>Ditampilkan di halaman kontak dan footer website.</p>
            </div>
          </div>
        </SectionCard>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-5 bg-gray-800/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 flex items-center justify-between gap-4">
          {saved ? (
            <p className="text-matcha-400 text-sm font-bold flex items-center gap-2">
              ✓ Pengaturan berhasil disimpan!
            </p>
          ) : (
            <p className="text-gray-500 text-sm">Pastikan semua informasi sudah benar sebelum menyimpan.</p>
          )}
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-matcha-600 hover:bg-matcha-500 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg text-sm flex-shrink-0"
          >
            <Save size={16} />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
