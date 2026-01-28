import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, MapPin, User, Mail, Phone, CheckCircle, Truck, Package, ArrowLeft } from 'lucide-react';
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

        // Clear hamper builder state since order is successfully placed
        localStorage.removeItem('hamperBuilderState');

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100/30 to-secondary-50/20 py-6 sm:py-8 px-4 overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          {/* Success Header Card - Compact */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4 animate-fade-in">
            {/* Compact Success Header */}
            <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 py-6 px-4 text-center relative overflow-hidden">
              {/* Decorative Elements - Smaller */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>

              {/* Compact Success Icon */}
              <div className="relative inline-block mb-3">
                {/* Outer Pulsing Ring */}
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>

                {/* Main Icon Circle - Smaller */}
                <div className="relative bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow ring-4 ring-white/30">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" strokeWidth={3} />
                </div>

                {/* Sparkle Effects - Smaller */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
              </div>

              {/* Success Title - Compact */}
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 animate-slide-up">
                🎉 Order Placed Successfully!
              </h1>
              <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl mx-auto animate-slide-up-delay px-4">
                Thank you for choosing Chinggizz! Your gift is on its way to making someone's day special ✨
              </p>
            </div>

            {/* Order Number Section - Compact */}
            {orderNumber && (
              <div className="bg-white p-4 sm:p-5 border-b border-neutral-100">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-neutral-600 font-semibold mb-2">Your Order Number</p>
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-3 sm:p-4 inline-block shadow-md">
                    <p className="text-xl sm:text-2xl font-bold text-white tracking-wider font-mono">
                      {orderNumber}
                    </p>
                  </div>
                  <p className="text-xs text-primary-600 mt-2 flex items-center justify-center gap-1 font-medium">
                    <span>💾</span>
                    Save this number for tracking your order
                  </p>
                </div>
              </div>
            )}

            {/* What Happens Next - Roadmap Style */}
            <div className="p-4 sm:p-8">
              <div className="bg-gradient-to-r from-neutral-50 to-white rounded-2xl p-4 sm:p-6 border-2 border-primary-100">
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 flex items-center gap-2 justify-center">
                  <span className="text-2xl">📋</span>
                  <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    What Happens Next?
                  </span>
                </h3>

                {/* Roadmap Timeline */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Vertical Line - Green Gradient */}
                  <div className="absolute left-[19px] sm:left-[23px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600"></div>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Step 1 - Order Confirmation */}
                    <div className="relative flex items-start gap-4 sm:gap-5 animate-slide-up">
                      {/* Number Badge */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-300 to-primary-400 flex items-center justify-center shadow-lg ring-4 ring-white">
                          <span className="text-white font-bold text-base sm:text-lg">1</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border-2 border-primary-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-bold text-neutral-900 text-base sm:text-lg">Order Confirmation Sent</h4>
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">✅</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                          We've sent your order details to our WhatsApp business number. You'll receive a confirmation message shortly!
                        </p>
                      </div>
                    </div>

                    {/* Step 2 - Contact */}
                    <div className="relative flex items-start gap-4 sm:gap-5 animate-slide-up-delay">
                      {/* Number Badge */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-lg ring-4 ring-white">
                          <span className="text-white font-bold text-base sm:text-lg">2</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border-2 border-primary-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-bold text-neutral-900 text-base sm:text-lg">We'll Contact You</h4>
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">📞</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                          Our team will reach out via WhatsApp or phone within 2-4 hours to confirm your order details and delivery preferences.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 - Preparation */}
                    <div className="relative flex items-start gap-4 sm:gap-5 animate-slide-up-delay-2">
                      {/* Number Badge */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                          <span className="text-white font-bold text-base sm:text-lg">3</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border-2 border-primary-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-bold text-neutral-900 text-base sm:text-lg">Careful Preparation</h4>
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">🎁</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                          Your personalized gift will be carefully prepared with love and attention to every detail.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 - Delivery */}
                    <div className="relative flex items-start gap-4 sm:gap-5 animate-slide-up-delay-3">
                      {/* Number Badge */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg ring-4 ring-white">
                          <span className="text-white font-bold text-base sm:text-lg">4</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border-2 border-primary-200 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-bold text-neutral-900 text-base sm:text-lg">Safe & Secure Delivery</h4>
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">🚚</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                          Your gift will be securely packaged and delivered to your doorstep with care. Track your delivery in real-time!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6 animate-slide-up-delay-4 border-2 border-primary-100">
            <h3 className="text-lg sm:text-xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Why Choose Chinggizz? 🌟
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-3xl sm:text-4xl">🔒</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Secure</p>
                <p className="text-xs text-neutral-600">Payment</p>
              </div>
              <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-3xl sm:text-4xl">✨</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Quality</p>
                <p className="text-xs text-neutral-600">Guaranteed</p>
              </div>
              <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-3xl sm:text-4xl">📦</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Safe</p>
                <p className="text-xs text-neutral-600">Packaging</p>
              </div>
              <div className="text-center p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-3xl sm:text-4xl">💝</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 mb-1">Made with</p>
                <p className="text-xs text-neutral-600">Love</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-white mb-6 animate-slide-up-delay-5 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Need Help? We're Here! 💬</h3>
              <p className="text-sm sm:text-base text-white/90 mb-6 max-w-2xl mx-auto">
                Have questions about your order? Our team is ready to assist you!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <a
                  href="https://wa.me/917028870008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-green-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="text-xl">💬</span>
                  WhatsApp Us
                </a>
                <a
                  href="tel:+917028870008"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-white/30 transition-all hover:scale-105 active:scale-95 border-2 border-white/40 shadow-lg"
                >
                  <span className="text-xl">📞</span>
                  Call Us
                </a>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center pb-4">
            <button
              onClick={() => {
                clearCart();
                navigate('/');
              }}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white px-10 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-primary-500/50 animate-slide-up-delay-5 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
              Continue Shopping
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-sm text-neutral-600 mt-4 font-medium">
              Ready to explore more amazing gifts?
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 py-4 sm:py-12 pb-24 sm:pb-12">
      <div className="container-custom max-w-7xl px-3 sm:px-4">
        {/* Header with Back Button and Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          {/* Back Button and Title */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/cart')}
                className="p-2 sm:p-3 rounded-xl bg-white hover:bg-neutral-100 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group"
                title="Back to Cart"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700 group-hover:text-primary-600 transition-colors" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 sm:p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-700 bg-clip-text text-transparent">
                    Almost There! 🎉
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">Just a few details to complete your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Step Progress - Enhanced Design */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-primary-100">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {/* Step 1 - Active */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-lg ring-4 ring-primary-100">
                    1
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-neutral-500 font-medium">Step 1</p>
                  <p className="text-sm font-bold text-neutral-900">Complete Order</p>
                </div>
                <div className="sm:hidden">
                  <p className="text-xs font-bold text-neutral-900">Complete Order</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="flex-1 max-w-[80px] sm:max-w-[120px] px-2 sm:px-4">
                <div className="h-1 bg-gradient-to-r from-primary-300 to-neutral-200 rounded-full"></div>
              </div>

              {/* Step 2 - Inactive */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-neutral-400 font-medium">Step 2</p>
                  <p className="text-sm font-medium text-neutral-500">Confirmed</p>
                </div>
                <div className="sm:hidden text-right">
                  <p className="text-xs font-medium text-neutral-500">Confirmed</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-base sm:text-lg font-bold border-2 border-neutral-200">
                  2
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Contact Information */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-secondary-100 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 pl-11 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-400"
                        required
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 pl-11 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-400"
                        required
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-500" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 pl-11 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-400"
                        required
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-500" />
                    </div>
                  </div>
                </div>
              </div>



              {/* Shipping Address */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-secondary-100 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3.5 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 hover:border-neutral-400 resize-none"
                      placeholder="House/Flat No., Street, Area"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 hover:border-neutral-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 hover:border-neutral-400"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 hover:border-neutral-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-secondary-100 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">
                    Delivery Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-start p-3 sm:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'DIRECT_DELIVERY'
                      ? 'border-secondary-500 bg-secondary-50 shadow-md'
                      : 'border-neutral-200 hover:border-secondary-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="DIRECT_DELIVERY"
                      checked={formData.deliveryMethod === 'DIRECT_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 sm:mr-4 mt-1 w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2 mb-1 flex-wrap">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-600 flex-shrink-0" />
                        <span>Direct Delivery</span>
                        <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-0.5 sm:py-1 rounded-full font-semibold">Recommended</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Our team will deliver directly (Kochi, Ernakulam, Alappuzha)
                      </p>
                    </div>
                  </label>
                  <label className={`flex items-start p-3 sm:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                    formData.deliveryMethod === 'COURIER_DELIVERY'
                      ? 'border-secondary-500 bg-secondary-50 shadow-md'
                      : 'border-neutral-200 hover:border-secondary-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="COURIER_DELIVERY"
                      checked={formData.deliveryMethod === 'COURIER_DELIVERY'}
                      onChange={handleInputChange}
                      className="mr-3 sm:mr-4 mt-1 w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2 mb-1 flex-wrap">
                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-600 flex-shrink-0" />
                        <span>Courier Delivery</span>
                        <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-0.5 sm:py-1 rounded-full font-semibold">All India</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Delivery via courier (3-5 business days)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-secondary-100 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">
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
                  className="w-full px-4 py-3.5 text-base border-2 border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-neutral-400 resize-none"
                  placeholder="Any special requests or delivery instructions... (e.g., 'Please deliver after 6 PM')"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-secondary-100 p-4 sm:p-7 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">
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
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-secondary-100 p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-secondary-600 to-secondary-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-600 bg-clip-text text-transparent">Order Summary</h2>
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
