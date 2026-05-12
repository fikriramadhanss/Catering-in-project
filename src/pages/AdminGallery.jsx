import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, LayoutGrid } from 'lucide-react';

const AdminGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    image_url: ''
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setGalleries(data);
    } catch (error) {
      console.error('Error fetching gallery:', error.message);
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

      const { error: uploadError } = await supabase.storage
        .from('catering-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('catering-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Gagal mengupload foto: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Silakan pilih file gambar atau masukkan URL gambar terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            image_url: formData.image_url
          })
          .eq('id', formData.id);
          
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('gallery')
          .insert([{
            title: formData.title,
            image_url: formData.image_url
          }]);
          
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchGalleries();
      resetForm();
    } catch (error) {
      console.error('Error saving photo:', error.message);
      alert('Gagal menyimpan foto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus foto ini dari galeri?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting photo:', error.message);
      alert('Gagal menghapus foto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (photo) => {
    setFormData(photo);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', image_url: '' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Galeri Foto</h1>
          <p className="text-gray-500 mt-2">Unggah dan atur dokumentasi event yang akan tampil di halaman publik.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-matcha-600 hover:bg-matcha-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg font-bold"
        >
          <Plus size={20} />
          Tambah Foto Baru
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <LayoutGrid size={20} className="text-matcha-600" /> Foto Dokumentasi
            </h2>
            <span className="text-sm font-medium text-matcha-700 bg-matcha-50 px-3 py-1 rounded-full border border-matcha-100">
              Total {galleries.length} Foto
            </span>
          </div>
          
          <div className="p-6 md:p-8 flex-1 bg-gray-50/30">
            {galleries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <ImageIcon size={64} className="mb-4 opacity-50 text-gray-300" />
                <p className="text-xl font-bold text-gray-600">Galeri Kosong</p>
                <p className="text-sm mt-2 text-center max-w-sm">Belum ada foto yang diunggah ke galeri. Klik tombol "Tambah Foto Baru" untuk memulai mendokumentasikan karya Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleries.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-300" />
                        </div>
                      )}
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                          title="Edit Foto"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                          title="Hapus Foto"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-800 text-center truncate">{item.title || 'Tanpa Judul'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 transform transition-all flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  {formData.id ? 'Edit Foto' : 'Tambah Foto Baru'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Gunakan gambar resolusi tinggi untuk hasil terbaik.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
              
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Foto <span className="text-red-500">*</span></label>
                
                <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-300 shadow-inner flex items-center justify-center bg-white group hover:border-matcha-400 transition-colors">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-6">
                      <ImageIcon size={40} className="mb-2 opacity-50" />
                      <span className="text-sm font-medium">Belum ada foto</span>
                    </div>
                  )}
                  
                  {/* File Upload Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <label className="cursor-pointer bg-white text-gray-800 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                      {uploading ? 'Mengupload...' : 'Pilih File (Upload)'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">ATAU PASTE URL GAMBAR:</label>
                  <input 
                    type="text" 
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all text-sm bg-white"
                    placeholder="https://contoh.com/foto-wedding.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul / Deskripsi Singkat <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 hover:bg-white"
                  placeholder="Cth: Dokumentasi Wedding di Hotel X"
                />
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors w-full sm:w-auto text-center"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-matcha-600 hover:bg-matcha-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  <Save size={20} />
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
