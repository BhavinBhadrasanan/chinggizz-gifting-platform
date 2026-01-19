import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Gift, Sparkles, Heart, ShoppingBag, Package, Star, CheckCircle, Users, Award, Plus, Filter, MessageCircle, Phone, Mail } from 'lucide-react';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import ProductCustomizationModal from '../components/ProductCustomizationModal';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedType, allProducts]);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setAllProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load home data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === parseInt(selectedCategory));
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.productType === selectedType);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    // Check if product has customization options
    const hasCustomization = product.customizationOptions || product.isCustomizable;

    if (hasCustomization) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      // Directly add to cart if no customization needed
      addToCart(product, 1);
    }
  };

  const productTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'CUSTOMISED_ITEM', label: 'Customized Items' },
    { value: 'EDIBLE_ITEM', label: 'Edible Items' },
    { value: 'HAMPER_BOX', label: 'Hamper Boxes' },
    { value: 'PREDEFINED_HAMPER', label: 'Predefined Hampers' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Banner - Facebook-Inspired Professional Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        {/* Animated Background Elements - Subtle & Professional */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge - Clean & Professional */}
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/20 shadow-xl">
              <Sparkles className="h-5 w-5 text-secondary-300 animate-pulse" />
              <span className="text-sm font-bold text-white tracking-wide">✨ PREMIUM CUSTOMIZED GIFTS ✨</span>
              <Sparkles className="h-5 w-5 text-secondary-300 animate-pulse" />
            </div>

            {/* Main Heading - Bold & Clear */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-2xl">
              Discover Perfect Gifts
              <br />
              <span className="bg-gradient-to-r from-secondary-300 via-secondary-200 to-secondary-300 bg-clip-text text-transparent">
                For Every Occasion
              </span>
            </h1>

            {/* Subtitle - Clear & Meaningful */}
            <p className="text-xl md:text-2xl text-white/95 mb-10 font-medium drop-shadow-lg">
              Personalized gifts, gourmet treats, and luxury hampers crafted with love
            </p>

            {/* Feature Stats - Clean & Professional */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{allProducts.length}+</div>
                  <div className="text-xs text-white/90 font-medium">Products</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-white/90 font-medium">Customizable</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Star className="h-5 w-5 text-secondary-300" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">5.0</div>
                  <div className="text-xs text-white/90 font-medium">Rating</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-xs text-white/90 font-medium">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Professional & Clean */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 max-w-md sm:max-w-none mx-auto">
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('products-section')?.offsetTop - 100, behavior: 'smooth' })}
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/50 hover:bg-neutral-50 active:scale-95 sm:hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 tap-target"
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 group-active:scale-110 sm:group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Shop Now</span>
              </button>
              <Link to="/hamper-builder" className="group w-full sm:w-auto px-8 sm:px-10 py-4 bg-secondary-500 text-white border-2 border-secondary-400 rounded-xl font-bold text-base sm:text-lg hover:bg-secondary-600 active:scale-95 sm:hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 tap-target shadow-xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 group-active:rotate-12 sm:group-hover:rotate-12 transition-transform flex-shrink-0" />
                <span className="whitespace-nowrap">Build Custom Hamper</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      {/* Filters Section - Compact Mobile Design */}
      <section className="py-2 sm:py-3 md:py-4 bg-white/95 backdrop-blur-sm border-b border-neutral-200 lg:sticky lg:top-[88px] z-30 shadow-sm">
        <div className="container-custom">
          {/* Mobile: Single Row Horizontal Layout */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter className="h-4 w-4 text-neutral-600 flex-shrink-0 hidden sm:block" />

            {/* Category Filter - Compact */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-modern text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 min-w-[110px] sm:min-w-[140px] flex-shrink-0 border-neutral-300"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Type Filter - Compact */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-modern text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 min-w-[100px] sm:min-w-[120px] flex-shrink-0 border-neutral-300"
            >
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Product Count - Compact */}
            <div className="text-xs sm:text-sm text-neutral-600 whitespace-nowrap ml-auto flex-shrink-0 px-2">
              <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> <span className="hidden sm:inline">items</span>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section id="products-section" className="py-8 sm:py-12 bg-neutral-50 scroll-mt-20">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="shimmer h-96 rounded-xl"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-neutral-600 mb-6">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="card group flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
                >
                  {/* Glassy overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 transition-all duration-300 pointer-events-none z-10"></div>

                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <Gift className="h-24 w-24 text-neutral-300 group-hover:scale-110 transition-transform duration-500" />
                    )}

                    {/* Gradient overlay for better badge visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

                    {/* Badges - Enhanced */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
                      {product.isCustomizable && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold backdrop-blur-sm">
                          <Sparkles className="h-3 w-3" />
                          Customizable
                        </span>
                      )}
                      {product.stockQuantity !== null && product.stockQuantity < 10 && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold ml-auto backdrop-blur-sm animate-pulse">
                          Only {product.stockQuantity} left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1 relative z-10">
                    <div className="mb-2">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                    </div>

                    <h3 className="font-bold text-base mb-2 text-neutral-900 line-clamp-2 min-h-[3rem] group-hover:text-primary-600 transition-colors duration-300">
                      {product.name}
                    </h3>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    {/* Price and Add to Cart */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            ₹{parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.isCustomizable && product.customizationCharge > 0 && (
                            <p className="text-xs text-neutral-500 mt-1 font-medium">
                              +₹{parseFloat(product.customizationCharge).toFixed(2)} customization
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full text-sm py-2.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg tap-target inline-flex items-center justify-center ${
                          product.stockQuantity === 0
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-primary-200 hover:shadow-xl'
                        }`}
                        disabled={product.stockQuantity === 0}
                      >
                        {product.stockQuantity === 0 ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Contact Card - Mobile Optimized - Positioned After Products */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <div className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 sm:p-8 shadow-2xl border-2 border-green-400 overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/10 rounded-full blur-2xl"></div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
              {/* Left Content - Mobile Optimized */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
                  <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-300 animate-pulse" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Can't Find What You Need?</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 leading-relaxed">
                  Chat with <span className="font-bold text-yellow-300">Chinggis</span> on WhatsApp for custom hampers, bulk orders & special requests!
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 flex-shrink-0" />
                    <span>Custom Designs</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 flex-shrink-0" />
                    <span>Bulk Orders</span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 flex-shrink-0" />
                    <span>Special Requests</span>
                  </div>
                </div>
              </div>

              {/* Right CTA - Mobile Optimized */}
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 w-full md:w-auto">
                <a
                  href="https://wa.me/917012897008?text=Hi%20Chinggizz!%20I'm%20interested%20in%20creating%20a%20custom%20hamper."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-95 sm:hover:scale-105 transition-all duration-200 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center tap-target"
                >
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <a href="tel:+917012897008" className="flex items-center space-x-1.5 sm:space-x-2 hover:text-yellow-300 active:text-yellow-200 transition-colors tap-target">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">+91 70128 97008</span>
                  </a>
                  <span className="text-white/50 hidden sm:inline">|</span>
                  <a href="mailto:hello@chinggis.com" className="flex items-center space-x-1.5 sm:space-x-2 hover:text-yellow-300 active:text-yellow-200 transition-colors tap-target">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Modal */}
      <ProductCustomizationModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
