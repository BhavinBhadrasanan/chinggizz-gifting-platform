import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseFlowModal from './PurchaseFlowModal';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const [showFlowModal, setShowFlowModal] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-neutral-900">
              Shopping Cart ({getCartCount()})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-neutral-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200 p-4 sm:p-6 bg-neutral-50 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-semibold text-neutral-900">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>

            {/* Build Your Own Hamper Button */}
            <button
              onClick={() => {
                navigate('/hamper-builder');
                setIsCartOpen(false);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Build Your Own Hamper</span>
            </button>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                setShowFlowModal(true);
                setIsCartOpen(false);
              }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>

      {/* Purchase Flow Modal */}
      <PurchaseFlowModal
        isOpen={showFlowModal}
        onClose={() => setShowFlowModal(false)}
      />
    </>
  );
}

