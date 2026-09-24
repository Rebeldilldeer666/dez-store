import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
            You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-800 mb-2">Order Summary</h2>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">$114.37</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Processing</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition text-center"
            >
              Continue Shopping
            </Link>
            
            <Link 
              href="/orders"
              className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition text-center"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}