import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Gift, Menu, X, ShoppingBag, Home, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getCartCount, setIsCartOpen } = useCart();

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    // Ensure body scroll is unlocked when route changes
    document.body.style.overflow = 'unset';
  }, [location.pathname]);

  // Lock/unlock body scroll when mobile menu opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock scroll when menu is open (mobile only)
      if (window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Unlock scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/hamper-builder', label: 'Build Hamper', icon: Sparkles },
    { path: '/admin/login', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white py-2">
        <div className="container-custom">
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-medium">
            <Gift className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            <span className="text-center">Free Delivery on Orders Above ₹999 | Customization Available</span>
            <Gift className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40 border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-primary-600 to-secondary-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Gift className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  Chinggizz
                </span>
                <span className="text-xs text-neutral-500 font-medium -mt-1">Customised Gifts</span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive(link.path) ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{link.label}</span>
                    {!isActive(link.path) && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    )}
                  </Link>
                );
              })}

              {/* Cart Button - Desktop */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative group ml-3 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:shadow-secondary-500/40 transition-all duration-200 flex items-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-4 ring-white animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions - Visible on Mobile/Tablet */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Cart Button - Mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-xl text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-lg shadow-secondary-500/30 tap-target"
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center ring-2 sm:ring-4 ring-white animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Menu Button - Mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors tap-target"
              >
                {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Visible on Mobile/Tablet */}
          {isOpen && (
            <>
              {/* Backdrop overlay */}
              <div
                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                onClick={() => setIsOpen(false)}
              />

              {/* Mobile menu */}
              <div className="lg:hidden absolute left-0 right-0 top-full py-4 border-t border-neutral-200 bg-white shadow-xl z-40 animate-fadeIn">
                <div className="container-custom">
                  <div className="flex flex-col space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => {
                            setIsOpen(false);
                            // Small delay to ensure menu closes before navigation
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }}
                          className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold transition-all tap-target ${
                            isActive(link.path)
                              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                              : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 active:bg-primary-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-base">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

