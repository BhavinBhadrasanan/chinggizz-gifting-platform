import { useState, useEffect } from 'react';
import { X, Upload, ShoppingCart, Sparkles, Package, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCustomizationModalDesktop({ product, isOpen, onClose }) {
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* DESKTOP MODAL - Centered Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">

          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-xl font-bold">Customize Your Product</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content - Two Column Layout */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Column - Product Info */}
              <div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 sticky top-0">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg mb-4">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
                    {product.isCustomizable && product.customizationCharge > 0 && (
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                        +₹{product.customizationCharge} customization
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Options */}
              <div className="space-y-4">

                {/* Customization Options */}
                {optionsArray.length > 0 && optionsArray.map((optionGroup, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 flex items-center gap-3 rounded-t-xl">
                      <span className="bg-white text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-base font-bold text-white">Select {optionGroup.category}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {optionGroup.choices.map((choice, choiceIndex) => {
                        const isSelected = selectedOptions[optionGroup.category] === choice.name;
                        return (
                          <button
                            key={choiceIndex}
                            onClick={() => handleOptionSelect(optionGroup.category, choice.name)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all relative ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-primary-400 hover:shadow-md'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                ✓
                              </div>
                            )}
                            <div className="pr-8">
                              <div className="font-bold text-base text-gray-900 mb-1">{choice.name}</div>
                              {choice.description && (
                                <div className="text-sm text-gray-600 mb-2">{choice.description}</div>
                              )}
                              <div className="flex flex-wrap items-center gap-2">
                                {(choice.width || choice.height) && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {choice.width}×{choice.height} cm
                                  </span>
                                )}
                                {/* Hide price badges for Box Type category */}
                                {optionGroup.category !== 'Box Type' && (
                                  choice.price > 0 ? (
                                    <span className="text-sm bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">+₹{choice.price}</span>
                                  ) : (
                                    <span className="text-sm bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">Included</span>
                                  )
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Photo Upload */}
                {hasPhotoUpload && (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-3 flex items-center gap-3 rounded-t-xl">
                      <ImageIcon className="h-5 w-5 text-white" />
                      <span className="text-base font-bold text-white">Upload Photos</span>
                      <span className="text-sm text-white/80 ml-auto">(Optional)</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {Array.from({ length: requiredPhotos }).map((_, index) => {
                        const category = requiredPhotos === 2 ? (index === 0 ? 'Person 1' : 'Person 2') : 'Photo';
                        const uploadedImage = uploadedImages[category];

                        return (
                          <div key={index}>
                            {requiredPhotos === 2 && (
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {category}
                              </label>
                            )}
                            <label className="block cursor-pointer">
                              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
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
                                <Upload className={`h-8 w-8 mx-auto mb-2 ${uploadedImage ? 'text-green-600' : 'text-gray-400'}`} />
                                <p className={`text-sm font-bold mb-1 ${uploadedImage ? 'text-green-700' : 'text-gray-700'}`}>
                                  {uploadedImage ? uploadedImage.name : `Click to upload ${category}`}
                                </p>
                                <p className="text-xs text-gray-500">PNG/JPG (Max 5MB)</p>
                              </div>
                            </label>
                            {uploadedImage && (
                              <div className="mt-3 flex items-center gap-3 bg-white rounded-lg p-3 border border-green-200">
                                <img
                                  src={uploadedImage.preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{uploadedImage.name}</p>
                                  <p className="text-xs text-green-600">✓ Uploaded successfully</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 rounded-t-xl">
                    <span className="text-base font-bold text-white">Select Quantity</span>
                  </div>
                  <div className="p-4 flex items-center justify-center gap-6">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center font-bold text-xl transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 text-center text-3xl font-bold border-2 border-primary-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white flex items-center justify-center font-bold text-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer - Add to Cart */}
          <div className="flex-shrink-0 bg-gray-50 border-t-2 border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Price</p>
                  <p className="text-3xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Quantity</p>
                  <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-98 transition-all duration-200 flex items-center gap-3"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

