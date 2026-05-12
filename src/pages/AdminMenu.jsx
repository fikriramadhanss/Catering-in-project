import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Utensils } from 'lucide-react';

const AdminMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    price: '',
    numeric_price: 0,
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('id', { ascending: true });

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
      alert('Gagal mengupload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('menus')
          .update({
            title: formData.title,
            price: formData.price,
            numeric_price: parseInt(formData.numeric_price) || 0,
            description: formData.description,
            image_url: formData.image_url
          })
          .eq('id', formData.id);
          
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('menus')
          .insert([{
            title: formData.title,
            price: formData.price,
            numeric_price: parseInt(formData.numeric_price) || 0,
            description: formData.description,
            image_url: formData.image_url
          }]);
          
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchMenus();
      resetForm();
    } catch (error) {
      console.error('Error saving menu:', error.message);
      alert('Gagal menyimpan menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchMenus();
    } catch (error) {
      console.error('Error deleting menu:', error.message);
      alert('Gagal menghapus menu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (menu) => {
    setFormData(menu);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', price: '', numeric_price: 0, description: '', image_url: '' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Menu & Paket</h1>
          <p className="text-gray-500 mt-2">Tambah, edit, atau hapus pilihan menu yang tampil di website publik Anda.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-matcha-600 hover:bg-matcha-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg font-bold"
        >
          <Plus size={20} />
          Tambah Menu Baru
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <Utensils size={20} className="text-matcha-600" /> Daftar Menu Aktif
            </h2>
            <span className="text-sm font-medium text-matcha-700 bg-matcha-50 px-3 py-1 rounded-full border border-matcha-100">
              Total {menus.length} Menu
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-semibold">Preview</th>
                  <th className="p-5 font-semibold">Nama Paket / Item</th>
                  <th className="p-5 font-semibold">Harga</th>
                  <th className="p-5 font-semibold hidden md:table-cell">Deskripsi Singkat</th>
                  <th className="p-5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {menus.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Utensils size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-gray-600">Belum Ada Menu</p>
                        <p className="text-sm mt-1">Silakan klik "Tambah Menu Baru" untuk memulai.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  menus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-5 w-24">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shadow-sm border border-gray-200/50 flex-shrink-0">
                          {menu.image_url ? (
                            <img src={menu.image_url} alt={menu.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-gray-800">{menu.title}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-extrabold text-matcha-600 bg-matcha-50 inline-block px-3 py-1 rounded-lg">
                          {menu.price}
                        </div>
                        {menu.numeric_price > 0 && (
                          <div className="text-xs text-gray-400 mt-1 font-mono">Nilai: {menu.numeric_price}</div>
                        )}
                      </td>
                      <td className="p-5 text-sm text-gray-500 hidden md:table-cell max-w-xs">
                        <div className="line-clamp-2 leading-relaxed">{menu.description || '-'}</div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(menu)}
                            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(menu.id)}
                            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
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
                  {formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Lengkapi informasi menu di bawah ini.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Paket / Menu <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                  placeholder="Cth: Paket Wedding Premium"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Teks Harga <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50/50 hover:bg-white"
                    placeholder="Cth: Rp 75.000/pax"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Hanya tampilan visual</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nilai Harga <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="numeric_price"
                    value={formData.numeric_price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50/50 hover:bg-white font-mono"
                    placeholder="Cth: 75000"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Hanya angka (tanpa titik)</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi Singkat</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all resize-none bg-gray-50/50 hover:bg-white leading-relaxed"
                  placeholder="Cth: Pilihan elegan untuk hari spesial Anda..."
                ></textarea>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-3">Foto Menu</label>
                
                {formData.image_url && (
                  <div className="mb-4 relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="cursor-pointer bg-white border border-gray-200 hover:border-matcha-500 hover:text-matcha-600 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm w-full sm:w-auto text-center">
                    {uploading ? 'Mengupload...' : 'Pilih File Gambar'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploading}
                      className="hidden" 
                    />
                  </label>
                  <span className="text-xs text-gray-400 font-medium">ATAU PASTE URL:</span>
                </div>
                
                <input 
                  type="text" 
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all text-sm bg-white"
                  placeholder="https://contoh.com/gambar.jpg"
                />
              </div>
              
              <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
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
