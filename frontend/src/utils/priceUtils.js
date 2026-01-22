/**
 * Price Utility Functions
 * 
 * Provides dynamic discount calculation that changes daily
 * while keeping actual product prices intact.
 */

/**
 * Calculate daily discount percentage for a product
 * Returns a discount between 2% and 15% that changes daily
 * 
 * @param {number} productId - The product ID
 * @returns {number} Discount percentage (2-15)
 */
export const getDailyDiscount = (productId) => {
  // Get current date (YYYY-MM-DD format)
  const today = new Date();
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Create a seed from product ID and date
  // This ensures same product gets same discount on same day
  const seed = `${productId}-${dateString}`;
  
  // Simple hash function to generate pseudo-random number from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to positive number and get discount between 2-15
  const positiveHash = Math.abs(hash);
  const discount = 2 + (positiveHash % 14); // 2 to 15 (14 possible values)
  
  return discount;
};

/**
 * Calculate original price based on current price and discount
 * 
 * @param {number} currentPrice - The actual selling price
 * @param {number} discountPercent - The discount percentage
 * @returns {number} Original price before discount
 */
export const getOriginalPrice = (currentPrice, discountPercent) => {
  const price = parseFloat(currentPrice);
  const discount = parseFloat(discountPercent);
  
  // Calculate original price: currentPrice = originalPrice * (1 - discount/100)
  // So: originalPrice = currentPrice / (1 - discount/100)
  const originalPrice = price / (1 - discount / 100);
  
  return originalPrice;
};

/**
 * Get pricing display data for a product
 * 
 * @param {object} product - The product object with id and price
 * @returns {object} Object with originalPrice, currentPrice, discount, savings
 */
export const getPricingData = (product) => {
  const currentPrice = parseFloat(product.price);
  const discount = getDailyDiscount(product.id);
  const originalPrice = getOriginalPrice(currentPrice, discount);
  const savings = originalPrice - currentPrice;
  
  return {
    originalPrice: originalPrice.toFixed(2),
    currentPrice: currentPrice.toFixed(2),
    discount: discount,
    savings: savings.toFixed(2)
  };
};

