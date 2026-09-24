// app/api/cart/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated cart data - in a real app this would come from a database or session
  const cartItems = [
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

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return NextResponse.json({
    items: cartItems,
    total,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  });
}

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json();
    
    // In a real app, you would add the product to the cart in a database or session
    // For this demo, we'll just return a success message
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product added to cart',
      productId,
      quantity
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to add product to cart' 
    }, { status: 500 });
  }
}