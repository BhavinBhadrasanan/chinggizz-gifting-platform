import { useState, useRef, useEffect } from 'react';
import { Plus, Minus, ShoppingBag, Trash2, Sparkles, ArrowLeft, Package, Gift, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

export default function CartPage() {
  const { cartItems, hampers, removeFromCart, removeHamperFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const cartItemsRef = useRef(null);

  // Scroll to top when navigating from customization page (especially for mobile view)
  useEffect(() => {
    // Check if we should scroll to top (e.g., after adding to cart from customization page)
    if (location.state?.scrollToCart) {
      // Check if mobile view (screen width < 768px)
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // For mobile: Force scroll to top immediately
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Also scroll to top after a short delay to ensure content is rendered
        const scrollTimer = setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);

        return () => clearTimeout(scrollTimer);
      } else {
        // For desktop: Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location.state]);

  const handleEmptyCart = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmEmptyCart = () => {
    clearCart();
    setIsConfirmModalOpen(false);
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
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 sm:p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-700 bg-clip-text text-transparent">
                    My Cart
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-600">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
            </div>

            {/* Empty Cart Button - Clear and Visible */}
            {(cartItems.length > 0 || hampers.length > 0) && (
              <button
                onClick={handleEmptyCart}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border-2 border-red-200 hover:border-red-300 group"
                title="Empty Cart"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
                <span className="hidden sm:inline font-semibold text-sm">Empty Cart</span>
                <span className="sm:hidden font-semibold text-xs">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && hampers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <ShoppingBag className="h-14 w-14 sm:h-18 sm:w-18 text-primary-600" />
              </div>
              {/* Floating Icons */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 animate-bounce">
                <Gift className="h-6 w-6 text-secondary-500" />
              </div>
              <div className="absolute bottom-0 left-1/4 animate-pulse">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div className="absolute bottom-0 right-1/4 animate-pulse delay-75">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>

            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-4">
              Your Cart is Empty!
            </h3>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-600 mb-3 max-w-md mx-auto">
              Looks like you haven't added anything yet.
            </p>
            <p className="text-sm sm:text-base text-neutral-500 mb-8 max-w-md mx-auto">
              Explore our collection of personalized gifts, custom hampers, and unique products to make someone's day special! ✨
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl">
                <Gift className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">Personalized Gifts</p>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl">
                <Sparkles className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">Custom Hampers</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">Made with Love</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </button>
              <button
                onClick={() => navigate('/hamper-builder')}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Build Hamper
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Left Column */}
            <div ref={cartItemsRef} className="lg:col-span-2 space-y-4">
              {/* Regular Cart Items */}
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {isHamperBox(item) ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                          <Package className="h-10 w-10 text-primary-600" />
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
                          onClick={() => removeFromCart(item.id, item.customization)}
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
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customization)}
                          className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4 text-neutral-700" />
                        </button>
                        <span className="font-semibold text-neutral-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.customization)}
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

      {/* Confirmation Modal for Empty Cart */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmEmptyCart}
        title="Empty Cart?"
        message="Are you sure you want to empty your cart? This will remove all items and hampers."
        confirmText="Yes, Empty Cart"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="h-6 w-6" />}
      />
    </div>
  );
}

