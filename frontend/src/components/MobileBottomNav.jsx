import { Home, Package, Sparkles, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { getCartCount, setIsCartOpen } = useCart();
  
  const isActive = (path) => location.pathname === path;
  
  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/hamper-builder', label: 'Builder', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 shadow-2xl z-50 safe-area-bottom">
      {/* Glassy top border effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>

      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 tap-target relative group ${
                active
                  ? 'text-primary-600'
                  : 'text-neutral-600 active:text-primary-500'
              }`}
            >
              {/* Background glow on active */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50 via-primary-50/50 to-transparent animate-pulse"></div>
              )}

              {/* Icon with enhanced animation */}
              <div className="relative z-10">
                <Icon className={`h-5 w-5 transition-all duration-300 ${
                  active
                    ? 'scale-110 drop-shadow-lg'
                    : 'group-active:scale-95'
                }`} />

                {/* Sparkle effect on active */}
                {active && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                )}
              </div>

              {/* Label */}
              <span className={`text-xs transition-all duration-300 relative z-10 ${
                active ? 'font-bold' : 'font-medium'
              }`}>
                {item.label}
              </span>

              {/* Active indicator bar - enhanced */}
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-t-full shadow-lg"></div>
              )}
            </Link>
          );
        })}

        {/* Cart Button - Enhanced */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 text-secondary-600 active:text-secondary-700 transition-all duration-300 tap-target relative group"
        >
          {/* Background on press */}
          <div className="absolute inset-0 bg-secondary-50 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>

          <div className="relative z-10">
            <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-active:scale-95" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white shadow-lg animate-bounce">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-xs font-medium relative z-10">Cart</span>
        </button>
      </div>
    </nav>
  );
}

