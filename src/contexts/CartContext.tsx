'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  brand: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart from Supabase or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Load from Supabase
          const { data: cartData, error } = await supabase
            .from('cart_items')
            .select(`
              product_id,
              quantity,
              products (
                id,
                brand,
                name,
                price,
                image,
                category
              )
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading cart:', error);
            // Fallback to localStorage
            const savedCart = localStorage.getItem('luxeGlowCart');
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            }
          } else if (cartData) {
            const items: CartItem[] = cartData
              .filter(item => item.products)
              .map((item: any) => ({
                id: item.products.id,
                brand: item.products.brand,
                name: item.products.name,
                price: item.products.price,
                image: item.products.image,
                category: item.products.category,
                quantity: item.quantity,
              }));
            setCartItems(items);
          }
        } else {
          // Load from localStorage for non-authenticated users
          const savedCart = localStorage.getItem('luxeGlowCart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('luxeGlowCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Sync to Supabase when user is authenticated and cart changes
  useEffect(() => {
    if (!user || isLoading) return;

    const syncCartToSupabase = async () => {
      try {
        // Delete all existing cart items for user
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        // Insert all current cart items
        if (cartItems.length > 0) {
          const cartItemsToInsert = cartItems.map(item => ({
            user_id: user.id,
            product_id: item.id,
            quantity: item.quantity,
          }));

          const { error } = await supabase
            .from('cart_items')
            .insert(cartItemsToInsert);

          if (error) {
            console.error('Error syncing cart to Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    };

    // Debounce the sync
    const timeoutId = setTimeout(() => {
      syncCartToSupabase();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cartItems, user, isLoading]);

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem('luxeGlowCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // If user is authenticated, sync immediately
    if (user) {
      try {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
          await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('user_id', user.id)
            .eq('product_id', product.id);
        } else {
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: 1,
            });
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const removeFromCart = async (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('£', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
