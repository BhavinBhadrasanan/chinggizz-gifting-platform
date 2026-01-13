import { ShoppingCart, Gift, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PurchaseFlowModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDirectPurchase = () => {
    onClose();
    navigate('/checkout');
  };

  const handleHamperArrangement = () => {
    onClose();
    navigate('/hamper-builder');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-3xl font-bold text-white text-center">
            Choose Your Purchase Flow
          </h2>
          <p className="text-white/90 text-center mt-2">
            Select how you'd like to complete your order
          </p>
        </div>

        {/* Options */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          {/* Direct Purchase Option */}
          <div
            onClick={handleDirectPurchase}
            className="group cursor-pointer bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border-2 border-primary-200 hover:border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              Direct Purchase
            </h3>
            
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Quick and easy checkout with your selected items. Perfect for ready-made products and pre-designed hampers.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm text-neutral-700">
                <span className="text-primary-600 mr-2">✓</span>
                Fast checkout process
              </li>
              <li className="flex items-start text-sm text-neutral-700">
                <span className="text-primary-600 mr-2">✓</span>
                No customization needed
              </li>
              <li className="flex items-start text-sm text-neutral-700">
                <span className="text-primary-600 mr-2">✓</span>
                Immediate order confirmation
              </li>
            </ul>

            <div className="flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              Continue to Checkout
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hamper Arrangement Option */}
          <div
            onClick={handleHamperArrangement}
            className="group cursor-pointer bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-8 border-2 border-accent-200 hover:border-accent-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gift className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              Custom Hamper Arrangement
            </h3>
            
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Create a personalized gift hamper with our interactive 3D builder. Arrange items exactly how you want them.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm text-neutral-700">
                <span className="text-accent-600 mr-2">✓</span>
                Interactive 3D arrangement
              </li>
              <li className="flex items-start text-sm text-neutral-700">
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

