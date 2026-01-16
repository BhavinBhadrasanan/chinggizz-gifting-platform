import { useState, useEffect } from 'react';
import { X, Upload, ShoppingCart, Sparkles, Package, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCustomizationModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  useEffect(() => {
    if (product) {
      calculateTotalPrice();
    }
  }, [selectedOptions, quantity, product]);

  if (!isOpen || !product) return null;

  const customizationOptions = product.customizationOptions
    ? (typeof product.customizationOptions === 'string'
        ? JSON.parse(product.customizationOptions)
        : product.customizationOptions)
    : null;

  const hasPhotoUpload = customizationOptions?.hasPhotoUpload;

  // Helper function to get category label based on type
  const getCategoryLabel = (type) => {
    const labels = {
      'fragrance': 'Fragrance',
      'plant': 'Plant Type',
      'size': 'Size',
      'color': 'Color',
      'type': 'Type'
    };
    return labels[type] || 'Option';
  };

  // Handle both flat structure (scented candles, perfumes) and nested structure (hamper boxes, caricatures)
  const rawOptions = customizationOptions?.options || [];
  const optionsArray = rawOptions.length > 0 && !rawOptions[0].category
    ? [{
        category: getCategoryLabel(customizationOptions.type),
        choices: rawOptions
      }]
    : rawOptions;

  const calculateTotalPrice = () => {
    let basePrice = parseFloat(product.price);
    let optionsPrice = 0;

    // Add prices from selected options
    optionsArray.forEach((optionGroup) => {
      const selectedChoice = selectedOptions[optionGroup.category];
      if (selectedChoice) {
        const choice = optionGroup.choices.find(c => c.name === selectedChoice);
        if (choice && choice.price) {
          optionsPrice += parseFloat(choice.price);
        }
      }
    });

    // Add customization charge if applicable
    const customizationCharge = product.isCustomizable && product.customizationCharge 
      ? parseFloat(product.customizationCharge) 
      : 0;

    const total = (basePrice + optionsPrice + customizationCharge) * quantity;
    setTotalPrice(total);
  };

  const handleOptionSelect = (category, choiceName) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: choiceName
    }));

    // Clear uploaded images when changing caricature type
    if (category === 'Type' && customizationOptions?.type === 'caricature') {
      setUploadedImages({});
      toast.info('Please upload photos for the selected type');
    }
  };

  const handleImageUpload = (category, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  // Determine number of photos needed based on caricature type
  const getRequiredPhotos = () => {
    if (customizationOptions?.type === 'caricature') {
      const selectedType = selectedOptions['Type'];
      if (selectedType === 'Couple') {
        return 2; // Need 2 photos for couple
      }
      return 1; // Need 1 photo for individual
    }
    return 1; // Default: 1 photo for other products
  };

  const requiredPhotos = getRequiredPhotos();

  const handleAddToCart = () => {
    // Validate required options
    const missingOptions = optionsArray.filter(optionGroup =>
      !selectedOptions[optionGroup.category]
    );

    if (missingOptions.length > 0) {
      toast.error(`Please select: ${missingOptions.map(o => o.category).join(', ')}`);
      return;
    }

    // Photo upload is now OPTIONAL - no validation required
    // Users can add to cart with or without uploading photos

    // Extract dimensions from selected size option (if available)
    let customDimensions = null;
    if (selectedOptions['Size']) {
      const sizeOption = optionsArray
        .find(opt => opt.category === 'Size')
        ?.choices.find(choice => choice.name === selectedOptions['Size']);

      if (sizeOption) {
        customDimensions = {
          widthCm: sizeOption.width || product.widthCm,
          heightCm: sizeOption.height || product.heightCm,
          depthCm: sizeOption.depth || product.depthCm
        };
      }
    }

    // Prepare customization data
    const customizationData = {
      selectedOptions,
      uploadedImages: Object.keys(uploadedImages).reduce((acc, key) => {
        acc[key] = uploadedImages[key].name;
        return acc;
      }, {}),
      totalPrice,
      customizationType: customizationOptions?.type,
      dimensions: customDimensions // Include selected dimensions
    };

    // Add to cart with customization
    addToCart(product, quantity, customizationData);

    // Show success message
    if (hasPhotoUpload && Object.keys(uploadedImages).length === 0) {
      toast.success('Added to cart! You can upload photos later if needed.');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Mobile Optimized Bottom Sheet */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] animate-slideUp sm:animate-fade-in flex flex-col">
          {/* Header - Compact Mobile */}
          <div className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-2 sm:p-3 flex items-center justify-between z-10 shadow-lg rounded-t-3xl sm:rounded-t-2xl">
            <div className="flex items-center space-x-1.5 flex-1 min-w-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold truncate">Customize</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors tap-target flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide min-h-0">
            {/* Product Info Card - Clean & Compact */}
            <div className="bg-white border-b border-gray-200 p-2 sm:p-3">
              <div className="flex items-center gap-2">
                {/* Product Image - Visible */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white shadow-md flex-shrink-0 border border-primary-200">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details - Clear */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 leading-tight line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-bold text-primary-600">₹{product.price}</span>
                    {product.isCustomizable && product.customizationCharge > 0 && (
                      <span className="text-xs text-white bg-primary-600 px-1.5 py-0.5 rounded-full font-bold">
                        +₹{product.customizationCharge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Options Area - Clean Layout */}
            <div className="px-2 sm:px-3 py-2 sm:py-3">

            {/* Customization Options - Clean Cards */}
            {optionsArray.length > 0 && (
              <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3">
                {optionsArray.map((optionGroup, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
                    {/* Option Header - Clear */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-2 flex items-center gap-2">
                      <span className="bg-white text-primary-600 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white">Select {optionGroup.category}</span>
                    </div>

                    {/* Options Grid - Clean Layout */}
                    <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {optionGroup.choices.map((choice, choiceIndex) => {
                        const isSelected = selectedOptions[optionGroup.category] === choice.name;
                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => handleOptionSelect(optionGroup.category, choice.name)}
                            className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all tap-target relative ${
                              isSelected
                                ? 'border-primary-500 bg-white shadow-lg ring-2 ring-primary-200'
                                : 'border-gray-300 active:border-primary-400 sm:hover:border-primary-400 bg-white'
                            }`}
                          >
                            {/* Selection Indicator - Clear */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="flex items-start gap-3 pr-8">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm sm:text-base text-gray-900 mb-1">{choice.name}</div>
                                {choice.description && (
                                  <div className="text-xs sm:text-sm text-gray-600 mb-2">{choice.description}</div>
                                )}
                                <div className="flex flex-wrap items-center gap-2">
                                  {(choice.width || choice.height) && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                      {choice.width}×{choice.height} cm
                                    </span>
                                  )}
                                  {/* Price Badge - Clear */}
                                  {choice.price > 0 ? (
                                    <span className="text-sm bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">+₹{choice.price}</span>
                                  ) : choice.price < 0 ? (
                                    <span className="text-sm bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full">₹{choice.price}</span>
                                  ) : (
                                    <span className="text-sm bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">Free</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photo Upload Section - Clean */}
            {hasPhotoUpload && (
              <div className="bg-gray-50 rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 px-3 py-2 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-white">Upload Photo</span>
                  <span className="text-xs text-white/80 ml-auto">(Optional)</span>
                </div>
                <div className="p-3 sm:p-4">
                {requiredPhotos === 2 ? (
                  <p className="text-xs text-gray-600 mb-1.5">
                    Upload 2 photos
                  </p>
                ) : (
                  <p className="text-xs text-gray-600 mb-1.5">
                    Upload photo (optional)
                  </p>
                )}
                <div className="space-y-1.5">
                  {/* First Photo Upload - Ultra Compact */}
                  <div>
                    {requiredPhotos === 2 && (
                      <label className="block text-xs font-medium text-gray-700 mb-0.5">
                        Photo 1
                      </label>
                    )}
                    <label className="block">
                      <div className="border-2 border-dashed border-primary-300 rounded-lg p-2 sm:p-3 text-center cursor-pointer active:border-primary-500 sm:hover:border-primary-500 transition-colors bg-white tap-target">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mx-auto mb-0.5 sm:mb-1" />
                        <p className="text-xs text-gray-700 font-medium">Click to upload</p>
                        <p className="text-xs text-gray-500">PNG/JPG (5MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('photo1', e)}
                          className="hidden"
                        />
                      </div>
                    </label>
                    {uploadedImages.photo1 && (
                      <div className="mt-3 bg-white rounded-lg p-4 flex items-center space-x-4">
                        <img
                          src={uploadedImages.photo1.preview}
                          alt="Preview 1"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{uploadedImages.photo1.name}</p>
                          <p className="text-sm text-gray-500">Image uploaded successfully</p>
                        </div>
                        <button
                          onClick={() => setUploadedImages(prev => {
                            const newImages = { ...prev };
                            delete newImages.photo1;
                            return newImages;
                          })}
                          className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  </div>

                  {/* Second Photo Upload (for Couple Caricature) */}
                  {requiredPhotos === 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Person 2 Photo
                      </label>
                      <label className="block">
                        <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors bg-white">
                          <Upload className="h-12 w-12 text-primary-500 mx-auto mb-3" />
                          <p className="text-gray-700 font-medium mb-1">Click to upload second image</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 5MB - Clear face photo required</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload('photo2', e)}
                            className="hidden"
                          />
                        </div>
                      </label>
                      {uploadedImages.photo2 && (
                        <div className="mt-3 bg-white rounded-lg p-4 flex items-center space-x-4">
                          <img
                            src={uploadedImages.photo2.preview}
                            alt="Preview 2"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{uploadedImages.photo2.name}</p>
                            <p className="text-sm text-gray-500">Image uploaded successfully</p>
                          </div>
                          <button
                            onClick={() => setUploadedImages(prev => {
                              const newImages = { ...prev };
                              delete newImages.photo2;
                              return newImages;
                            })}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
              </div>
            )}

            {/* Quantity Selector - Compact */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-2 py-1.5">
                <span className="text-xs sm:text-sm font-bold text-white">Select Quantity</span>
              </div>
              <div className="p-2.5 sm:p-3">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 active:scale-95 sm:hover:scale-105 active:border-primary-500 sm:hover:border-primary-500 font-bold text-gray-700 tap-target flex items-center justify-center text-lg sm:text-xl shadow-md transition-all"
                  >
                    −
                  </button>
                  <div className="bg-primary-50 px-4 py-2 rounded-lg border-2 border-primary-300 min-w-[60px] text-center">
                    <span className="text-xl sm:text-2xl font-bold text-primary-600">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 border-2 border-primary-600 active:scale-95 sm:hover:scale-105 font-bold text-white tap-target flex items-center justify-center text-lg sm:text-xl shadow-md transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ADD TO CART - PROFESSIONAL STICKY FOOTER */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl -mx-2 sm:-mx-3 mt-4 z-40">
              <div className="p-3 sm:p-4 pb-20 sm:pb-4">
                {/* Total Price Display */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-0.5">Total Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 font-medium mb-0.5">Quantity</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{quantity}</p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-6 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            </div> {/* End scrollable options area */}
          </div> {/* End scrollable content */}
        </div>
      </div>
    </div>
  );
}

