import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import MobileBottomNav from './components/MobileBottomNav';
import MobileToast from './components/MobileToast';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductCustomizationPage from './pages/ProductCustomizationPage';
import CartPage from './pages/CartPage';
import HamperBuilderPage from './pages/HamperBuilderPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

// ScrollToTop component to handle scroll restoration on route changes
// Especially important for mobile view when navigating to customization page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if mobile view (screen width < 768px)
    const isMobile = window.innerWidth < 768;

    // Scroll to top instantly on route change
    // More aggressive scroll for mobile, especially for /customize routes
    if (pathname.includes('/customize') && isMobile) {
      // For mobile customization page: Force scroll to top immediately
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // For other routes: Normal scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
          <Navbar />
          <Cart />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/customize/:productId" element={<ProductCustomizationPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/hamper-builder" element={<HamperBuilderPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
          <MobileToast />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;

