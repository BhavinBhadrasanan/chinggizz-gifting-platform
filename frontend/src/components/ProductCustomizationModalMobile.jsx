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
  const [showBoxPreview, setShowBoxPreview] = useState(false);
  const [previewType, setPreviewType] = useState(null); // 'boxType' or 'boxSize'

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

  // Get box type image URL - Using same images as HamperBuilderPage
  const getBoxTypeImage = (boxTypeName) => {
    const boxTypeImages = {
      'Closed Box': '/hamperboxtypes/Gift-Hamper-Box-For-Packaging-In-Bulk.webp',
      'Open Display Box': '/hamperboxtypes/Cover_3943e81e-f566-4397-a68a-a9539cb3008b.webp',
      'Transparent Box': '/hamperboxtypes/IMG20220924170938.webp',
      'Semi Transparent Box': '/hamperboxtypes/NCOYghLIT1AvPSwkPI4.webp',
      'Theme Based Hamper': '/hamperboxtypes/happiness-hamper-box-tearaja-3.webp'
    };
    return boxTypeImages[boxTypeName] || '/hamperboxtypes/Gift-Hamper-Box-For-Packaging-In-Bulk.webp';
  };

  // Get selected box size details for 3D preview
  const getSelectedBoxSize = () => {
    const boxSizeCategory = optionsArray.find(opt => opt.category === 'Box Size');
    const selectedSizeName = selectedOptions['Box Size'];
    if (boxSizeCategory && selectedSizeName) {
      return boxSizeCategory.choices.find(choice => choice.name === selectedSizeName);
    }
    return null;
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

    // Show box type image preview only
    if (category === 'Box Type') {
      setPreviewType('boxType');
      setShowBoxPreview(true);
      setTimeout(() => setShowBoxPreview(false), 3000); // Hide after 3 seconds
    }

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

            {/* Product Info - Compact */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-gray-700 line-clamp-1">{product.name}</h3>
                <span className="text-sm font-bold text-primary-600">₹{product.price}</span>
              </div>
            </div>

            {/* Box Preview Section */}
            {showBoxPreview && (
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-4 border-2 border-primary-200 shadow-lg animate-fadeIn">
                {previewType === 'boxType' && selectedOptions['Box Type'] && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary-600" />
                      <h4 className="text-sm font-bold text-primary-900">Box Type Preview</h4>
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md">
                      <img
                        src={getBoxTypeImage(selectedOptions['Box Type'])}
                        alt={selectedOptions['Box Type']}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-center text-primary-800">
                      {selectedOptions['Box Type']}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customization Options - Enhanced */}
            {optionsArray.length > 0 && optionsArray.map((optionGroup, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 flex items-center gap-2">
                  <span className="bg-white text-primary-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-base font-bold text-white">Select {optionGroup.category}</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {optionGroup.choices.map((choice, choiceIndex) => {
                    const isSelected = selectedOptions[optionGroup.category] === choice.name;
                    return (
                      <button
                        key={choiceIndex}
                        onClick={() => handleOptionSelect(optionGroup.category, choice.name)}
                        className={`relative p-4 rounded-2xl border-[3px] transition-all duration-300 active:scale-95 min-h-[80px] flex flex-col justify-center ${
                          isSelected
                            ? 'border-primary-600 bg-gradient-to-br from-primary-500 to-primary-600 shadow-xl shadow-primary-200'
                            : 'border-gray-300 bg-white hover:border-primary-400 hover:shadow-lg shadow-md'
                        }`}
                      >
                        {/* Checkmark Badge - Top Right */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold">✓</span>
                            </div>
                          </div>
                        )}

                        {/* Option Name */}
                        <div className="mb-2">
                          <span className={`text-base font-bold block text-center leading-tight ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}>
                            {choice.name}
                          </span>
                        </div>

                        {/* Price Badge - Hide for Box Type and Box Size categories */}
                        {choice.price > 0 && optionGroup.category !== 'Box Type' && optionGroup.category !== 'Box Size' && (
                          <div className="flex justify-center">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                              isSelected
                                ? 'bg-white text-primary-600 shadow-md'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                              +₹{choice.price}
                            </span>
                          </div>
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

