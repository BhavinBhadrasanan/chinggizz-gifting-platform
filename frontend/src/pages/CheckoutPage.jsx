import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, MapPin, User, Mail, Phone, CheckCircle, Truck, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

export default function CheckoutPage() {
  const { cartItems, hampers, getCartTotal, clearCart } = useCart();
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

  // Scroll to top when component mounts (mobile UX improvement)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
      // Determine order type based on cart contents
      const hasHampers = hampers && hampers.length > 0;
      const orderType = hasHampers ? 'HAMPER_ARRANGEMENT' : 'DIRECT_PURCHASE';

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
        orderType: orderType,
        specialInstructions: formData.specialInstructions || null,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          customizationCharge: item.customizationCharge || 0,
          customizationData: item.customization ? JSON.stringify(item.customization) : null
        })),
        orderHampers: hampers.map(hamper => ({
          hamperBoxId: hamper.hamperBoxId,
          withArrangement: true,
          hamperData: JSON.stringify({
            hamperName: hamper.hamperName,
            items: hamper.items,
            boxDetails: hamper.boxDetails,
            totalItems: hamper.totalItems,
            itemsTotal: hamper.itemsTotal,
            boxPrice: hamper.boxPrice,
            grandTotal: hamper.grandTotal
          }),
          hamperName: hamper.hamperName,
          screenshot: hamper.screenshot
        }))
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 py-4 sm:py-12 pb-24 sm:pb-12">
      <div className="container-custom max-w-7xl px-3 sm:px-4">
        {/* Header with Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mb-4 sm:mb-3">
            Checkout
          </h1>
          {/* Mobile Progress - Compact */}
          <div className="flex items-center justify-between sm:justify-start sm:gap-2 overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">1</div>
              <span className="text-xs sm:text-sm font-semibold text-neutral-700 whitespace-nowrap">Info</span>
            </div>
            <div className="h-0.5 w-8 sm:w-12 bg-neutral-300 mx-1 sm:mx-0"></div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
              <span className="text-xs sm:text-sm font-medium text-neutral-500 whitespace-nowrap">Payment</span>
            </div>
            <div className="h-0.5 w-8 sm:w-12 bg-neutral-300 mx-1 sm:mx-0"></div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
              <span className="text-xs sm:text-sm font-medium text-neutral-500 whitespace-nowrap">Done</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Contact Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200/50 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>



              {/* Shipping Address */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200/50 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="input-field focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="House/Flat No., Street, Area"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="Kochi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="Kerala"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="input-field focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="682001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200/50 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">
                    Delivery Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-start p-3 sm:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'DIRECT_DELIVERY'
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-neutral-200 hover:border-primary-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="DIRECT_DELIVERY"
                      checked={formData.deliveryMethod === 'DIRECT_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 sm:mr-4 mt-1 w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2 mb-1 flex-wrap">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                        <span>Direct Delivery</span>
                        <span className="text-[10px] sm:text-xs bg-primary-100 text-primary-700 px-2 py-0.5 sm:py-1 rounded-full font-semibold">Recommended</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Our team will deliver directly (Kochi, Ernakulam, Alappuzha)
                      </p>
                    </div>
                  </label>
                  <label className={`flex items-start p-3 sm:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'COURIER_DELIVERY'
                      ? 'border-accent-500 bg-accent-50 shadow-md'
                      : 'border-neutral-200 hover:border-accent-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="COURIER_DELIVERY"
                      checked={formData.deliveryMethod === 'COURIER_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 sm:mr-4 mt-1 w-4 h-4 sm:w-5 sm:h-5 text-accent-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2 mb-1 flex-wrap">
                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-accent-600 flex-shrink-0" />
                        <span>Courier Delivery</span>
                        <span className="text-[10px] sm:text-xs bg-accent-100 text-accent-700 px-2 py-0.5 sm:py-1 rounded-full font-semibold">All India</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Delivery via courier (3-5 business days)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-neutral-200/50 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">
                      Special Instructions
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500">(Optional)</p>
                  </div>
                </div>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-sm sm:text-base"
                  placeholder="Any special requests or delivery instructions... (e.g., 'Please deliver after 6 PM')"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200/50 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-neutral-200 hover:border-green-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mr-4 w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-neutral-900">Cash on Delivery</div>
                      <p className="text-sm text-neutral-600 mt-1">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center p-5 border-2 border-neutral-200 rounded-xl cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="mr-4 w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-neutral-900 flex items-center gap-2">
                        Online Payment
                        <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded-full font-semibold">Coming Soon</span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">UPI, Cards, Net Banking</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button - Desktop Only */}
              <button
                type="submit"
                className="hidden lg:block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg py-5 rounded-xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="h-6 w-6" />
                    <span>Place Order - ₹{getCartTotal().toFixed(2)}</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-100 p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Order Summary</h2>
              </div>

              <div className="space-y-3 mb-5 sm:mb-6 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition-all border border-purple-100">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-xl flex-shrink-0 shadow-md overflow-hidden border-2 border-white">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                          <Package className="h-7 w-7 sm:h-8 sm:w-8 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 truncate mb-1">{item.name}</h3>
                      <p className="text-xs text-neutral-600 mb-2">Qty: {item.quantity}</p>
                      <p className="text-sm sm:text-base font-bold text-primary-600">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-purple-200 pt-5 space-y-3">
                <div className="flex justify-between text-neutral-700 text-sm sm:text-base">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700 text-sm sm:text-base">
                  <span className="font-medium">Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base text-neutral-600 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Discount
                  </span>
                  <span className="font-bold text-green-600">₹0</span>
                </div>
                <div className="flex justify-between items-center text-xl sm:text-2xl font-extrabold text-neutral-900 pt-4 border-t-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                  <span>Total</span>
                  <span className="text-primary-600">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t-2 border-purple-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Truck className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">Free delivery on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700">
                  <Package className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="font-medium">Quality guaranteed</span>
                </div>
              </div>

              {/* Mobile Place Order Button - After Order Summary */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="lg:hidden w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-base py-4 rounded-xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Place Order - ₹{getCartTotal().toFixed(2)}</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
