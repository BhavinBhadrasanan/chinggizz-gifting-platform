import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chinggizz_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chinggizz_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, customization = null) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`Added ${product.name} to cart`);
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            productType: product.productType,
            isCustomizable: product.isCustomizable,
            customizationCharge: product.customizationCharge || 0,
            quantity,
            customization,
            // Include product dimensions (use customized dimensions if available)
            widthCm: customization?.dimensions?.widthCm || product.widthCm,
            heightCm: customization?.dimensions?.heightCm || product.heightCm,
            depthCm: customization?.dimensions?.depthCm || product.depthCm,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, customization = null) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter(
        (item) => !(item.id === productId && JSON.stringify(item.customization) === JSON.stringify(customization))
      );
      toast.success('Item removed from cart');
      return filtered;
    });
  };

  const updateQuantity = (productId, quantity, customization = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, customization);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && JSON.stringify(item.customization) === JSON.stringify(customization)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // If customization data has totalPrice, use it (already includes base + options + customization charge)
      if (item.customization && typeof item.customization === 'object' && item.customization.totalPrice) {
        return total + parseFloat(item.customization.totalPrice) * item.quantity;
      }

      // Otherwise, calculate normally
      const itemPrice = parseFloat(item.price);
      const customizationCharge = item.customization ? parseFloat(item.customizationCharge || 0) : 0;
      return total + (itemPrice + customizationCharge) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

