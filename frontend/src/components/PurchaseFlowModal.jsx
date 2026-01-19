import { ShoppingCart, Gift, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PurchaseFlowModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDirectPurchase = () => {
    onClose();
    // Scroll to top before navigation for smooth transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate after a brief delay to allow scroll animation
    setTimeout(() => {
      navigate('/checkout');
    }, 100);
  };

  const handleHamperArrangement = () => {
    onClose();
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/hamper-builder');
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-slideUp sm:animate-fade-in max-h-[90vh] sm:max-h-none overflow-y-auto">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 sm:p-6 relative sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:bg-white/20 active:bg-white/30 rounded-full p-2 transition-colors tap-target"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <h2 className="text-xl sm:text-3xl font-bold text-white text-center pr-10">
            Choose Your Purchase Flow
          </h2>
          <p className="text-sm sm:text-base text-white/90 text-center mt-1 sm:mt-2">
            Select how you'd like to complete your order
          </p>
        </div>

        {/* Options - Mobile Optimized */}
        <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Direct Purchase Option - Mobile Optimized */}
          <div
            onClick={handleDirectPurchase}
            className="group cursor-pointer bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 sm:p-8 border-2 border-primary-200 active:border-primary-500 sm:hover:border-primary-500 active:shadow-xl sm:hover:shadow-xl transition-all duration-300 sm:transform sm:hover:-translate-y-1 tap-target"
          >
            <div className="bg-primary-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-active:scale-110 sm:group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>

            <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 mb-2 sm:mb-3">
              Direct Purchase
            </h3>

            <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 leading-relaxed">
              Quick and easy checkout with your selected items. Perfect for ready-made products.
            </p>

            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              <li className="flex items-start text-xs sm:text-sm text-neutral-700">
                <span className="text-primary-600 mr-2 flex-shrink-0">✓</span>
                Fast checkout process
              </li>
              <li className="flex items-start text-xs sm:text-sm text-neutral-700">
                <span className="text-primary-600 mr-2 flex-shrink-0">✓</span>
                No customization needed
              </li>
              <li className="flex items-start text-xs sm:text-sm text-neutral-700">
                <span className="text-primary-600 mr-2 flex-shrink-0">✓</span>
                Immediate order confirmation
              </li>
            </ul>

            <div className="flex items-center text-sm sm:text-base text-primary-600 font-semibold group-active:gap-3 sm:group-hover:gap-3 gap-2 transition-all">
              Continue to Checkout
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-active:translate-x-1 sm:group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hamper Arrangement Option - Mobile Optimized */}
          <div
            onClick={handleHamperArrangement}
            className="group cursor-pointer bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-5 sm:p-8 border-2 border-accent-200 active:border-accent-500 sm:hover:border-accent-500 active:shadow-xl sm:hover:shadow-xl transition-all duration-300 sm:transform sm:hover:-translate-y-1 tap-target"
          >
            <div className="bg-accent-600 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-active:scale-110 sm:group-hover:scale-110 transition-transform">
              <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>

            <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 mb-2 sm:mb-3">
              Custom Hamper Arrangement
            </h3>

            <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 leading-relaxed">
              Create a personalized gift hamper with our interactive 3D builder. Arrange items exactly how you want.
            </p>

            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              <li className="flex items-start text-xs sm:text-sm text-neutral-700">
                <span className="text-accent-600 mr-2 flex-shrink-0">✓</span>
                Interactive 3D arrangement
              </li>
              <li className="flex items-start text-xs sm:text-sm text-neutral-700">
                <span className="text-accent-600 mr-2">✓</span>
                Personalized gift experience
              </li>
              <li className="flex items-start text-sm text-neutral-700">
                <span className="text-accent-600 mr-2">✓</span>
                Professional arrangement option
              </li>
            </ul>

            <div className="flex items-center text-accent-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              Build Your Hamper
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-8 py-4 text-center text-sm text-neutral-600">
          You can change your selection at any time before completing the order
        </div>
      </div>
    </div>
  );
}

