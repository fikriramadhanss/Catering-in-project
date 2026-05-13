import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Utensils } from 'lucide-react';

// Reusable dark input class
const inputCls = "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all";
const labelCls = "block text-sm font-bold text-gray-300 mb-1.5";

const AdminMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    id: null, title: '', price: '', numeric_price: 0, description: '', image_url: ''
  });

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      const { data, error } = await supabase.from('menus').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data) setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error.message);
      alert('Gagal mengambil data menu: ' + error.message);
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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `menus/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('catering-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('catering-images').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      alert('Gagal mengupload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: formData.title,
        price: formData.price,
        numeric_price: parseInt(formData.numeric_price) || 0,
        description: formData.description,
        image_url: formData.image_url
      };
      if (formData.id) {
        const { error } = await supabase.from('menus').update(payload).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menus').insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchMenus();
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus menu ini?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('menus').delete().eq('id', id);
      if (error) throw error;
      fetchMenus();
    } catch (error) {
      alert('Gagal menghapus menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (menu) => { setFormData(menu); setIsModalOpen(true); };
  const resetForm = () => setFormData({ id: null, title: '', price: '', numeric_price: 0, description: '', image_url: '' });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Kelola Menu & Paket</h1>
          <p className="text-gray-500 mt-1 text-sm">Tambah, edit, atau hapus pilihan menu di website publik.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-matcha-600 hover:bg-matcha-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-matcha-900/30 font-bold text-sm"
        >
          <Plus size={18} /> Tambah Menu Baru
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-500" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Utensils size={16} className="text-matcha-400" /> Daftar Menu Aktif
            </h2>
            <span className="text-xs font-bold text-matcha-400 bg-matcha-900/40 px-3 py-1 rounded-full border border-matcha-800">
              {menus.length} Menu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700 bg-gray-900/40">
                  <th className="px-5 py-3.5">Preview</th>
                  <th className="px-5 py-3.5">Nama Paket / Item</th>
                  <th className="px-5 py-3.5">Harga</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Deskripsi</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {menus.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-600">
                        <Utensils size={40} className="opacity-30" />
                        <p className="text-gray-400 font-semibold">Belum Ada Menu</p>
                        <p className="text-xs">Klik "Tambah Menu Baru" untuk memulai.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  menus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-700/30 transition-colors group">
                      <td className="px-5 py-4 w-20">
                        <div className="w-14 h-14 rounded-xl bg-gray-700 overflow-hidden border border-gray-600 flex-shrink-0">
                          {menu.image_url ? (
                            <img src={menu.image_url} alt={menu.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-100">{menu.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-matcha-400 bg-matcha-900/30 px-3 py-1 rounded-lg text-sm">{menu.price}</span>
                        {menu.numeric_price > 0 && (
                          <p className="text-xs text-gray-600 mt-1 font-mono">{menu.numeric_price.toLocaleString('id-ID')}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell max-w-xs">
                        <p className="line-clamp-2 leading-relaxed">{menu.description || '-'}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(menu)} className="p-2.5 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(menu.id)} className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                <h2 className="text-lg font-extrabold text-white">{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Lengkapi informasi menu di bawah ini.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className={labelCls}>Nama Paket / Menu <span className="text-red-400">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={inputCls} placeholder="Cth: Paket Wedding Premium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Teks Harga <span className="text-red-400">*</span></label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} required className={inputCls} placeholder="Rp 75.000/pax" />
                  <p className="text-[10px] text-gray-600 mt-1">Hanya tampilan visual</p>
                </div>
                <div>
                  <label className={labelCls}>Nilai Harga <span className="text-red-400">*</span></label>
                  <input type="number" name="numeric_price" value={formData.numeric_price} onChange={handleInputChange} required className={`${inputCls} font-mono`} placeholder="75000" />
                  <p className="text-[10px] text-gray-600 mt-1">Angka saja</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>Deskripsi Singkat</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className={`${inputCls} resize-none`} placeholder="Pilihan elegan untuk hari spesial Anda..." />
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700">
                <label className="block text-sm font-bold text-gray-300 mb-3">Foto Menu</label>
                {formData.image_url && (
                  <div className="mb-3 w-full h-36 rounded-xl overflow-hidden border border-gray-700">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="cursor-pointer bg-gray-700 border border-gray-600 hover:border-matcha-500 hover:text-matcha-400 text-gray-300 px-4 py-2 rounded-xl text-sm font-bold transition-all w-full sm:w-auto text-center">
                    {uploading ? 'Mengupload...' : 'Pilih File Gambar'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                  <span className="text-xs text-gray-600 font-medium">ATAU PASTE URL:</span>
                </div>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} className={`${inputCls} mt-3 text-sm`} placeholder="https://contoh.com/gambar.jpg" />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-400 font-bold hover:bg-gray-700 rounded-xl transition-colors text-sm w-full sm:w-auto">
                  Batal
                </button>
                <button type="submit" disabled={loading || uploading} className="bg-matcha-600 hover:bg-matcha-500 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm w-full sm:w-auto">
                  <Save size={16} />
                  {loading ? 'Menyimpan...' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
