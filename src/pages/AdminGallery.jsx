import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, LayoutGrid } from 'lucide-react';

const inputCls = "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all";
const labelCls = "block text-sm font-bold text-gray-300 mb-1.5";

const AdminGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({ id: null, title: '', image_url: '' });

  useEffect(() => { fetchGalleries(); }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (error) throw error;
      if (data) setGalleries(data);
    } catch (error) {
      alert('Gagal mengambil data galeri: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('catering-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('catering-images').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert('Gagal mengupload foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) { alert('Silakan pilih atau masukkan URL gambar.'); return; }
    try {
      setLoading(true);
      if (formData.id) {
        const { error } = await supabase.from('gallery').update({ title: formData.title, image_url: formData.image_url }).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery').insert([{ title: formData.title, image_url: formData.image_url }]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchGalleries();
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan foto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus foto ini dari galeri?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      fetchGalleries();
    } catch (error) {
      alert('Gagal menghapus foto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (photo) => { setFormData(photo); setIsModalOpen(true); };
  const resetForm = () => setFormData({ id: null, title: '', image_url: '' });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Kelola Galeri Foto</h1>
          <p className="text-gray-500 mt-1 text-sm">Unggah dan atur dokumentasi event untuk halaman publik.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-matcha-600 hover:bg-matcha-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-matcha-900/30 font-bold text-sm"
        >
          <Plus size={18} /> Tambah Foto Baru
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-500" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden min-h-[400px] flex flex-col">
          <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <LayoutGrid size={16} className="text-matcha-400" /> Foto Dokumentasi
            </h2>
            <span className="text-xs font-bold text-matcha-400 bg-matcha-900/40 px-3 py-1 rounded-full border border-matcha-800">
              {galleries.length} Foto
            </span>
          </div>

          <div className="p-5 md:p-6 flex-1 bg-gray-900/30">
            {galleries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 py-16">
                <ImageIcon size={56} className="mb-4 opacity-30" />
                <p className="text-gray-400 text-lg font-bold">Galeri Kosong</p>
                <p className="text-sm mt-2 text-center max-w-sm text-gray-600">Klik "Tambah Foto Baru" untuk mulai mengisi galeri Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleries.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 group hover:border-matcha-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={28} className="text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button onClick={() => openEditModal(item)} className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-500/70 hover:bg-red-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-bold text-gray-300 text-sm text-center truncate">{item.title || 'Tanpa Judul'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-700 flex-shrink-0">
              <div>
                <h2 className="text-lg font-extrabold text-white">{formData.id ? 'Edit Foto' : 'Tambah Foto Baru'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Gunakan gambar resolusi tinggi untuk hasil terbaik.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700">
                <label className={labelCls}>Pilih Foto <span className="text-red-400">*</span></label>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-700 flex items-center justify-center bg-gray-900 group hover:border-matcha-600 transition-colors mb-3">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-600 p-6">
                      <ImageIcon size={36} className="mb-2 opacity-40" />
                      <span className="text-sm font-medium">Belum ada foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                      {uploading ? 'Mengupload...' : 'Pilih File (Upload)'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Atau Paste URL:</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} className={inputCls + " text-sm"} placeholder="https://contoh.com/foto.jpg" />
              </div>

              <div>
                <label className={labelCls}>Judul / Keterangan <span className="text-gray-600 font-normal">(Opsional)</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={inputCls} placeholder="Cth: Dokumentasi Wedding di Hotel X" />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 font-bold hover:bg-gray-700 rounded-xl transition-colors text-sm w-full sm:w-auto">
                  Batal
                </button>
                <button type="submit" disabled={loading || uploading} className="bg-matcha-600 hover:bg-matcha-500 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm w-full sm:w-auto">
                  <Save size={16} />
                  {loading ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
