import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Mode register sementara

  const { login, register, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Jika sudah login, langsung lempar ke dashboard
  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password);
        alert('Akun berhasil dibuat! Silakan cek email Anda untuk konfirmasi (jika fitur email konfirmasi aktif di Supabase), atau Anda sudah bisa langsung login.');
        setIsRegistering(false); // Balik ke mode login
      } else {
        await login(email, password);
        // Navigate akan ditangani oleh useEffect jika login berhasil dan mengubah session
      }
    } catch (error) {
      console.error('Auth error:', error.message);
      setErrorMsg(
        error.message === 'Invalid login credentials' 
          ? 'Email atau password salah.' 
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Helmet>
        <title>{isRegistering ? 'Register Admin' : 'Login Admin'} | Catering-in</title>
      </Helmet>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-matcha-700 to-matcha-900 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-lg">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Workspace</h1>
            <p className="text-matcha-100 text-sm mt-2 opacity-90">
              {isRegistering ? 'Buat kredensial akses panel kontrol.' : 'Silakan masuk untuk mengelola sistem.'}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <Mail size={20} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                  placeholder="admin@catering-in.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <Lock size={20} />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-matcha-600 hover:bg-matcha-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-md hover:shadow-lg mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegistering ? 'Buat Akun' : 'Masuk ke Dashboard'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register (Temporary for initial setup) */}
          <div className="mt-8 text-center text-sm text-gray-500">
            {isRegistering ? (
              <p>
                Sudah punya akun?{' '}
                <button onClick={() => setIsRegistering(false)} className="text-matcha-600 font-bold hover:underline">
                  Login di sini
                </button>
              </p>
            ) : (
              <p>
                Belum mendaftar sebagai Admin?{' '}
                <button onClick={() => setIsRegistering(true)} className="text-matcha-600 font-bold hover:underline">
                  Buat akun sekarang
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
