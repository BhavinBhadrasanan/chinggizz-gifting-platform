import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Upload, ImageIcon, Package, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../config/api';
import toast from 'react-hot-toast';
import ScrollButton from '../components/ScrollButton';
import { getPricingData } from '../utils/priceUtils';

export default function ProductCustomizationPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isCartOpen } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const previewTimeoutRef = useRef(null);
  const imageGalleryRef = useRef(null);

  // Scroll to product image when page loads (when navigating from other pages)
  useEffect(() => {
    // Add a small delay to ensure the page is fully rendered
    const scrollTimer = setTimeout(() => {
      if (imageGalleryRef.current) {
        imageGalleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [productId]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
        setTotalPrice(response.data.price);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, navigate]);

  // Calculate total price
  useEffect(() => {
    if (!product) return;

    const customizationOptions = product.customizationOptions
      ? (typeof product.customizationOptions === 'string'
          ? JSON.parse(product.customizationOptions)
          : product.customizationOptions)
      : null;

    // Check if this is a quantity-based pricing product (like Polaroid)
    const quantityOption = customizationOptions?.options?.find(opt => opt.category === 'Quantity');

    let price = 0;

    if (quantityOption && selectedOptions['Quantity']) {
      // For quantity-based pricing: base price + selected quantity price
      const selectedQuantityChoice = quantityOption.choices.find(c => c.name === selectedOptions['Quantity']);
      if (selectedQuantityChoice) {
        price = product.price + (selectedQuantityChoice.price || 0);
      } else {
        price = product.price;
      }
    } else {
      // Regular pricing: base price * quantity
      price = product.price * quantity;

      if (product.isCustomizable && product.customizationCharge) {
        price += product.customizationCharge * quantity;
      }

      // Add prices from other customization options
      Object.entries(selectedOptions).forEach(([category, choice]) => {
        if (category !== 'Quantity') { // Skip quantity option as it's handled above
          const categoryOptions = customizationOptions?.options?.find(opt => opt.category === category);
          const selectedChoice = categoryOptions?.choices?.find(c => c.name === choice);
          if (selectedChoice?.price) {
            price += selectedChoice.price * quantity;
          }
        }
      });
    }

    setTotalPrice(price);
  }, [selectedOptions, quantity, product]);

  // Early returns after all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Derived values
  const customizationOptions = product.customizationOptions
    ? (typeof product.customizationOptions === 'string'
        ? JSON.parse(product.customizationOptions)
        : product.customizationOptions)
    : null;

  // Check if product requires photo upload
  const hasPhotoUpload = customizationOptions?.type === 'caricature' ||
                         customizationOptions?.type === 'photo_frame' ||
                         customizationOptions?.type === 'photo_print' ||
                         customizationOptions?.type === 'photo' ||
                         customizationOptions?.type === 'personalized' ||
                         customizationOptions?.requiresPhoto === true ||
                         product.name?.toLowerCase().includes('photo') ||
                         product.name?.toLowerCase().includes('frame') ||
                         product.name?.toLowerCase().includes('caricature') ||
                         product.name?.toLowerCase().includes('personalized');

  // Product images array (main image + any additional images from customization options)
  const productImages = [
    product.imageUrl,
    ...(customizationOptions?.images || [])
  ].filter(Boolean);

  const handleOptionSelect = (category, choiceName) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: choiceName
    }));

    if (category === 'Type' && customizationOptions?.type === 'caricature') {
      setUploadedImages({});
      toast.info('Please upload photos for the selected type');
    }
  };

  const handleImageUpload = (category, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({
          ...prev,
          [category]: {
            file,
            preview: reader.result,
            name: file.name
          }
        }));
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const getRequiredPhotos = () => {
    if (customizationOptions?.type === 'caricature') {
      const selectedType = selectedOptions['Type'];
      if (selectedType === 'Couple') {
        return 2;
      }
      return 1;
    }
    return 1;
  };

  const requiredPhotos = getRequiredPhotos();

  const handleAddToCart = () => {
    // Validate required options
    if (customizationOptions?.options) {
      const missingOptions = customizationOptions.options
        .filter(opt => opt.required && !selectedOptions[opt.category]);

      if (missingOptions.length > 0) {
        toast.error(`Please select: ${missingOptions.map(o => o.category).join(', ')}`);
        return;
      }
    }

    // Validate photo uploads (only required for specific types)
    const photoRequired = customizationOptions?.type === 'caricature' ||
                         customizationOptions?.type === 'photo_frame' ||
                         customizationOptions?.type === 'photo_print' ||
                         customizationOptions?.requiresPhoto === true;

    if (hasPhotoUpload && photoRequired) {
      const uploadedCount = Object.keys(uploadedImages).length;
      if (uploadedCount < requiredPhotos) {
        toast.error(`Please upload ${requiredPhotos} photo(s)`);
        return;
      }
    }

    const customizationData = {
      selectedOptions,
      uploadedImages: Object.keys(uploadedImages).reduce((acc, key) => {
        acc[key] = uploadedImages[key].name;
        return acc;
      }, {}),
      totalPrice,
      customizationType: customizationOptions?.type
    };

    addToCart(product, quantity, customizationData);
    // Navigate to cart page and scroll to first item
    navigate('/cart', { state: { scrollToCart: true } });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-40 sm:pb-44 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>
          <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-700 bg-clip-text text-transparent flex items-center gap-1 sm:gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500" />
            <span className="hidden sm:inline">✨ Make It Yours!</span>
            <span className="sm:hidden">✨ Make It Yours!</span>
          </h1>
          <div className="w-12 sm:w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

          {/* Left Column - Product Images & Info */}
          <div className="space-y-3 sm:space-y-4">
            {/* Image Gallery */}
            <div ref={imageGalleryRef} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Main Image with Navigation */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />

                {/* Image Navigation - Only show if multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        prevImage();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => {
                        nextImage();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-6 sm:w-8'
                              : 'bg-white/50 hover:bg-white/75 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery - Mobile Horizontal Scroll */}
              {productImages.length > 1 && (
                <div className="p-3 sm:p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-700 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-2 leading-tight">{product.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{product.description}</p>

              <div className="mb-4 sm:mb-6">
                {(() => {
                  const pricing = getPricingData(product);

                  // Check if quantity-based pricing is active
                  const customizationOpts = product.customizationOptions
                    ? (typeof product.customizationOptions === 'string'
                        ? JSON.parse(product.customizationOptions)
                        : product.customizationOptions)
                    : null;
                  const quantityOption = customizationOpts?.options?.find(opt => opt.category === 'Quantity');
                  const isQuantityBased = quantityOption && selectedOptions['Quantity'];

                  // Calculate display price based on selection
                  let displayPrice = totalPrice;

                  return (
                    <>
                      {/* Original Price - Strikethrough */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
                          ₹{isQuantityBased ? (totalPrice * (1 + pricing.discount / 100)).toFixed(2) : pricing.originalPrice}
                        </span>
                        <span className="text-xs sm:text-sm font-bold bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full">
                          {pricing.discount}% OFF
                        </span>
                      </div>
                      {/* Current Price - Updates based on quantity selection */}
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        ₹{displayPrice.toFixed(2)}
                      </span>
                    </>
                  );
                })()}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-sm sm:text-base font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1.5 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 sm:p-3 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white rounded-lg transition-all active:scale-90 shadow-sm border border-gray-200 hover:border-transparent group"
                  >
                    <Minus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-white transition-colors" />
                  </button>
                  <span className="w-14 sm:w-16 text-center font-bold text-lg sm:text-xl text-gray-900 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 sm:p-3 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white rounded-lg transition-all active:scale-90 shadow-sm border border-gray-200 hover:border-transparent group"
                  >
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customization Options */}
          <div className="space-y-3 sm:space-y-4">

            {/* Customization Options */}
            {customizationOptions?.options && customizationOptions.options.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {customizationOptions.options.map((option, index) => (
                  <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-primary-200">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-3 sm:px-4 py-2.5 sm:py-3">
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span>{option.category}</span>
                        {option.required && (
                          <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-md font-semibold">Required</span>
                        )}
                      </h3>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {option.choices.map((choice, choiceIndex) => {
                          const isSelected = selectedOptions[option.category] === choice.name;

                          return (
                            <button
                              key={choiceIndex}
                              onClick={() => {
                                handleOptionSelect(option.category, choice.name);
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.border = '3px solid #a855f7';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.border = '3px solid #9ca3af';
                                }
                              }}
                              className={`relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-xl scale-105'
                                  : 'bg-white hover:shadow-lg active:scale-95'
                              }`}
                              style={{
                                border: isSelected
                                  ? '3px solid #a855f7'
                                  : '3px solid #9ca3af',
                                borderStyle: 'solid'
                              }}
                            >
                              {/* Icon/Image if available */}
                              {choice.icon && (
                                <div className="mb-2 flex justify-center">
                                  <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden ${
                                    isSelected ? 'ring-4 ring-white shadow-lg' : 'ring-2 ring-gray-200'
                                  }`}>
                                    <img
                                      src={choice.icon}
                                      alt={choice.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Choice Name */}
                              <div className="text-center">
                                <p className={`font-bold text-xs sm:text-sm md:text-base leading-tight ${
                                  isSelected ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {choice.name}
                                </p>

                                {/* Price if applicable */}
                                {choice.price > 0 && (
                                  <p className={`text-xs mt-1 font-medium ${
                                    isSelected ? 'text-white/90' : 'text-gray-500'
                                  }`}>
                                    +₹{choice.price}
                                  </p>
                                )}
                              </div>

                              {/* Selected Indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg">
                                  <Check className="h-4 w-4 text-primary-600" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photo Upload Section */}
            {hasPhotoUpload && (() => {
              const photoRequired = customizationOptions?.type === 'caricature' ||
                                   customizationOptions?.type === 'photo_frame' ||
                                   customizationOptions?.type === 'photo_print' ||
                                   customizationOptions?.requiresPhoto === true;

              return (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-pink-200">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-3 sm:px-4 py-2.5 sm:py-3">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>Upload Photos</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 sm:py-1 rounded-md font-semibold">
                        {photoRequired
                          ? `${requiredPhotos} photo${requiredPhotos > 1 ? 's' : ''} required`
                          : 'Optional'
                        }
                      </span>
                    </h3>
                  </div>

                <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                  {Array.from({ length: requiredPhotos }).map((_, index) => {
                    const category = requiredPhotos === 2 ? (index === 0 ? 'Person 1' : 'Person 2') : 'Photo';
                    const uploadedImage = uploadedImages[category];

                    return (
                      <div key={index}>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">{category}:</p>
                        <label className="block cursor-pointer">
                          <div
                            onMouseEnter={(e) => {
                              if (!uploadedImage) {
                                e.currentTarget.style.border = '3px dashed #a855f7';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!uploadedImage) {
                                e.currentTarget.style.border = '3px dashed #9ca3af';
                              }
                            }}
                            className={`rounded-xl p-4 sm:p-6 text-center transition-all duration-200 ${
                              uploadedImage
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-secondary-50 hover:shadow-md active:scale-98'
                            }`}
                            style={{
                              border: uploadedImage
                                ? '3px dashed #22c55e'
                                : '3px dashed #9ca3af',
                              borderStyle: 'dashed'
                            }}
                          >
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => handleImageUpload(category, e)}
                              className="hidden"
                            />

                            {uploadedImage ? (
                              <div className="space-y-2">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl overflow-hidden ring-4 ring-green-500 shadow-xl">
                                  <img src={uploadedImage.preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-green-700 truncate px-2">{uploadedImage.name}</p>
                                <div className="flex items-center justify-center gap-1">
                                  <Check className="h-4 w-4 text-green-600" />
                                  <p className="text-xs sm:text-sm text-green-600 font-semibold">Uploaded successfully</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
                                </div>
                                <p className="text-sm sm:text-base font-bold text-gray-800">
                                  Click to upload {category}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">PNG/JPG (Max 5MB)</p>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

            {/* Price Summary & Add to Cart - Desktop Sticky, Mobile Fixed Bottom */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-primary-100">
              <div className="space-y-5">
                {/* Price Breakdown */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border-2 border-primary-200">
                  <div className="space-y-2">
                    {(() => {
                      const customizationOpts = product.customizationOptions
                        ? (typeof product.customizationOptions === 'string'
                            ? JSON.parse(product.customizationOptions)
                            : product.customizationOptions)
                        : null;
                      const quantityOption = customizationOpts?.options?.find(opt => opt.category === 'Quantity');
                      const isQuantityBased = quantityOption && selectedOptions['Quantity'];

                      return (
                        <>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Base Price:</span>
                            <span className="font-semibold">₹{product.price}</span>
                          </div>
                          {isQuantityBased && selectedOptions['Quantity'] && (
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Selected:</span>
                              <span className="font-semibold">{selectedOptions['Quantity']}</span>
                            </div>
                          )}
                          {!isQuantityBased && (
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Quantity:</span>
                              <span className="font-semibold">×{quantity}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    <div className="border-t-2 border-primary-300 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700 text-lg">Total:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar - Hide when cart is open */}
      {!isCartOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-gray-200 shadow-2xl safe-area-bottom">
          <div className="px-2 py-2 sm:px-3 sm:py-2.5 pb-safe">
            {/* Compact Total Price Section - Amazon Style */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {/* Price Display */}
              <div className="flex items-center gap-2">
                {(() => {
                  const pricing = getPricingData(product);

                  // Check if quantity-based pricing is active
                  const customizationOpts = product.customizationOptions
                    ? (typeof product.customizationOptions === 'string'
                        ? JSON.parse(product.customizationOptions)
                        : product.customizationOptions)
                    : null;
                  const quantityOption = customizationOpts?.options?.find(opt => opt.category === 'Quantity');
                  const isQuantityBased = quantityOption && selectedOptions['Quantity'];

                  return (
                    <>
                      {/* Original Price - Strikethrough */}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 leading-none">MRP</span>
                        <span className="text-xs text-gray-400 line-through leading-tight">
                          ₹{isQuantityBased
                            ? (totalPrice * (1 + pricing.discount / 100)).toFixed(2)
                            : (pricing.originalPrice * quantity).toFixed(2)
                          }
                        </span>
                      </div>

                      {/* Current Total Price */}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-600 font-medium leading-none">Total</span>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Discount Badge */}
                      <div className="bg-green-100 px-1.5 py-0.5 rounded">
                        <span className="text-[10px] font-bold text-green-700">
                          {pricing.discount}% OFF
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Quantity Display - Only show for non-quantity-based products */}
              {(() => {
                const customizationOpts = product.customizationOptions
                  ? (typeof product.customizationOptions === 'string'
                      ? JSON.parse(product.customizationOptions)
                      : product.customizationOptions)
                  : null;
                const quantityOption = customizationOpts?.options?.find(opt => opt.category === 'Quantity');
                const isQuantityBased = quantityOption && selectedOptions['Quantity'];

                if (isQuantityBased) {
                  return (
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 leading-none">Selected</p>
                      <p className="text-xs font-bold text-gray-700 leading-tight">{selectedOptions['Quantity']}</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 leading-none">Quantity</p>
                      <p className="text-sm font-bold text-gray-700 leading-tight">×{quantity}</p>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Add to Cart Button - Compact */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* Scroll to Top/Bottom Button */}
      <ScrollButton />
    </div>
  );
}

