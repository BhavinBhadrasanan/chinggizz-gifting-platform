import { useState, useEffect, useRef } from 'react';
import { X, Upload, Package, Ruler, ImagePlus, Trash2 } from 'lucide-react';
import api from '../config/api';
import toast from 'react-hot-toast';

export default function ProductFormModal({ product, categories, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    productType: 'CUSTOMISED_ITEM',
    imageUrl: '',
    isCustomizable: false,
    customizationCharge: '0',
    stockQuantity: '',
    categoryId: '',
    widthCm: '',
    heightCm: '',
    depthCm: '',
    customizationOptions: '',
    specifications: '',
    additionalImages: '[]',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] = useState(false);
  const fileInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        productType: product.productType || 'CUSTOMISED_ITEM',
        imageUrl: product.imageUrl || '',
        isCustomizable: product.isCustomizable || false,
        customizationCharge: product.customizationCharge || '0',
        stockQuantity: product.stockQuantity || '',
        categoryId: product.categoryId || '',
        widthCm: product.widthCm || '',
        heightCm: product.heightCm || '',
        depthCm: product.depthCm || '',
        customizationOptions: product.customizationOptions || '',
        specifications: product.specifications || '',
        additionalImages: product.additionalImages || '[]',
        active: product.active !== undefined ? product.active : true
      });
      setImagePreview(product.imageUrl || '');

      // Load additional images
      try {
        const additionalImgs = product.additionalImages ? JSON.parse(product.additionalImages) : [];
        setAdditionalImagePreviews(additionalImgs);
      } catch (e) {
        setAdditionalImagePreviews([]);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
    setSelectedFile(null); // Clear file selection when URL is entered
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process selected file
  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear URL input when file is selected
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!selectedFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Image uploaded successfully');
      return response.data.imageUrl; // Return the uploaded image URL
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingAdditionalImage(true);
    const uploadedUrls = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/products/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedUrls.push(response.data.imageUrl);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        console.error(error);
      }
    }

    if (uploadedUrls.length > 0) {
      const newImages = [...additionalImagePreviews, ...uploadedUrls];
      setAdditionalImagePreviews(newImages);
      setFormData(prev => ({ ...prev, additionalImages: JSON.stringify(newImages) }));
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    }

    setUploadingAdditionalImage(false);
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = '';
    }
  };

  // Remove additional image
  const handleRemoveAdditionalImage = (index) => {
    const newImages = additionalImagePreviews.filter((_, i) => i !== index);
    setAdditionalImagePreviews(newImages);
    setFormData(prev => ({ ...prev, additionalImages: JSON.stringify(newImages) }));
    toast.success('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first if a file is selected
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // If upload failed, don't proceed
          setLoading(false);
          return;
        }
      }

      // Prepare data for API
      const apiData = {
        ...formData,
        imageUrl, // Use uploaded URL or existing URL
        price: parseFloat(formData.price),
        customizationCharge: parseFloat(formData.customizationCharge || 0),
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        widthCm: formData.widthCm ? parseFloat(formData.widthCm) : null,
        heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
        depthCm: formData.depthCm ? parseFloat(formData.depthCm) : null,
      };

      if (product) {
        // Update existing product
        await api.put(`/products/${product.id}`, apiData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await api.post('/products', apiData);
        toast.success('Product created successfully');
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8" />
            <h2 className="text-2xl font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-pink-500" />
                Basic Information
              </h3>
            </div>

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            {/* Specifications */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications (JSON format or plain text)
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                placeholder='Example: {"Material": "Ceramic", "Capacity": "350ml", "Care": "Dishwasher safe"}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter specifications as JSON object or plain text. This will be displayed in the product details tab.
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter stock quantity"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="CUSTOMISED_ITEM">Customized Item</option>
                <option value="EDIBLE_ITEM">Edible Item</option>
                <option value="PREDEFINED_HAMPER">Predefined Hamper</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Customization */}
            <div className="md:col-span-2 flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCustomizable"
                  checked={formData.isCustomizable}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Customizable</span>
              </label>

              {formData.isCustomizable && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customization Charge (₹)
                  </label>
                  <input
                    type="number"
                    name="customizationCharge"
                    value={formData.customizationCharge}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Dimensions Section */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-pink-500" />
                Product Dimensions (for 3D Hamper Simulation)
              </h3>
            </div>

            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (cm)
              </label>
              <input
                type="number"
                name="widthCm"
                value={formData.widthCm}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 8.0"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 10.0"
              />
            </div>

            {/* Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Depth (cm)
              </label>
              <input
                type="number"
                name="depthCm"
                value={formData.depthCm}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., 8.0"
              />
            </div>

            {/* Dimension Preview */}
            <div className="md:col-span-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> These dimensions will be used to accurately render the product in the 3D hamper builder.
                  The product will automatically scale to fit within the hamper box grid cells.
                </p>
                {formData.widthCm && formData.heightCm && formData.depthCm && (
                  <p className="text-sm text-blue-700 mt-2">
                    Current dimensions: <strong>{formData.widthCm} × {formData.heightCm} × {formData.depthCm} cm</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Image Section */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-pink-500" />
                Product Image
              </h3>
            </div>

            {/* File Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image File
              </label>

              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 bg-gray-50 hover:border-pink-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />

                {!imagePreview ? (
                  <div className="space-y-3">
                    <ImagePlus className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Click to upload
                      </label>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                      onError={() => {
                        setImagePreview('');
                        toast.error('Failed to load image.');
                      }}
                    />
                    <div className="flex justify-center space-x-3">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Change Image
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* OR Divider */}
            <div className="md:col-span-2 flex items-center space-x-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 font-medium">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                disabled={!!selectedFile}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedFile
                  ? 'Remove uploaded file to use URL instead'
                  : 'Enter a direct URL to the product image (e.g., from Imgur, Cloudinary, or your CDN)'}
              </p>
            </div>

            {/* Additional Images Section */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ImagePlus className="h-5 w-5 mr-2 text-primary-500" />
                Additional Images (Different Angles)
              </h3>
            </div>

            {/* Additional Images Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Multiple Images
              </label>

              <div className="space-y-4">
                {/* Upload Button */}
                <div>
                  <input
                    ref={additionalImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesSelect}
                    className="hidden"
                    id="additional-images-upload"
                  />
                  <label
                    htmlFor="additional-images-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors ${
                      uploadingAdditionalImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                      {uploadingAdditionalImage ? 'Uploading...' : 'Add More Images'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload images from different angles (PNG, JPG up to 5MB each)
                  </p>
                </div>

                {/* Image Previews Grid */}
                {additionalImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {additionalImagePreviews.map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {additionalImagePreviews.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <ImagePlus className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No additional images yet</p>
                    <p className="text-xs text-gray-400 mt-1">Upload images to show product from different angles</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customization Options (JSON) */}
            {formData.isCustomizable && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customization Options (JSON)
                </label>
                <textarea
                  name="customizationOptions"
                  value={formData.customizationOptions}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"type": "caricature", "options": [...]}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter customization options in JSON format (optional)
                </p>
              </div>
            )}

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

