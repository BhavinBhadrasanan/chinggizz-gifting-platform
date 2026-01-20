import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, hampers, removeFromCart, removeHamperFromCart, updateQuantity, getCartTotal, getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [expandedBoxPreview, setExpandedBoxPreview] = useState(null);

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Cart Sidebar - Mobile Optimized */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slideInRight">
        {/* Header - Mobile Friendly */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
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

        {/* Cart Items - Mobile Optimized */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
          {cartItems.length === 0 && hampers.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-neutral-100 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-6">Add some amazing products to get started!</p>
              <button
                onClick={() => setIsCartOpen(false)}
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
                      <p className="text-sm text-neutral-600 mb-2">
                        {item.customization && typeof item.customization === 'object' && item.customization.totalPrice ? (
                          <span className="font-semibold text-primary-600">
                            ₹{parseFloat(item.customization.totalPrice).toFixed(2)}
                          </span>
                        ) : (
                          <>
                            ₹{parseFloat(item.price).toFixed(2)}
                            {item.customization && item.customizationCharge > 0 && (
                              <span className="text-primary-600">
                                {' '}+ ₹{parseFloat(item.customizationCharge).toFixed(2)} (Custom)
                              </span>
                            )}
                          </>
                        )}
                      </p>

                      {/* Customization Details */}
                      {item.customization && (
                        <div className="text-xs text-neutral-500 mb-2 bg-neutral-50 p-2 rounded">
                          <p className="font-medium mb-1">Customization:</p>
                          {typeof item.customization === 'object' ? (
                            <div className="space-y-1">
                              {item.customization.selectedOptions && Object.entries(item.customization.selectedOptions).map(([key, value]) => (
                                <p key={key} className="text-neutral-700">
                                  <span className="font-medium">{key}:</span> {value}
                                </p>
                              ))}
                              {item.customization.uploadedImages && Object.keys(item.customization.uploadedImages).length > 0 && (
                                <p className="text-neutral-700">
                                  <span className="font-medium">Photo:</span> Uploaded ✓
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="truncate">{item.customization}</p>
                          )}
                        </div>
                      )}

                      {/* 3D Box Preview for Hamper Boxes */}
                      {isHamperBox(item) && getBoxDimensions(item).widthCm > 0 && (
                        <div className="mb-2">
                          <button
                            onClick={() => setExpandedBoxPreview(expandedBoxPreview === `${item.id}-${index}` ? null : `${item.id}-${index}`)}
                            className="w-full text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Package className="h-4 w-4" />
                            {expandedBoxPreview === `${item.id}-${index}` ? 'Hide' : 'View'} 3D Box Preview
                          </button>

                          {expandedBoxPreview === `${item.id}-${index}` && (
                            <div className="mt-2 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-200 animate-fadeIn">
                              {/* 3D Box Visualization */}
                              <div className="relative w-full h-32 flex items-center justify-center perspective-1000 mb-3">
                                <div
                                  className="relative transform-style-3d animate-rotate3d"
                                  style={{
                                    width: `${Math.min(getBoxDimensions(item).widthCm * 3, 120)}px`,
                                    height: `${Math.min(getBoxDimensions(item).heightCm * 3, 120)}px`,
                                  }}
                                >
                                  {/* Front face */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-lg shadow-xl flex items-center justify-center">
                                    <Package className="h-8 w-8 text-amber-600 opacity-50" />
                                  </div>
                                  {/* Top face */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 border-2 border-amber-500 rounded-lg shadow-xl opacity-70 transform -translate-y-2 -translate-x-2"></div>
                                </div>
                              </div>

                              {/* Dimensions */}
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white rounded-lg p-2">
                                  <p className="text-[10px] text-gray-600">Width</p>
                                  <p className="text-xs font-bold text-primary-700">{getBoxDimensions(item).widthCm}cm</p>
                                </div>
                                <div className="bg-white rounded-lg p-2">
                                  <p className="text-[10px] text-gray-600">Height</p>
                                  <p className="text-xs font-bold text-primary-700">{getBoxDimensions(item).heightCm}cm</p>
                                </div>
                                <div className="bg-white rounded-lg p-2">
                                  <p className="text-[10px] text-gray-600">Depth</p>
                                  <p className="text-xs font-bold text-primary-700">{getBoxDimensions(item).depthCm}cm</p>
                                </div>
                              </div>
                            </div>
                          )}
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

        {/* Footer - Mobile Safe Area for Bottom Nav */}
        {(cartItems.length > 0 || hampers.length > 0) && (
          <div className="border-t border-neutral-200 p-4 sm:p-6 pb-20 lg:pb-4 bg-neutral-50 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-semibold text-neutral-900">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
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
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

