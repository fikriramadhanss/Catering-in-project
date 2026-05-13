import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, MessageSquare, Star } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setReviews(data);
    } catch (error) {
      alert('Gagal mengambil data ulasan. Pastikan tabel reviews sudah dibuat.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus ulasan ini?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      fetchReviews();
    } catch (error) {
      alert('Gagal menghapus ulasan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Kelola Testimoni</h1>
          <p className="text-gray-500 mt-1 text-sm">Pantau dan kelola ulasan yang masuk dari pelanggan.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-500" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-matcha-400" /> Daftar Ulasan
            </h2>
            <span className="text-xs font-bold text-matcha-400 bg-matcha-900/40 px-3 py-1 rounded-full border border-matcha-800">
              {reviews.length} Ulasan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700 bg-gray-900/40">
                  <th className="px-5 py-3.5">Pengulas</th>
                  <th className="px-5 py-3.5">Rating & Ulasan</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-600">
                        <MessageSquare size={40} className="opacity-30" />
                        <p className="text-gray-400 font-semibold">Belum Ada Ulasan</p>
                        <p className="text-xs">Ulasan dari pelanggan akan muncul di sini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-700/30 transition-colors group">
                      <td className="px-5 py-4 w-52">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-matcha-900/50 border border-matcha-800 rounded-xl flex items-center justify-center text-matcha-400 font-bold text-sm flex-shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-100 text-sm">{review.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{review.role || 'Pelanggan'}</p>
                            <p className="text-[10px] text-gray-600 mt-1">
                              {new Date(review.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex text-yellow-500 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < (review.rating || 5) ? "currentColor" : "none"} className={i < (review.rating || 5) ? "" : "text-gray-600"} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed italic line-clamp-3">
                            "{review.text}"
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right align-middle">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus Ulasan"
                        >
                          <Trash2 size={16} />
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
