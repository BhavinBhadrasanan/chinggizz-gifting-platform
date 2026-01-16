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
        <div className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-slideUp sm:animate-fade-in">
          {/* Header - Mobile Optimized */}
          <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 sm:p-6 flex items-center justify-between z-10 shadow-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <h2 className="text-lg sm:text-2xl font-bold truncate">Customize Your Product</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-colors tap-target flex-shrink-0"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Product Info */}
            <div className="flex items-start space-x-6 mb-8 pb-6 border-b">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                  {product.isCustomizable && product.customizationCharge > 0 && (
                    <span className="text-sm text-gray-500">
                      +₹{product.customizationCharge} customization
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customization Options */}
            {optionsArray.length > 0 && (
              <div className="space-y-6 mb-8">
                {optionsArray.map((optionGroup, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                        {index + 1}
                      </span>
                      Select {optionGroup.category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {optionGroup.choices.map((choice, choiceIndex) => {
                        const isSelected = selectedOptions[optionGroup.category] === choice.name;
                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => handleOptionSelect(optionGroup.category, choice.name)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                : 'border-gray-200 hover:border-primary-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 mb-1">{choice.name}</div>
                                {choice.description && (
                                  <div className="text-sm text-gray-600 mb-2">{choice.description}</div>
                                )}
                                {choice.maxItems && (
                                  <div className="text-xs text-gray-500">Max {choice.maxItems} items</div>
                                )}
                                {(choice.width || choice.height) && (
                                  <div className="text-xs text-gray-500">
                                    Size: {choice.width}×{choice.height}{choice.depth ? `×${choice.depth}` : ''} cm
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                {choice.price > 0 ? (
                                  <span className="text-green-600 font-semibold">+₹{choice.price}</span>
                                ) : choice.price < 0 ? (
                                  <span className="text-red-600 font-semibold">₹{choice.price}</span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Included</span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Photo Upload Section */}
            {hasPhotoUpload && (
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Upload {requiredPhotos === 2 ? 'Photos' : 'Your Photo'} <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                </h4>
                {requiredPhotos === 2 ? (
                  <p className="text-sm text-gray-600 mb-4">
                    Upload 2 clear photos - one for each person (optional, can be added later)
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your photo for customization (optional, can be added later)
                  </p>
                )}
                <div className="space-y-4">
                  {/* First Photo Upload */}
                  <div>
                    {requiredPhotos === 2 && (
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Person 1 Photo
                      </label>
                    )}
                    <label className="block">
                      <div className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors bg-white">
                        <Upload className="h-12 w-12 text-primary-500 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">Click to upload {requiredPhotos === 2 ? 'first' : ''} image</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB - Clear face photo required</p>
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
            )}

            {/* Quantity Selector */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Quantity</h4>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-primary-500 font-bold text-gray-700"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-primary-500 font-bold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-3xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

