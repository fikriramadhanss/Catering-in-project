import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, MessageSquare, Star } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      alert('Gagal mengambil data ulasan. Pastikan tabel reviews sudah dibuat.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error.message);
      alert('Gagal menghapus ulasan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Testimoni</h1>
          <p className="text-gray-500 mt-2">Pantau dan kelola ulasan yang masuk dari pelanggan.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <MessageSquare size={20} className="text-matcha-600" /> Daftar Ulasan
            </h2>
            <span className="text-sm font-medium text-matcha-700 bg-matcha-50 px-3 py-1 rounded-full border border-matcha-100">
              Total {reviews.length} Ulasan
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5 font-semibold">Pengulas</th>
                  <th className="p-5 font-semibold">Rating & Ulasan</th>
                  <th className="p-5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium text-gray-600">Belum Ada Ulasan</p>
                        <p className="text-sm mt-1">Ulasan dari pelanggan akan muncul di sini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-5 w-48">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-matcha-100 rounded-full flex items-center justify-center text-matcha-700 font-bold flex-shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{review.name}</span>
                            <span className="text-xs text-gray-500 mt-0.5">{review.role || 'Pelanggan'}</span>
                            <span className="text-[10px] text-gray-400 mt-1">
                              {new Date(review.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                fill={i < (review.rating || 5) ? "currentColor" : "none"} 
                                className={i < (review.rating || 5) ? "" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-3">
                            "{review.text}"
                          </p>
                        </div>
                      </td>
                      <td className="p-5 text-right align-middle">
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm inline-flex opacity-0 group-hover:opacity-100"
                          title="Hapus Ulasan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
