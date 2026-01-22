import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <CartProvider>
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

