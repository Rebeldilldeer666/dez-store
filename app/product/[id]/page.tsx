'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number | null;
  priceId?: string;
  description?: string;
  images?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Since we don't have individual product API, we'll fetch all products and find the one we need
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const products = await response.json();
        
        // Find the product with the matching ID
        const foundProduct = products.find((p: any) => 
          p.id === id || p.priceId?.includes(id as string)
        );

        if (foundProduct) {
          const formattedProduct = {
            id: foundProduct.id || foundProduct.priceId?.split('_')[1],
            name: foundProduct.name,
            price: foundProduct.price !== undefined ? foundProduct.price / 100 : null, // Convert cents to dollars
            priceId: foundProduct.priceId,
            description: foundProduct.description || 'No description available',
            images: foundProduct.images || []
          };
          setProduct(formattedProduct);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    alert(`${product?.name} added to cart!`);
    // In a real app, you would dispatch an action to update the cart state
  };

  const handleCheckout = async () => {
    if (!product?.priceId) {
      alert('Cannot checkout: price information not available');
      return;
    }

    try {
      const response = await fetch('/api/checkout/printify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.name,
          price: product.price ? product.price * 100 : 0, // Convert back to cents
          image: product.images?.[0],
          variantId: product.id,
          productId: product.id
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert('Error initiating checkout: ' + data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error initiating checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-96 bg-gray-200 w-full" />
            <div className="p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="h-10 bg-blue-400 rounded w-40 mb-4"></div>
              <div className="h-12 bg-green-500 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error || 'Product not found'}</p>
          <Link 
            href="/products"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Products
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-contain max-h-96"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/600x600?text=${encodeURIComponent(product.name.substring(0, 20))}`;
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-4/5 h-4/5 flex items-center justify-center text-gray-500">
                    {product.name.substring(0, 20)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {product.price !== null ? `$${product.price.toFixed(2)}` : 'Price not available'}
              </div>
              
              <p className="text-gray-600 mb-6">
                {product.description || 'No description available for this product.'}
              </p>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 border-t border-b text-center"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
                
                <button
                  onClick={handleCheckout}
                  className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}