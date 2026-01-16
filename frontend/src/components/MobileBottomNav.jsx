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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-50 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 tap-target ${
                active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-600 active:bg-neutral-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-600 rounded-t-full"></div>
              )}
            </Link>
          );
        })}
        
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 text-secondary-600 active:bg-secondary-50 transition-all duration-200 tap-target relative"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                {getCartCount()}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Cart</span>
        </button>
      </div>
    </nav>
  );
}

