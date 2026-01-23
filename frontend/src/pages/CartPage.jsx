import { Plus, Minus, ShoppingBag, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartBoxPreview3D from '../components/CartBoxPreview3D';

export default function CartPage() {
  const { cartItems, hampers, removeFromCart, removeHamperFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart? This will remove all items and hampers.')) {
      clearCart();
    }
  };

  // Helper function to check if item is a Hamper Box
  const isHamperBox = (item) => {
    return item.name?.toLowerCase().includes('hamper box') ||
           item.productType === 'HAMPER_BOX';
  };

  // Helper function to get box dimensions
  const getBoxDimensions = (item) => {
    if (item.customization?.dimensions) {
      return item.customization.dimensions;
    }
    return {
      widthCm: item.widthCm || 0,
      heightCm: item.heightCm || 0,
      depthCm: item.depthCm || 0
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 py-6 sm:py-8 lg:py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 sm:p-3 rounded-xl bg-white hover:bg-neutral-100 transition-colors shadow-md"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">
                    My Cart
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-600">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Empty Cart Button - Only show when cart has items */}
          {(cartItems.length > 0 || hampers.length > 0) && (
            <button
              onClick={handleEmptyCart}
              className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-98 border border-red-200"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Empty Cart
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && hampers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="bg-neutral-100 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Your cart is empty</h3>
            <p className="text-sm sm:text-base text-neutral-600 mb-8">Add some amazing products to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Regular Cart Items */}
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {isHamperBox(item) ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                          <CartBoxPreview3D dimensions={getBoxDimensions(item)} />
                        </div>
                      ) : (
                        <img
                          src={item.imageUrl || item.image || item.images?.[0] || '/placeholder.png'}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-neutral-900 text-sm sm:text-base line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>

                      {/* Customization Details - Show FIRST for clarity */}
                      {item.customization && typeof item.customization === 'object' && item.customization.selectedOptions && (
                        <div className="text-xs sm:text-sm mb-3 bg-primary-50 p-2 sm:p-3 rounded-lg border border-primary-200">
                          {Object.entries(item.customization.selectedOptions).map(([key, value]) => (
                            <p key={key} className="text-neutral-800 font-bold">
                              ✓ {value}
                            </p>
                          ))}
                          {item.customization.uploadedImages && Object.keys(item.customization.uploadedImages).length > 0 && (
                            <p className="text-neutral-700 mt-1">
                              <span className="font-medium">Photo:</span> Uploaded ✓
                            </p>
                          )}
                        </div>
                      )}

                      {/* Price Display - Show total price clearly */}
                      <p className="text-lg sm:text-xl font-bold text-primary-600 mb-3">
                        {item.customization && typeof item.customization === 'object' && item.customization.totalPrice ? (
                          <>₹{parseFloat(item.customization.totalPrice).toFixed(2)}</>
                        ) : (
                          <>₹{item.price?.toFixed(2) || '0.00'}</>
                        )}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4 text-neutral-700" />
                        </button>
                        <span className="font-semibold text-neutral-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4 text-neutral-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hampers */}
              {hampers.map((hamper) => (
                <div key={hamper.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-purple-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 sm:p-3 rounded-xl">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                          Custom Hamper
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600">
                          {hamper.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeHamperFromCart(hamper.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Hamper Items */}
                  <div className="space-y-2 mb-4">
                    {hamper.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/60 rounded-lg p-2">
                        <img
                          src={item.imageUrl || item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                    <span className="text-sm font-semibold text-neutral-700">Hamper Total:</span>
                    <span className="text-lg font-bold text-purple-600">
                      ₹{hamper.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Column (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-neutral-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-neutral-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Build Your Own Hamper Button - Only show if cart has items that are NOT just hamper boxes */}
                  {(() => {
                    const hasOnlyHamperBoxes = cartItems.length > 0 &&
                      cartItems.every(item => item.name && item.name.toLowerCase().includes('hamper box'));

                    if (!hasOnlyHamperBoxes && cartItems.length > 0) {
                      return (
                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            navigate('/hamper-builder');
                          }}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <Sparkles className="h-5 w-5" />
                          <span>Build Your Own Hamper</span>
                        </button>
                      );
                    }
                    return null;
                  })()}

                  {/* Proceed to Checkout Button */}
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      navigate('/checkout');
                    }}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 border-2 border-neutral-200 hover:border-neutral-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

