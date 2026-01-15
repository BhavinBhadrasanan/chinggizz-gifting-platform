import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, MapPin, User, Mail, Phone, CheckCircle, Truck, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryMethod: 'DIRECT_DELIVERY',
    specialInstructions: '',
    paymentMethod: 'cod',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number
    if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || null,
        deliveryAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        deliveryMethod: formData.deliveryMethod,
        orderType: 'DIRECT_PURCHASE',
        specialInstructions: formData.specialInstructions || null,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          customizationCharge: item.customizationCharge || 0,
          customizationData: item.customization ? JSON.stringify(item.customization) : null
        })),
        orderHampers: []
      };

      // Submit order to backend
      const response = await api.post('/orders/create', orderData);

      if (response.data) {
        setOrderNumber(response.data.orderNumber);
        toast.success('Order placed successfully!');
        setOrderPlaced(true);

        // Clear cart after 3 seconds and redirect
        setTimeout(() => {
          clearCart();
          navigate('/');
        }, 5000);
      }
    } catch (error) {
      console.error('Order submission error:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Invalid order data. Please check your information.');
      } else if (error.response?.status === 409) {
        toast.error('Some items are out of stock. Please update your cart.');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h2>
            <button onClick={() => navigate('/')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Order Placed Successfully!</h2>

              {orderNumber && (
                <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-neutral-600 mb-1">Your Order Number</p>
                  <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
                </div>
              )}

              <p className="text-lg text-neutral-600 mb-4">
                Thank you for your order! We've received your order and will process it shortly.
              </p>
              <p className="text-neutral-600 mb-6">
                A confirmation has been sent to our WhatsApp business number. We'll contact you soon!
              </p>
              <p className="text-sm text-neutral-500">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 sm:py-12">
      <div className="container-custom">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6 sm:mb-8 px-2 sm:px-0">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>



              {/* Shipping Address */}
              <div className="card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary-600" />
                  Delivery Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-primary-500 bg-primary-50 rounded-xl cursor-pointer hover:shadow-md transition-all">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="DIRECT_DELIVERY"
                      checked={formData.deliveryMethod === 'DIRECT_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-primary-600" />
                        Direct Delivery
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Our team will deliver directly to your address
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-neutral-200 rounded-xl cursor-pointer hover:border-primary-500 hover:shadow-md transition-all">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="COURIER_DELIVERY"
                      checked={formData.deliveryMethod === 'COURIER_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-accent-600" />
                        Courier Delivery
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Delivery via courier service (may take 3-5 business days)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">
                  Special Instructions (Optional)
                </h2>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                  placeholder="Any special requests or delivery instructions..."
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-neutral-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-neutral-200 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="font-medium">Online Payment (Coming Soon)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-neutral-300 m-auto mt-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-neutral-900">{item.name}</h3>
                      <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Shipping</span>
                  <span className="text-accent-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="text-primary-600">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
