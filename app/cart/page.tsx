'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // In a real app, you would get this from state management or localStorage
    // For now, we'll simulate with mock data
    const mockItems: CartItem[] = [
      {
        id: '1',
        name: 'Sample Product 1',
        price: 29.99,
        quantity: 1,
        image: 'https://placehold.co/100x100?text=Product+1'
      },
      {
        id: '2',
        name: 'Sample Product 2',
        price: 49.99,
        quantity: 2,
        image: 'https://placehold.co/100x100?text=Product+2'
      }
    ];
    
    setCartItems(mockItems);
    calculateTotal(mockItems);
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const removeFromCart = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link 
              href="/products"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <img 
                      src={item.image || `https://placehold.co/100x100?text=${encodeURIComponent(item.name.substring(0, 10))}`} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain bg-gray-100 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/100x100?text=${encodeURIComponent(item.name.substring(0, 10))}`;
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex items-center">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="ml-6 font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-6 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Link 
                  href="/products"
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition text-center"
                >
                  Continue Shopping
                </Link>
                
                <Link 
                  href="/checkout"
                  className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition text-center flex-1"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}