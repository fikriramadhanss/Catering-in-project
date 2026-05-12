import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('catering_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data');
      }
    }
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('catering_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (menu, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menu.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === menu.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { ...menu, quantity }];
      }
    });
    // setIsCartOpen(true); // Dihapus agar tidak otomatis terbuka, diganti animasi toast
  };

  const removeFromCart = (menuId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== menuId));
  };

  const updateQuantity = (menuId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === menuId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cart.reduce((total, item) => total + ((item.numeric_price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotalItems,
      cartTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
