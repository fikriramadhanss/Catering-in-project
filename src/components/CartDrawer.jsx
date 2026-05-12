import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartTotalItems, cartTotalPrice } = useCart();
  const { settings } = useSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout flow state
  const [step, setStep] = useState('cart'); // 'cart' or 'checkout'
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Transfer Bank',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToCheckout = () => {
    setStep('checkout');
  };

  const handleBackToCart = () => {
    setStep('cart');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    try {
      setIsProcessing(true);
      
      // 1. Simpan ke database Supabase
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_info: `Nama: ${formData.name}, Telp: ${formData.phone}`,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
          items: cart,
          total_price: cartTotalPrice,
          status: 'pending'
        }]);
        
      if (error) throw error;
      
      // 2. Format pesan WhatsApp
      const phoneNumber = settings.whatsapp_number || "6281234567890";
      const businessName = settings.business_name || "Catering-in";
      
      let message = `Halo ${businessName}, saya ingin memesan catering.\n\n`;
      message += `*DATA PEMESAN*\n`;
      message += `Nama: ${formData.name}\n`;
      message += `No. HP: ${formData.phone}\n`;
      message += `Alamat: ${formData.address}\n`;
      message += `Pembayaran: ${formData.paymentMethod}\n`;
      if (formData.notes) message += `Catatan: ${formData.notes}\n`;
      
      message += `\n*DETAIL PESANAN*\n`;
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.quantity}x ${item.title}`;
        if (item.numeric_price > 0) {
          message += ` (Rp ${(item.numeric_price * item.quantity).toLocaleString('id-ID')})`;
        } else {
          message += ` (${item.price})`;
        }
        message += '\n';
      });
      
      if (cartTotalPrice > 0) {
        message += `\n*Estimasi Total: Rp ${cartTotalPrice.toLocaleString('id-ID')}*`;
      }
      
      message += `\n\nMohon informasi ketersediaan dan instruksi pembayaran. Terima kasih.`;
      
      const encodedMessage = encodeURIComponent(message);
      const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // 3. Buka tab WA
      window.open(waLink, '_blank');
      
      // 4. Bersihkan state
      clearCart();
      setFormData({ name: '', phone: '', address: '', paymentMethod: 'Transfer Bank', notes: '' });
      setStep('cart');
      setIsCartOpen(false);
      
    } catch (err) {
      console.error('Error during checkout:', err.message);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Prevent scroll when drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset step if closed
      setTimeout(() => setStep('cart'), 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === 'checkout' ? (
              <button 
                onClick={handleBackToCart}
                className="text-gray-500 hover:text-matcha-600 transition-colors p-1 -ml-1"
              >
                <ArrowLeft size={24} />
              </button>
            ) : (
              <ShoppingBag className="text-matcha-600" size={24} />
            )}
            <h2 className="text-xl font-bold text-dark">
              {step === 'checkout' ? 'Detail Pengiriman' : 'Keranjang Pesanan'}
            </h2>
            {step === 'cart' && (
              <span className="bg-matcha-100 text-matcha-800 text-xs font-bold px-2 py-1 rounded-full">
                {cartTotalItems}
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {step === 'cart' ? (
            // CART VIEW
            cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <ShoppingBag size={64} className="text-gray-300" />
                <p>Keranjang pesanan masih kosong</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2 bg-matcha-50 text-matcha-700 rounded-lg font-medium hover:bg-matcha-100 transition-colors"
                >
                  Lihat Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={item.image_url || 'https://via.placeholder.com/150'} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-dark leading-tight">{item.title}</h4>
                        <p className="text-sm text-matcha-600 font-medium mt-1">
                          {item.numeric_price > 0 
                            ? `Rp ${item.numeric_price.toLocaleString('id-ID')}` 
                            : item.price}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-matcha-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-matcha-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // CHECKOUT FORM VIEW
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all"
                  placeholder="Cth: 081234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengiriman *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all resize-none"
                  placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Patokan)"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran *</label>
                <select 
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all bg-white"
                >
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Bayar di Tempat (COD)">Bayar di Tempat (COD)</option>
                  <option value="Bayar DP 50%">Bayar DP 50%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-matcha-500 focus:border-matcha-500 outline-none transition-all resize-none"
                  placeholder="Cth: Tolong jangan terlalu pedas"
                ></textarea>
              </div>
            </form>
          )}
        </div>

        {/* Footer / Actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {cartTotalPrice > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Estimasi Total</span>
                <span className="text-2xl font-bold text-dark">Rp {cartTotalPrice.toLocaleString('id-ID')}</span>
              </div>
            )}
            
            {step === 'cart' ? (
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-matcha-600 hover:bg-matcha-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition-all hover:shadow-lg"
              >
                Lanjut Checkout
              </button>
            ) : (
              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-matcha-600 hover:bg-matcha-700 disabled:bg-matcha-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition-all hover:shadow-lg"
              >
                {isProcessing ? 'Memproses Pesanan...' : 'Kirim Pesanan ke WhatsApp'}
              </button>
            )}
            
            {step === 'cart' && (
              <p className="text-xs text-center text-gray-500 mt-4">
                Anda akan diminta mengisi data diri pada langkah selanjutnya.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
