import html2canvas from 'html2canvas';

/**
 * Capture screenshot of the 3D hamper view
 * @param {HTMLElement} canvasElement - The canvas element containing the 3D scene
 * @returns {Promise<string>} - Base64 encoded image data
 */
export const captureHamperScreenshot = async (canvasElement) => {
  try {
    if (!canvasElement) {
      console.error('Canvas element not found');
      return null;
    }

    // Wait a bit for the 3D scene to fully render
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture the canvas using html2canvas
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#f5f5f5',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Convert to base64
    const base64Image = canvas.toDataURL('image/png');
    return base64Image;
  } catch (error) {
    console.error('Error capturing hamper screenshot:', error);
    return null;
  }
};

/**
 * Prepare hamper data for order submission
 * @param {Object} selectedBox - The selected hamper box
 * @param {Array} placedItems - Array of placed items with positions
 * @param {string} hamperName - Custom name for the hamper
 * @param {string} screenshotBase64 - Base64 encoded screenshot
 * @returns {Object} - Formatted hamper data
 */
export const prepareHamperData = (selectedBox, placedItems, hamperName, screenshotBase64) => {
  return {
    hamperBoxId: selectedBox.id,
    hamperBoxName: selectedBox.name,
    hamperBoxPrice: selectedBox.price,
    hamperName: hamperName || 'Custom Hamper',
    screenshot: screenshotBase64,
    items: placedItems.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      position: item.position,
      rotation: item.rotation ? {
        needsRotation: item.rotation.needsRotation,
        rotationAxis: item.rotation.rotationAxis,
        rotationAngle: item.rotation.rotationAngle
      } : null,
      dimensions: {
        widthCm: item.widthCm,
        heightCm: item.heightCm,
        depthCm: item.depthCm
      }
    })),
    boxDetails: {
      dimensions: selectedBox.dimensions,
      dimensionsCm: selectedBox.dimensionsCm,
      capacity: selectedBox.capacity,
      gridSize: selectedBox.gridSize
    },
    totalItems: placedItems.length,
    itemsTotal: placedItems.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0),
    boxPrice: selectedBox.price,
    grandTotal: placedItems.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0) + selectedBox.price
  };
};

/**
 * Convert base64 to blob for file upload
 * @param {string} base64 - Base64 encoded image
 * @returns {Blob} - Image blob
 */
export const base64ToBlob = (base64) => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

