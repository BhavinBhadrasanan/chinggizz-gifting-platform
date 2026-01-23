import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartBoxPreview3D from './CartBoxPreview3D';

export default function Cart() {
  const { cartItems, hampers, removeFromCart, removeHamperFromCart, updateQuantity, clearCart, getCartTotal, getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart? This will remove all items and hampers.')) {
      clearCart();
    }
  };

  if (!isCartOpen) return null;

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
    <>
      {/* Backdrop - Exclude bottom nav area on mobile */}
      <div
        className="fixed inset-0 lg:inset-0 bottom-16 lg:bottom-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Cart Sidebar - Mobile Optimized - Leave space for footer nav on mobile */}
      <div className="fixed right-0 top-0 h-[calc(100vh-4rem)] lg:h-full w-full sm:max-w-md bg-white shadow-2xl z-[200] flex flex-col animate-slideInRight relative overflow-hidden">
        {/* Header - Mobile Friendly */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  My Cart
                </h2>
                <p className="text-xs text-neutral-600">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/50 active:bg-white rounded-lg transition-colors tap-target"
            >
              <X className="h-6 w-6 text-neutral-600" />
            </button>
          </div>

          {/* Empty Cart Button - Only show when cart has items */}
          {(cartItems.length > 0 || hampers.length > 0) && (
            <button
              onClick={handleEmptyCart}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-98 tap-target border border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              Empty Cart
            </button>
          )}
        </div>

        {/* Cart Items - Mobile Optimized - Add bottom padding for fixed footer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-48 overscroll-contain">
          {cartItems.length === 0 && hampers.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-neutral-100 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-6">Add some amazing products to get started!</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/');
                }}
                className="btn-primary tap-target"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Regular Cart Items */}
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="card p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-neutral-300" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 mb-1 truncate">
                        {item.name}
                      </h3>

                      {/* Customization Details - Show FIRST for clarity */}
                      {item.customization && typeof item.customization === 'object' && item.customization.selectedOptions && (
                        <div className="text-xs mb-2 bg-primary-50 p-2 rounded border border-primary-200">
                          {Object.entries(item.customization.selectedOptions).map(([key, value]) => (
                            <p key={key} className="text-neutral-800 font-semibold">
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
                      <p className="text-sm text-neutral-600 mb-2">
                        {item.customization && typeof item.customization === 'object' && item.customization.totalPrice ? (
                          <span className="font-bold text-primary-600 text-base">
                            ₹{parseFloat(item.customization.totalPrice).toFixed(2)}
                          </span>
                        ) : (
                          <>
                            <span className="font-bold text-primary-600 text-base">
                              ₹{parseFloat(item.price).toFixed(2)}
                            </span>
                            {item.customization && item.customizationCharge > 0 && (
                              <span className="text-primary-600">
                                {' '}+ ₹{parseFloat(item.customizationCharge).toFixed(2)} (Custom)
                              </span>
                            )}
                          </>
                        )}
                      </p>

                      {/* 3D Box Preview for Hamper Boxes - Always Visible */}
                      {isHamperBox(item) && getBoxDimensions(item).widthCm > 0 && (
                        <div className="mb-2">
                          <CartBoxPreview3D
                            widthCm={getBoxDimensions(item).widthCm}
                            heightCm={getBoxDimensions(item).heightCm}
                            depthCm={getBoxDimensions(item).depthCm}
                            boxType={item.customization?.selectedOptions?.['Box Type'] || 'Transparent Box'}
                          />
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.customization)}
                            className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                          >
                            <Minus className="h-4 w-4 text-neutral-700" />
                          </button>
                          <span className="w-8 text-center font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customization)}
                            className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                          >
                            <Plus className="h-4 w-4 text-neutral-700" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.customization)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <Trash2 className="h-4 w-4 text-neutral-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom Hampers */}
              {hampers.map((hamper, index) => (
                <div key={`hamper-${hamper.id}`} className="card p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex gap-4">
                    {/* Hamper Screenshot */}
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-purple-300">
                      {hamper.screenshot ? (
                        <img
                          src={hamper.screenshot}
                          alt={hamper.hamperName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Sparkles className="h-8 w-8 text-purple-400" />
                      )}
                    </div>

                    {/* Hamper Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <h3 className="font-bold text-neutral-900 truncate">
                          {hamper.hamperName}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-600 mb-1">
                        {hamper.boxDetails?.dimensions} • {hamper.totalItems} items
                      </p>
                      <p className="text-sm font-semibold text-purple-600 mb-2">
                        ₹{hamper.grandTotal}
                      </p>

                      {/* Hamper Items Preview */}
                      <div className="text-xs text-neutral-500 bg-white/50 p-2 rounded mb-2">
                        <p className="font-medium mb-1">Items:</p>
                        <div className="space-y-0.5 max-h-16 overflow-y-auto">
                          {hamper.items?.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-neutral-700 truncate">
                              • {item.productName}
                            </p>
                          ))}
                          {hamper.items?.length > 3 && (
                            <p className="text-neutral-500 italic">
                              +{hamper.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeHamperFromCart(hamper.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <Trash2 className="h-4 w-4 text-neutral-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Absolutely positioned at bottom of cart sidebar - Compact */}
        {(cartItems.length > 0 || hampers.length > 0) && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 px-3 sm:px-4 pt-2 sm:pt-3 pb-2 bg-white space-y-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-semibold text-neutral-900">Total:</span>
              <span className="text-base sm:text-lg font-bold text-primary-600">
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Build Your Own Hamper Button - Only show if cart has items that are NOT just hamper boxes */}
            {(() => {
              // Check if cart has only hamper boxes (product name contains "Hamper Box")
              const hasOnlyHamperBoxes = cartItems.length > 0 &&
                cartItems.every(item => item.name && item.name.toLowerCase().includes('hamper box'));

              // Only show "Build Your Own Hamper" if there are non-hamper-box items
              if (!hasOnlyHamperBoxes && cartItems.length > 0) {
                return (
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      // Scroll to top for smooth transition
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // Navigate to hamper builder
                      setTimeout(() => {
                        navigate('/hamper-builder');
                      }, 100);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
                  >
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">Build Your Own Hamper</span>
                  </button>
                );
              }
              return null;
            })()}

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                // Scroll to top for smooth transition
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Navigate to checkout
                setTimeout(() => {
                  navigate('/checkout');
                }, 100);
              }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

