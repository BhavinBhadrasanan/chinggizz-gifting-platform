import { useState, useEffect } from 'react';
import { X, Upload, ShoppingCart, Sparkles, Package, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCustomizationModalMobile({ product, isOpen, onClose }) {
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

  // Handle both flat structure and nested structure
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

    optionsArray.forEach((optionGroup) => {
      const selectedChoice = selectedOptions[optionGroup.category];
      if (selectedChoice) {
        const choice = optionGroup.choices.find(c => c.name === selectedChoice);
        if (choice && choice.price) {
          optionsPrice += parseFloat(choice.price);
        }
      }
    });

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
    const missingOptions = optionsArray.filter(optionGroup =>
      !selectedOptions[optionGroup.category]
    );

    if (missingOptions.length > 0) {
      toast.error(`Please select: ${missingOptions.map(o => o.category).join(', ')}`);
      return;
    }

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

    const customizationData = {
      selectedOptions,
      uploadedImages: Object.keys(uploadedImages).reduce((acc, key) => {
        acc[key] = uploadedImages[key].name;
        return acc;
      }, {}),
      totalPrice,
      customizationType: customizationOptions?.type,
      dimensions: customDimensions
    };

    addToCart(product, quantity, customizationData);
    // Note: Toast notification is handled by CartContext for consistency
    // No need for duplicate notification here

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* MOBILE MODAL - Bottom Sheet Style */}
      <div className="flex min-h-full items-end justify-center p-0">
        <div className="relative bg-white rounded-t-3xl shadow-2xl w-full max-h-[85vh] flex flex-col">

          {/* Header - Compact & Sticky */}
          <div className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center justify-between rounded-t-3xl sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-bold">Customize</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4">

            {/* Product Info - Enhanced */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 border-2 border-gray-200 shadow-sm">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md flex-shrink-0 ring-2 ring-primary-100">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
                  {product.isCustomizable && product.customizationCharge > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">
                      +₹{product.customizationCharge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customization Options - Enhanced */}
            {optionsArray.length > 0 && optionsArray.map((optionGroup, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 flex items-center gap-2">
                  <span className="bg-white text-primary-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-base font-bold text-white">Select {optionGroup.category}</span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2.5">
                  {optionGroup.choices.map((choice, choiceIndex) => {
                    const isSelected = selectedOptions[optionGroup.category] === choice.name;
                    return (
                      <button
                        key={choiceIndex}
                        onClick={() => handleOptionSelect(optionGroup.category, choice.name)}
                        className={`p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? 'border-primary-600 bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg'
                            : 'border-gray-400 bg-white hover:border-primary-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-sm font-bold truncate ${
                            isSelected ? 'text-white' : 'text-gray-800'
                          }`}>
                            {choice.name}
                          </span>
                          {isSelected && (
                            <span className="bg-white text-primary-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        {choice.price > 0 && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                            isSelected
                              ? 'bg-white text-primary-600'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            +₹{choice.price}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Photo Upload Section */}
            {hasPhotoUpload && (
              <div className="bg-white rounded-xl shadow-sm border-2 border-pink-200">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-3 py-2 flex items-center gap-2 rounded-t-xl">
                  <ImageIcon className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">Upload Photo (Optional)</span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 mb-2">Upload photo (optional)</p>
                  {Array.from({ length: requiredPhotos }).map((_, index) => {
                    const category = requiredPhotos === 2 ? (index === 0 ? 'Person 1' : 'Person 2') : 'Photo';
                    const uploadedImage = uploadedImages[category];

                    return (
                      <div key={index} className="mb-2 last:mb-0">
                        <label className="block">
                          <div className={`border-2 border-dashed rounded-lg p-3 cursor-pointer transition-all ${
                            uploadedImage
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
                          }`}>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(e) => handleImageUpload(category, e)}
                              className="hidden"
                            />
                            <div className="flex items-center gap-2">
                              <Upload className={`h-5 w-5 ${uploadedImage ? 'text-green-600' : 'text-gray-400'}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold ${uploadedImage ? 'text-green-700' : 'text-gray-700'}`}>
                                  {uploadedImage ? uploadedImage.name : `Click to upload ${category}`}
                                </p>
                                <p className="text-xs text-gray-500">PNG/JPG (5MB)</p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector - Enhanced */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-green-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                <span className="text-base font-bold text-white">Select Quantity</span>
              </div>
              <div className="p-4 flex items-center justify-center gap-5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center font-bold text-xl transition-all active:scale-95 shadow-md"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center text-3xl font-bold border-2 border-primary-300 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white flex items-center justify-center font-bold text-xl transition-all active:scale-95 shadow-md"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Footer - Add to Cart - COMPACT VERSION */}
          <div className="flex-shrink-0 bg-white border-t-2 border-gray-200 shadow-lg p-3 pb-20">
            <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div>
                <p className="text-xs text-gray-600 font-medium">Total Price</p>
                <p className="text-xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-medium">Quantity</p>
                <p className="text-lg font-bold text-gray-900">{quantity}</p>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

