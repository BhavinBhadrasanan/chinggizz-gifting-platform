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
  // Initialize state from localStorage to prevent overwriting on mount
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('chinggizz_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart:', error);
      return [];
    }
  });

  const [hampers, setHampers] = useState(() => {
    try {
      const savedHampers = localStorage.getItem('chinggizz_hampers');
      return savedHampers ? JSON.parse(savedHampers) : [];
    } catch (error) {
      console.error('Failed to load hampers:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial mount)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('chinggizz_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Save hampers to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('chinggizz_hampers', JSON.stringify(hampers));
    }
  }, [hampers, isInitialized]);

  const addToCart = (product, quantity = 1, customization = null) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        // Mobile-friendly: Short and clear notification
        toast.success(`✓ Updated quantity`, { duration: 2000, icon: '🛒' });
        return updatedItems;
      } else {
        // Add new item
        // Mobile-friendly: Short and clear notification
        toast.success(`✓ Added to cart`, { duration: 2000, icon: '🛒' });
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
      console.log('🔍 removeFromCart called with:', { productId, customization });
      console.log('📦 Current cart items:', prevItems.length);
      console.log('📦 All cart items:', prevItems);

      // Normalize undefined to null for comparison
      const normalizedCustomization = customization === undefined ? null : customization;
      console.log('🔄 Normalized customization:', normalizedCustomization);

      const filtered = prevItems.filter((item) => {
        // Normalize item customization as well
        const normalizedItemCustomization = item.customization === undefined ? null : item.customization;

        // Detailed comparison logging
        const idMatch = item.id === productId;
        const customizationMatch = JSON.stringify(normalizedItemCustomization) === JSON.stringify(normalizedCustomization);

        console.log(`🔎 Checking item ${item.id}:`, {
          itemId: item.id,
          targetId: productId,
          idMatch,
          itemCustomization: normalizedItemCustomization,
          targetCustomization: normalizedCustomization,
          itemCustomizationJSON: JSON.stringify(normalizedItemCustomization),
          targetCustomizationJSON: JSON.stringify(normalizedCustomization),
          customizationMatch,
          shouldRemove: idMatch && customizationMatch,
          willKeep: !(idMatch && customizationMatch)
        });

        // Compare: if both ID and customization match, exclude this item (return false)
        return !(idMatch && customizationMatch);
      });

      console.log('📦 After filter:', filtered.length);
      console.log('📦 Items removed:', prevItems.length - filtered.length);

      // Only show toast if an item was actually removed
      if (filtered.length < prevItems.length) {
        toast.success('✓ Removed', { duration: 1500, icon: '🗑️' });
        console.log('✅ Item successfully removed');
      } else {
        console.log('❌ No item was removed - no match found');
        toast.error('Failed to remove item', { duration: 1500 });
      }

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
    setHampers([]);
    // Mobile-friendly: Short and clear notification
    toast.success('✓ Cart cleared', { duration: 2000, icon: '🛒' });
  };

  const addHamperToCart = (hamperData) => {
    setHampers((prevHampers) => {
      const newHamper = {
        id: Date.now(), // Unique ID for the hamper
        ...hamperData,
        addedAt: new Date().toISOString()
      };
      toast.success(`✓ ${hamperData.hamperName} added to cart!`, { duration: 2000, icon: '🎁' });
      return [...prevHampers, newHamper];
    });
  };

  const removeHamperFromCart = (hamperId) => {
    setHampers((prevHampers) => {
      const filtered = prevHampers.filter(hamper => hamper.id !== hamperId);
      toast.success('✓ Hamper removed', { duration: 1500, icon: '🗑️' });
      return filtered;
    });
  };

  const getCartTotal = () => {
    const itemsTotal = cartItems.reduce((total, item) => {
      // If customization data has totalPrice, use it (already includes base + options + customization charge)
      if (item.customization && typeof item.customization === 'object' && item.customization.totalPrice) {
        return total + parseFloat(item.customization.totalPrice) * item.quantity;
      }

      // Otherwise, calculate normally
      const itemPrice = parseFloat(item.price);
      const customizationCharge = item.customization ? parseFloat(item.customizationCharge || 0) : 0;
      return total + (itemPrice + customizationCharge) * item.quantity;
    }, 0);

    const hampersTotal = hampers.reduce((total, hamper) => {
      return total + parseFloat(hamper.grandTotal || 0);
    }, 0);

    return itemsTotal + hampersTotal;
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    hampers,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addHamperToCart,
    removeHamperFromCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

