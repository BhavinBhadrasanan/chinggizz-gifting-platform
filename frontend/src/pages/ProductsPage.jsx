import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Sparkles, X, Grid, List, MessageCircle, Phone } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';
import ProductCustomizationModal from '../components/ProductCustomizationModal';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  // Get hamper state from localStorage
  const getHamperState = () => {
    try {
      const savedHamper = localStorage.getItem('chinggizz_hamper');
      if (savedHamper) {
        return JSON.parse(savedHamper);
      }
    } catch (error) {
      console.error('Failed to load hamper state:', error);
    }
    return null;
  };

  // Check if product will fit in current hamper box
  const checkProductFitsInHamper = (product) => {
    const hamperState = getHamperState();

    // If no hamper in progress, product can be added
    if (!hamperState || !hamperState.selectedBox) {
      return { fits: true, reason: null };
    }

    const { selectedBox, placedItems } = hamperState;

    // Get box dimensions in cm
    const boxDimensions = selectedBox.dimensionsInch;
    const boxWidthCm = boxDimensions.length * 2.54;
    const boxDepthCm = boxDimensions.width * 2.54;
    const boxHeightCm = boxDimensions.height * 2.54;
    const boxVolumeCm3 = boxWidthCm * boxDepthCm * boxHeightCm;

    // Get product dimensions (use default if not specified)
    const productWidthCm = parseFloat(product.widthCm) || 5;
    const productDepthCm = parseFloat(product.depthCm) || 5;
    const productHeightCm = parseFloat(product.heightCm) || 5;
    const productVolumeCm3 = productWidthCm * productDepthCm * productHeightCm;

    // Check if product dimensions fit in any orientation
    const fitsNormally =
      productWidthCm <= boxWidthCm &&
      productDepthCm <= boxDepthCm &&
      productHeightCm <= boxHeightCm;

    const fitsRotated =
      productDepthCm <= boxWidthCm &&
      productWidthCm <= boxDepthCm &&
      productHeightCm <= boxHeightCm;

    if (!fitsNormally && !fitsRotated) {
      return {
        fits: false,
        reason: 'dimensions',
        message: `This item (${productWidthCm.toFixed(1)}×${productDepthCm.toFixed(1)}×${productHeightCm.toFixed(1)} cm) is too large for your ${selectedBox.name} box (${selectedBox.dimensionsCm}).`,
        boxName: selectedBox.name
      };
    }

    // Calculate current volume usage
    const currentVolume = (placedItems || []).reduce((total, item) => {
      const w = parseFloat(item.widthCm) || 5;
      const d = parseFloat(item.depthCm) || 5;
      const h = parseFloat(item.heightCm) || 5;
      return total + (w * d * h);
    }, 0);

    // Check if adding this product would exceed 85% capacity
    const totalVolumeAfterAdding = currentVolume + productVolumeCm3;
    const volumePercentage = (totalVolumeAfterAdding / boxVolumeCm3) * 100;
    const currentPercentage = (currentVolume / boxVolumeCm3) * 100;

    if (volumePercentage > 85) {
      return {
        fits: false,
        reason: 'capacity',
        message: `Your ${selectedBox.name} box is ${currentPercentage.toFixed(1)}% full. Adding this item would exceed capacity (${volumePercentage.toFixed(1)}%).`,
        currentFill: currentPercentage.toFixed(1),
        afterFill: volumePercentage.toFixed(1),
        boxName: selectedBox.name
      };
    }

    return { fits: true, reason: null };
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const productTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'CUSTOMISED_ITEM', label: 'Customized Items' },
    { value: 'EDIBLE_ITEM', label: 'Edible Items' },
    { value: 'PREDEFINED_HAMPER', label: 'Ready Hampers' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.id === parseInt(selectedCategory);
    const matchesType = selectedType === 'all' || product.productType === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchParams({});
  };

  const handleWhatsAppChat = () => {
    // WhatsApp Business number for Chinggizz
    const phoneNumber = '917012897008';
    const message = encodeURIComponent('Hi Chinggizz! I need help with a special gift or have some questions.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp chat...');
  };

  const handleProductClick = (product) => {
    // Check if product will fit in current hamper (if one exists)
    const fitCheck = checkProductFitsInHamper(product);

    if (!fitCheck.fits) {
      // Show detailed error message with option to change box
      const hamperState = getHamperState();

      if (fitCheck.reason === 'capacity') {
        // Box is too full
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-red-700">📦 Hamper Box Too Full!</div>
              <div className="text-sm text-red-600">{fitCheck.message}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate('/build-hamper');
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                >
                  Change Box Size
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: 8000, position: 'top-center' }
        );
      } else if (fitCheck.reason === 'dimensions') {
        // Item is physically too large
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-red-700">⚠️ Item Too Large!</div>
              <div className="text-sm text-red-600">{fitCheck.message}</div>
              <div className="text-xs text-red-500 mt-1">
                You need to select a larger box size to fit this item.
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate('/build-hamper');
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                >
                  Change Box Size
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: 8000, position: 'top-center' }
        );
      }
      return; // Don't proceed with adding to cart
    }

    // Product fits - proceed with normal flow
    const hasCustomization = product.customizationOptions || product.isCustomizable;

    if (hasCustomization) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      // Directly add to cart if no customization needed
      addToCart(product, 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 RENDERING ProductsPage - viewMode:', viewMode, 'products:', products.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">
            Our <span className="gradient-text">Products</span>
          </h1>
          <p className="section-subtitle">
            Discover our collection of premium gifts and customizable items
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white transition-all"
              >
                {productTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              )}
              <span className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* WhatsApp Communication Card */}
            <div
              onClick={handleWhatsAppChat}
              className="card card-hover group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 transition-all"
            >
              <div className="relative h-56 bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden flex items-center justify-center">
                <div className="text-center text-white">
                  <MessageCircle className="h-20 w-20 mx-auto mb-3 animate-bounce" />
                  <Phone className="h-8 w-8 mx-auto" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge bg-white text-green-600 shadow-md font-semibold">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Need Help?
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-green-700">
                  Chat with Chinggizz
                </h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Need a special gift? Confused about what to choose? Chat with us directly on WhatsApp for personalized recommendations!
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-semibold">Instant Response</span>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat Now
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {filteredProducts.map(product => {
              const fitCheck = checkProductFitsInHamper(product);
              const willNotFit = !fitCheck.fits;

              return (
                <div key={product.id} className={`card card-hover group ${willNotFit ? 'opacity-90' : ''}`}>
                  <div className="relative h-56 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-20 w-20 text-primary-400" />
                      </div>
                    )}

                    {/* Hamper Fit Warning Badge */}
                    {willNotFit && (
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-red-500 text-white shadow-lg animate-pulse">
                          ⚠️ Won't Fit in Hamper
                        </span>
                      </div>
                    )}

                    {product.isCustomizable && !willNotFit && (
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-primary shadow-md">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Customizable
                        </span>
                      </div>
                    )}
                    {product.productType === 'PREDEFINED_HAMPER' && (
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-secondary shadow-md">
                          Ready Hamper
                        </span>
                      </div>
                    )}
                  </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Hamper Warning Message */}
                  {willNotFit && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-700 font-semibold">
                        {fitCheck.reason === 'capacity'
                          ? `📦 Hamper ${fitCheck.currentFill}% full - this won't fit!`
                          : `📏 Too large for ${fitCheck.boxName} box`}
                      </p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{product.price}</span>
                      {product.isCustomizable && product.customizationCharge > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +₹{product.customizationCharge} customization
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleProductClick(product)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                        willNotFit
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-primary-500 hover:bg-primary-600 text-white'
                      }`}
                    >
                      {willNotFit
                        ? 'Change Box'
                        : (product.customizationOptions || product.isCustomizable ? 'Customize' : 'Add to Cart')}
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* WhatsApp Communication Card - List View */}
            <div
              onClick={handleWhatsAppChat}
              className="card hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-64 h-48 md:h-auto bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MessageCircle className="h-16 w-16 mx-auto mb-2 animate-bounce" />
                    <Phone className="h-6 w-6 mx-auto" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-2xl text-green-700 group-hover:text-green-600 transition-colors">
                        Chat with Chinggizz on WhatsApp
                      </h3>
                      <span className="badge bg-white text-green-600 shadow-md font-semibold">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Need Help?
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Looking for something special? Not sure what to choose? Our team is here to help!
                      Chat with us directly on WhatsApp for personalized gift recommendations, custom orders,
                      and instant answers to all your questions.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center text-green-600 text-sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        <span>Instant Response</span>
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span>Personalized Recommendations</span>
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Custom Orders Welcome</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-green-700 font-semibold">
                      Available 24/7 for your queries
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Start Chat Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Cards - List View */}
            {filteredProducts.map(product => {
              const fitCheck = checkProductFitsInHamper(product);
              const willNotFit = !fitCheck.fits;

              return (
                <div key={product.id} className={`card hover:shadow-xl transition-all group ${willNotFit ? 'opacity-90' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-20 w-20 text-primary-400" />
                        </div>
                      )}

                      {/* Hamper Fit Warning Badge */}
                      {willNotFit && (
                        <div className="absolute top-3 left-3">
                          <span className="badge bg-red-500 text-white shadow-lg animate-pulse">
                            ⚠️ Won't Fit in Hamper
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-2xl group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex flex-col items-end space-y-2">
                            {product.isCustomizable && !willNotFit && (
                              <span className="badge badge-primary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Customizable
                              </span>
                            )}
                            {product.productType === 'PREDEFINED_HAMPER' && (
                              <span className="badge badge-secondary">
                                Ready Hamper
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Hamper Warning Message */}
                        {willNotFit && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 font-semibold mb-1">
                              {fitCheck.reason === 'capacity'
                                ? `📦 Your hamper box is ${fitCheck.currentFill}% full`
                                : `📏 Too large for your ${fitCheck.boxName} box`}
                            </p>
                            <p className="text-xs text-red-600">
                              {fitCheck.message}
                            </p>
                          </div>
                        )}

                        {product.category && (
                          <p className="text-sm text-gray-500 mb-2">
                            Category: <span className="font-medium text-primary-600">{product.category.name}</span>
                          </p>
                        )}
                      </div>
                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                        {product.isCustomizable && product.customizationCharge > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            +₹{product.customizationCharge} for customization
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleProductClick(product)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                          willNotFit
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'btn-primary'
                        }`}
                      >
                        {willNotFit
                          ? 'Change Box Size'
                          : (product.customizationOptions || product.isCustomizable ? 'Customize Product' : 'Add to Cart')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

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
