import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Package, ShoppingBag, ArrowRight, ArrowLeft, Box, RotateCcw, Eye, Move, Plus, Trash2, AlertCircle, Check, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import HamperScene3D from '../components/HamperScene3D';
import HamperPreview3D from '../components/HamperPreview3D';
import ConfirmationModal from '../components/ConfirmationModal';
import ErrorNotificationModal from '../components/ErrorNotificationModal';
import ProductControlPanel from '../components/ProductControlPanel';

// Hamper Boxes Configuration
const HAMPER_BOXES = [
  {
    id: 1,
    name: 'Small',
    description: 'Perfect for 3-6 items',
    price: 199,
    capacity: 6,
    dimensions: '8" × 6" × 3"',
    dimensionsCm: '20 × 15 × 8 cm',
    dimensionsInch: { length: 8, width: 6, height: 3 },
    lengthCm: 20,
    widthCm: 15,
    heightCm: 8,
    gridSize: { rows: 2, cols: 3 },
    color: 'from-amber-100 to-amber-200',
    borderColor: 'border-amber-400',
    bestUsedFor: 'Chocolates, sweets, mini gifts',
  },
  {
    id: 2,
    name: 'Small-Medium',
    description: 'Great for 6-8 items',
    price: 249,
    capacity: 8,
    dimensions: '9" × 7" × 4"',
    dimensionsCm: '23 × 18 × 10 cm',
    dimensionsInch: { length: 9, width: 7, height: 4 },
    lengthCm: 23,
    widthCm: 18,
    heightCm: 10,
    gridSize: { rows: 2, cols: 4 },
    color: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-400',
    bestUsedFor: 'Dry fruits (250-500g), candles',
  },
  {
    id: 3,
    name: 'Medium',
    description: 'Ideal for 9 items',
    price: 299,
    capacity: 9,
    dimensions: '10" × 8" × 4"',
    dimensionsCm: '25 × 20 × 10 cm',
    dimensionsInch: { length: 10, width: 8, height: 4 },
    lengthCm: 25,
    widthCm: 20,
    heightCm: 10,
    gridSize: { rows: 3, cols: 3 },
    color: 'from-rose-100 to-rose-200',
    borderColor: 'border-rose-400',
    bestUsedFor: 'Dry fruits (500g-1kg), wine bottles',
  },
  {
    id: 4,
    name: 'Large',
    description: 'Best for 12 items',
    price: 399,
    capacity: 12,
    dimensions: '12" × 10" × 5"',
    dimensionsCm: '30 × 25 × 13 cm',
    dimensionsInch: { length: 12, width: 10, height: 5 },
    lengthCm: 30,
    widthCm: 25,
    heightCm: 13,
    gridSize: { rows: 3, cols: 4 },
    color: 'from-blue-100 to-blue-200',
    borderColor: 'border-blue-400',
    bestUsedFor: 'Large dry fruits, multiple bottles',
  },
];

export default function HamperBuilderPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Load saved hamper state from localStorage on mount
  const loadSavedHamperState = () => {
    try {
      const savedState = localStorage.getItem('hamperBuilderState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // If selectedBox exists, ensure it has the required properties by finding it in HAMPER_BOXES
        let selectedBox = null;
        if (parsed.selectedBox && parsed.selectedBox.id) {
          selectedBox = HAMPER_BOXES.find(box => box.id === parsed.selectedBox.id) || null;
        }
        return {
          step: parsed.step || 1,
          selectedBox: selectedBox,
          placedItems: parsed.placedItems || [],
          hamperName: parsed.hamperName || 'My Custom Hamper'
        };
      }
    } catch (error) {
      console.error('Error loading hamper state:', error);
    }
    return {
      step: 1,
      selectedBox: null,
      placedItems: [],
      hamperName: 'My Custom Hamper'
    };
  };

  const savedState = loadSavedHamperState();
  const [step, setStep] = useState(savedState.step);
  const [selectedBox, setSelectedBox] = useState(savedState.selectedBox);
  const [placedItems, setPlacedItems] = useState(savedState.placedItems);
  const [selectedItemToPlace, setSelectedItemToPlace] = useState(null);
  const [hamperName, setHamperName] = useState(savedState.hamperName);
  const [showBoxChangeModal, setShowBoxChangeModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSpotIndex, setHoveredSpotIndex] = useState(null);
  const [selectedItemForControls, setSelectedItemForControls] = useState(null); // For game controls

  // Error notification modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({ title: '', message: '', action: null });

  // Save hamper state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      step,
      selectedBox,
      placedItems,
      hamperName
    };
    localStorage.setItem('hamperBuilderState', JSON.stringify(stateToSave));
  }, [step, selectedBox, placedItems, hamperName]);

  // Show welcome back message if returning with saved items
  useEffect(() => {
    if (savedState.placedItems.length > 0) {
      toast.success(
        `Welcome back! Your hamper with ${savedState.placedItems.length} item${savedState.placedItems.length !== 1 ? 's' : ''} has been restored.`,
        { duration: 4000, icon: '🎉' }
      );
    }
  }, []); // Only run once on mount

  // Keyboard controls for selected item
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItemForControls) return;

      // Prevent default arrow key scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          handleControlMove('up');
          break;
        case 'ArrowDown':
          handleControlMove('down');
          break;
        case 'ArrowLeft':
          handleControlMove('left');
          break;
        case 'ArrowRight':
          handleControlMove('right');
          break;
        case 'r':
        case 'R':
          handleControlRotate();
          break;
        case 't':
        case 'T':
          handleControlRotateDirection();
          break;
        case 'Delete':
        case 'Backspace':
          handleControlDelete();
          break;
        case 'Escape':
          setSelectedItemForControls(null);
          setSelectedItemToPlace(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemForControls, placedItems, selectedBox]);

  const handleBoxSelect = (box) => {
    // If changing box, keep items that still fit in the new box
    if (placedItems.length > 0) {
      const itemsThatFit = placedItems.filter((item, index) => {
        // Check if item position is within new box capacity
        return index < box.capacity;
      });

      if (itemsThatFit.length < placedItems.length) {
        toast.warning(`${placedItems.length - itemsThatFit.length} item(s) removed - too many for new box size`);
      }

      setPlacedItems(itemsThatFit);
    }

    setSelectedBox(box);
    setSelectedItemToPlace(null);
    setStep(2);
    toast.success(`${box.name} box selected!`);
  };

  const handleReset = () => {
    setPlacedItems([]);
    setSelectedItemToPlace(null);
    toast.info('Hamper reset');
  };

  const handleClearHamper = () => {
    setShowClearConfirmModal(true);
  };

  const confirmClearHamper = () => {
    setStep(1);
    setSelectedBox(null);
    setPlacedItems([]);
    setSelectedItemToPlace(null);
    setHamperName('My Custom Hamper');
    localStorage.removeItem('hamperBuilderState');
    toast.success('🎉 Hamper cleared! Starting fresh.', {
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '600'
      }
    });
  };

  const handleChangeBoxFromModal = (newBox) => {
    const currentItems = [...placedItems];
    handleBoxSelect(newBox);
    setShowBoxChangeModal(false);

    if (currentItems.length > 0) {
      toast.success(`Changed to ${newBox.name} box! Your items have been preserved.`, {
        duration: 3000,
        icon: '📦'
      });
    }
  };

  // Enhanced dimension-based fit calculation with volume checking and rotation detection
  const canItemFitInBox = (item) => {
    if (!selectedBox) return false;

    // Get box dimensions in cm - USE CONSISTENT DIMENSIONS FROM selectedBox
    const boxWidthCm = selectedBox.lengthCm || 20;
    const boxDepthCm = selectedBox.widthCm || 15;
    const boxHeightCm = selectedBox.heightCm || 8;
    const boxVolumeCm3 = boxWidthCm * boxDepthCm * boxHeightCm;

    // Get item dimensions (default to 5cm if not specified)
    const itemWidthCm = parseFloat(item.widthCm) || 5;
    const itemDepthCm = parseFloat(item.depthCm) || 5;
    const itemHeightCm = parseFloat(item.heightCm) || 5;

    // Check if item dimensions fit in ANY orientation (including laying on side)
    // Create sorted arrays of dimensions to check all possible orientations
    const itemDims = [itemWidthCm, itemDepthCm, itemHeightCm].sort((a, b) => a - b);
    const boxDims = [boxWidthCm, boxDepthCm, boxHeightCm].sort((a, b) => a - b);

    // If the smallest item dimension > largest box dimension, it won't fit
    // Check if item can fit when both dimensions are sorted (smallest to largest)
    const canFitInAnyOrientation =
      itemDims[0] <= boxDims[0] &&
      itemDims[1] <= boxDims[1] &&
      itemDims[2] <= boxDims[2];

    if (!canFitInAnyOrientation) {
      return false; // Item is physically too large in all orientations
    }

    // Calculate current volume usage
    const currentVolume = placedItems.reduce((total, placedItem) => {
      const w = parseFloat(placedItem.widthCm) || 5;
      const d = parseFloat(placedItem.depthCm) || 5;
      const h = parseFloat(placedItem.heightCm) || 5;
      return total + (w * d * h);
    }, 0);

    // Calculate new item volume
    const newItemVolume = itemWidthCm * itemDepthCm * itemHeightCm;

    // Apply packing efficiency factor (same as in getBoxFillPercentage)
    const packingEfficiencyFactor = 1.4; // Accounts for ~30% wasted space
    const totalVolumeAfterAdding = (currentVolume + newItemVolume) * packingEfficiencyFactor;
    const volumePercentage = (totalVolumeAfterAdding / boxVolumeCm3) * 100;

    if (volumePercentage > 100) {
      return false; // Box would be too full (changed from 85% to 100% since we already account for packing)
    }

    // Also check capacity limit as a safety measure
    if (placedItems.length >= selectedBox.capacity) {
      return false;
    }

    return true;
  };

  // Check if item can fit in a specific orientation
  const canItemFitInOrientation = (item, isRotated = false) => {
    if (!selectedBox) return false;

    const boxHeightCm = selectedBox.heightCm || 8;
    const boxWidthCm = selectedBox.lengthCm || 20;
    const boxDepthCm = selectedBox.widthCm || 15;

    const itemWidthCm = parseFloat(item.widthCm) || 5;
    const itemDepthCm = parseFloat(item.depthCm) || 5;
    const itemHeightCm = parseFloat(item.heightCm) || 5;

    if (isRotated) {
      // When rotated (lying on side), height becomes width/depth
      // Check if rotated dimensions fit
      const canLayOnWidth = itemWidthCm <= boxHeightCm && itemHeightCm <= boxWidthCm && itemDepthCm <= boxDepthCm;
      const canLayOnDepth = itemDepthCm <= boxHeightCm && itemHeightCm <= boxDepthCm && itemWidthCm <= boxWidthCm;
      return canLayOnWidth || canLayOnDepth;
    } else {
      // Standing upright
      return itemWidthCm <= boxWidthCm && itemDepthCm <= boxDepthCm && itemHeightCm <= boxHeightCm;
    }
  };

  // Determine if item needs to be rotated (laid on side) to fit in box
  const getItemRotationInfo = (item, forceRotation = null) => {
    if (!selectedBox) return { needsRotation: false, rotationAxis: null, reason: '' };

    const boxHeightCm = selectedBox.heightCm || 8;
    const boxWidthCm = selectedBox.lengthCm || 20;
    const boxDepthCm = selectedBox.widthCm || 15;

    const itemWidthCm = parseFloat(item.widthCm) || 5;
    const itemDepthCm = parseFloat(item.depthCm) || 5;
    const itemHeightCm = parseFloat(item.heightCm) || 5;

    // If user manually set rotation preference, use that
    if (forceRotation !== null) {
      if (forceRotation === false) {
        // User wants standing position
        const canStand = itemWidthCm <= boxWidthCm && itemDepthCm <= boxDepthCm && itemHeightCm <= boxHeightCm;
        if (canStand) {
          return { needsRotation: false, rotationAxis: null, reason: '', canStand: true };
        } else {
          return {
            needsRotation: false,
            rotationAxis: null,
            reason: `Item is ${itemHeightCm}cm tall but box is only ${boxHeightCm}cm. Cannot stand upright.`,
            canStand: false,
            cannotFit: true
          };
        }
      } else {
        // User wants lying position
        // When laying on width side: width→height, height→width, depth stays
        const canLayOnWidth = itemWidthCm <= boxHeightCm && itemHeightCm <= boxWidthCm && itemDepthCm <= boxDepthCm;
        // When laying on depth side: depth→height, height→depth, width stays
        const canLayOnDepth = itemDepthCm <= boxHeightCm && itemHeightCm <= boxDepthCm && itemWidthCm <= boxWidthCm;

        console.log('🔍 Checking laydown options:');
        console.log(`  Item dimensions: W=${itemWidthCm}, H=${itemHeightCm}, D=${itemDepthCm}`);
        console.log(`  Box dimensions: W=${boxWidthCm}, H=${boxHeightCm}, D=${boxDepthCm}`);
        console.log(`  Can lay on width? ${canLayOnWidth} (W:${itemWidthCm}≤${boxHeightCm}, H:${itemHeightCm}≤${boxWidthCm}, D:${itemDepthCm}≤${boxDepthCm})`);
        console.log(`  Can lay on depth? ${canLayOnDepth} (D:${itemDepthCm}≤${boxHeightCm}, H:${itemHeightCm}≤${boxDepthCm}, W:${itemWidthCm}≤${boxWidthCm})`);

        if (canLayOnWidth) {
          return {
            needsRotation: true,
            rotationAxis: 'width',
            reason: `Laying on its side (user preference)`,
            originalHeight: itemHeightCm,
            newHeight: itemWidthCm,
            userChoice: true
          };
        } else if (canLayOnDepth) {
          return {
            needsRotation: true,
            rotationAxis: 'depth',
            reason: `Laying on its side (user preference)`,
            originalHeight: itemHeightCm,
            newHeight: itemDepthCm,
            userChoice: true
          };
        } else {
          console.log('❌ Cannot lay down in any orientation');
          return {
            needsRotation: true,
            rotationAxis: null,
            reason: `Item cannot fit when laid on side.`,
            cannotFit: true
          };
        }
      }
    }

    // Auto-detect: Check if item is taller than box height
    const isTooTall = itemHeightCm > boxHeightCm;
    const canStandUpright = itemWidthCm <= boxWidthCm && itemDepthCm <= boxDepthCm && itemHeightCm <= boxHeightCm;

    console.log(`📦 Auto-detect rotation for ${item.name}:`);
    console.log(`  Item: W=${itemWidthCm}, H=${itemHeightCm}, D=${itemDepthCm}`);
    console.log(`  Box: W=${boxWidthCm}, H=${boxHeightCm}, D=${boxDepthCm}`);
    console.log(`  Too tall? ${isTooTall}, Can stand? ${canStandUpright}`);

    // Check if this is a flat item (like watches, cards, frames) that should be laid down by default
    // A flat item is one where the height is significantly smaller than width or depth
    const isFlatItem = itemHeightCm <= 5 && (itemWidthCm > itemHeightCm || itemDepthCm > itemHeightCm);
    const isWatchOrAccessory = item.name?.toLowerCase().includes('watch') ||
                                item.name?.toLowerCase().includes('accessory') ||
                                item.name?.toLowerCase().includes('accessories');

    console.log(`  Is flat item? ${isFlatItem}, Is watch/accessory? ${isWatchOrAccessory}`);

    // For flat items or watches, prefer laying them down
    if ((isFlatItem || isWatchOrAccessory) && !isTooTall) {
      // When laying on width side: width→height, height→width, depth stays
      const canLayOnWidth = itemWidthCm <= boxHeightCm && itemHeightCm <= boxWidthCm && itemDepthCm <= boxDepthCm;
      // When laying on depth side: depth→height, height→depth, width stays
      const canLayOnDepth = itemDepthCm <= boxHeightCm && itemHeightCm <= boxDepthCm && itemWidthCm <= boxWidthCm;

      console.log(`  🔄 Flat item detected - attempting to lay down`);
      console.log(`  Can lay on width? ${canLayOnWidth}`);
      console.log(`  Can lay on depth? ${canLayOnDepth}`);

      if (canLayOnWidth) {
        console.log('✅ Laying flat item on width side');
        return {
          needsRotation: true,
          rotationAxis: 'width',
          reason: `Flat item - laid down for better presentation`,
          originalHeight: itemHeightCm,
          newHeight: itemWidthCm,
          autoDetected: true
        };
      } else if (canLayOnDepth) {
        console.log('✅ Laying flat item on depth side');
        return {
          needsRotation: true,
          rotationAxis: 'depth',
          reason: `Flat item - laid down for better presentation`,
          originalHeight: itemHeightCm,
          newHeight: itemDepthCm,
          autoDetected: true
        };
      }
    }

    if (canStandUpright && !isTooTall) {
      console.log('✅ Item can stand upright');
      return {
        needsRotation: false,
        rotationAxis: null,
        reason: '',
        canStand: true,
        canRotate: canItemFitInOrientation(item, true) // Can also be rotated if user wants
      };
    }

    // Item is too tall - check if it can fit when laid on its side
    // When laying on width side: width→height, height→width, depth stays
    const canLayOnWidth = itemWidthCm <= boxHeightCm && itemHeightCm <= boxWidthCm && itemDepthCm <= boxDepthCm;
    // When laying on depth side: depth→height, height→depth, width stays
    const canLayOnDepth = itemDepthCm <= boxHeightCm && itemHeightCm <= boxDepthCm && itemWidthCm <= boxWidthCm;

    console.log(`  Can lay on width? ${canLayOnWidth}`);
    console.log(`  Can lay on depth? ${canLayOnDepth}`);

    if (canLayOnWidth) {
      return {
        needsRotation: true,
        rotationAxis: 'width',
        reason: `Item is ${itemHeightCm}cm tall but box is only ${boxHeightCm}cm. Laying on its side to fit.`,
        originalHeight: itemHeightCm,
        newHeight: itemWidthCm,
        canStand: false,
        autoRotated: true
      };
    } else if (canLayOnDepth) {
      return {
        needsRotation: true,
        rotationAxis: 'depth',
        reason: `Item is ${itemHeightCm}cm tall but box is only ${boxHeightCm}cm. Laying on its side to fit.`,
        originalHeight: itemHeightCm,
        newHeight: itemDepthCm,
        canStand: false,
        autoRotated: true
      };
    }

    return {
      needsRotation: true,
      rotationAxis: null,
      reason: `Item is ${itemHeightCm}cm tall and cannot fit even when rotated.`,
      cannotFit: true,
      canStand: false
    };
  };

  // Calculate current box fill percentage with packing efficiency
  const getBoxFillPercentage = () => {
    if (!selectedBox) return 0;

    // Use the lengthCm, widthCm, heightCm properties
    const boxVolumeCm3 = (selectedBox.lengthCm || 0) * (selectedBox.widthCm || 0) * (selectedBox.heightCm || 0);

    if (boxVolumeCm3 === 0) return 0;

    const currentVolume = placedItems.reduce((total, item) => {
      const w = parseFloat(item.widthCm) || 5;
      const d = parseFloat(item.depthCm) || 5;
      const h = parseFloat(item.heightCm) || 5;
      return total + (w * d * h);
    }, 0);

    // Apply packing efficiency factor (items don't pack perfectly, there are gaps)
    // Typical packing efficiency for irregular items is 60-70%
    // So we multiply the actual volume by 1.4 to account for wasted space
    const packingEfficiencyFactor = 1.4; // Accounts for ~30% wasted space between items
    const effectiveVolume = currentVolume * packingEfficiencyFactor;

    const percentage = (effectiveVolume / boxVolumeCm3) * 100;
    console.log(`📊 Space Tracker: ${percentage.toFixed(1)}% (${currentVolume.toFixed(0)}cm³ actual, ${effectiveVolume.toFixed(0)}cm³ effective / ${boxVolumeCm3.toFixed(0)}cm³ box)`);
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Calculate item size relative to box (for visual feedback)
  const getItemSizeInfo = (item) => {
    if (!selectedBox) return null;

    // USE CONSISTENT DIMENSIONS FROM selectedBox
    const boxVolumeCm3 = (selectedBox.lengthCm || 20) * (selectedBox.widthCm || 15) * (selectedBox.heightCm || 8);

    const itemWidthCm = parseFloat(item.widthCm) || 5;
    const itemDepthCm = parseFloat(item.depthCm) || 5;
    const itemHeightCm = parseFloat(item.heightCm) || 5;
    const itemVolumeCm3 = itemWidthCm * itemDepthCm * itemHeightCm;

    const volumePercentage = ((itemVolumeCm3 / boxVolumeCm3) * 100).toFixed(1);

    return {
      width: itemWidthCm,
      depth: itemDepthCm,
      height: itemHeightCm,
      volume: itemVolumeCm3,
      volumePercentage,
      dimensions: `${itemWidthCm.toFixed(1)} × ${itemDepthCm.toFixed(1)} × ${itemHeightCm.toFixed(1)} cm`
    };
  };

  const handleItemClick = (item) => {
    if (!canItemFitInBox(item)) {
      const fillPercentage = getBoxFillPercentage();
      if (fillPercentage > 85) {
        toast.error('📦 Box is too full! Please remove items or change to a larger box.', {
          duration: 4000
        });
      } else {
        toast.error('⚠️ This item is too large for the current box. Try a larger box size!', {
          duration: 4000
        });
      }
      return;
    }
    setSelectedItemToPlace(item);
    toast.info(`Click a green spot in the box to place ${item.name}`);
  };

  const handleSpotClick = (position) => {
    if (selectedItemToPlace) {
      // Check if spot is occupied
      const occupyingItem = placedItems.find(item => item.position === position);

      if (occupyingItem && selectedItemToPlace.previousPosition !== undefined) {
        // SWAP functionality: swap the two items
        const newItems = placedItems.map(item => {
          if (item.position === position) {
            // Move occupying item to the previous position - preserve its rotation
            return { ...item, position: selectedItemToPlace.previousPosition };
          }
          return item;
        });

        // Add the selected item at the new position with rotation info
        const userRotationChoice = selectedItemToPlace.userRotationChoice;
        const rotationInfo = getItemRotationInfo(selectedItemToPlace, userRotationChoice);
        newItems.push({
          ...selectedItemToPlace,
          position,
          placedAt: new Date().toISOString(),
          rotation: rotationInfo.needsRotation ? rotationInfo : null,
          userRotationChoice: userRotationChoice // Preserve user's rotation preference
        });

        setPlacedItems(newItems);
        toast.success(`🔄 Swapped ${selectedItemToPlace.name} with ${occupyingItem.name}!`);
        setSelectedItemToPlace(null);
        return;
      } else if (occupyingItem) {
        toast.error('This spot is already occupied! Click the item first to swap.');
        return;
      }

      // Check rotation requirements - preserve user choice if exists
      const userRotationChoice = selectedItemToPlace.userRotationChoice;
      const rotationInfo = getItemRotationInfo(selectedItemToPlace, userRotationChoice);

      // Validate that item fits in box with current rotation
      if (rotationInfo.cannotFit) {
        const itemWidthCm = parseFloat(selectedItemToPlace.widthCm) || 5;
        const itemDepthCm = parseFloat(selectedItemToPlace.depthCm) || 5;
        const itemHeightCm = parseFloat(selectedItemToPlace.heightCm) || 5;
        const boxHeightCm = selectedBox?.heightCm || 8;

        // Find next larger box
        const currentBoxIndex = HAMPER_BOXES.findIndex(box => box.id === selectedBox.id);
        const hasLargerBox = currentBoxIndex < HAMPER_BOXES.length - 1;

        setErrorModalContent({
          title: 'Item Too Large',
          message: `❌ ${selectedItemToPlace.name} cannot fit in this box!\n\n📏 Item: ${itemWidthCm}×${itemHeightCm}×${itemDepthCm} cm\n📦 Box height: ${boxHeightCm} cm\n\n💡 ${hasLargerBox ? 'Please choose a larger box or remove this item.' : 'This is the largest box available. Please remove this item.'}`,
          action: hasLargerBox ? () => {
            // Switch to next larger box
            const nextBox = HAMPER_BOXES[currentBoxIndex + 1];
            setSelectedBox(nextBox);
            setStep(2); // Go back to step 2 to show the new box
            toast.success(`Switched to ${nextBox.name} box!`);
          } : null
        });
        setShowErrorModal(true);
        setSelectedItemToPlace(null);
        return;
      }

      const newItem = {
        ...selectedItemToPlace,
        position,
        placedAt: new Date().toISOString(),
        rotation: rotationInfo.needsRotation ? rotationInfo : null,
        userRotationChoice: userRotationChoice // Preserve user's rotation preference
      };

      if (selectedItemToPlace.previousPosition !== undefined) {
        // Moving an existing item - just add it at the new position
        // (it was already removed from the old position in handleItemClick3D)
        setPlacedItems(prev => [...prev, newItem]);

        if (rotationInfo.needsRotation && !rotationInfo.cannotFit) {
          toast.success(`✅ ${selectedItemToPlace.name} moved and laid on its side to fit!`, {
            icon: '🔄',
            duration: 4000
          });
        } else {
          toast.success(`✅ ${selectedItemToPlace.name} moved!`);
        }
      } else {
        // Adding a new item from the sidebar
        setPlacedItems(prev => [...prev, newItem]);

        if (rotationInfo.needsRotation && !rotationInfo.cannotFit) {
          // Different messages for auto-detected flat items vs. items that are too tall
          if (rotationInfo.autoDetected) {
            toast.success(`✅ ${selectedItemToPlace.name} added! Laid flat for better presentation.`, {
              icon: '📦',
              duration: 4000
            });
          } else {
            toast.success(`✅ ${selectedItemToPlace.name} added! Laid on its side to fit in the ${selectedBox.heightCm}cm tall box.`, {
              icon: '🔄',
              duration: 5000
            });
          }
        } else {
          toast.success(`✅ ${selectedItemToPlace.name} added to hamper!`);
        }
      }

      setSelectedItemToPlace(null);
    }
  };

  const handleItemClick3D = (item, position) => {
    // Just select the item for game controls - DON'T remove it from hamper
    setSelectedItemForControls(item);
    setSelectedItemToPlace(null); // Clear any pending placement
    toast.info(`🎮 Use game controls to adjust ${item.name}`, { duration: 2000 });
  };

  // Check if item would collide with others in a specific position and rotation
  const checkItemCollision = (itemToCheck, position, isRotated = false) => {
    if (!selectedBox) return false;

    const boxWidthCm = selectedBox.lengthCm || 20;
    const boxDepthCm = selectedBox.widthCm || 15;
    const boxHeightCm = selectedBox.heightCm || 8;

    const itemWidthCm = parseFloat(itemToCheck.widthCm) || 5;
    const itemDepthCm = parseFloat(itemToCheck.depthCm) || 5;
    const itemHeightCm = parseFloat(itemToCheck.heightCm) || 5;

    // Determine effective dimensions based on rotation
    let effectiveWidth = itemWidthCm;
    let effectiveDepth = itemDepthCm;
    let effectiveHeight = itemHeightCm;

    if (isRotated) {
      // When rotated on width axis: width becomes height, height becomes width
      // When rotated on depth axis: depth becomes height, height becomes depth
      const rotationInfo = getItemRotationInfo(itemToCheck, true);
      if (rotationInfo.rotationAxis === 'width') {
        effectiveHeight = itemWidthCm;
        effectiveWidth = itemHeightCm;
      } else if (rotationInfo.rotationAxis === 'depth') {
        effectiveHeight = itemDepthCm;
        effectiveDepth = itemHeightCm;
      }
    }

    // Check if item exceeds box boundaries
    if (effectiveWidth > boxWidthCm || effectiveDepth > boxDepthCm || effectiveHeight > boxHeightCm) {
      return true; // Collision with box boundaries
    }

    // Check collision with other items (simplified - same grid position)
    // In a real implementation, you'd check actual 3D bounding box overlap
    const otherItems = placedItems.filter(item =>
      item.position !== itemToCheck.position && item.position === position
    );

    return otherItems.length > 0; // Collision if same position occupied
  };

  // Toggle rotation for a placed item
  const toggleItemRotation = (itemToToggle) => {
    console.log('🔄 toggleItemRotation called for:', itemToToggle.name);
    console.log('Current rotation state:', itemToToggle.rotation);

    const currentRotation = itemToToggle.rotation?.needsRotation || false;
    const newRotationState = !currentRotation;

    console.log('New rotation state will be:', newRotationState);

    // Get item and box dimensions for detailed error messages
    const itemWidthCm = parseFloat(itemToToggle.widthCm) || 5;
    const itemDepthCm = parseFloat(itemToToggle.depthCm) || 5;
    const itemHeightCm = parseFloat(itemToToggle.heightCm) || 5;
    const boxHeightCm = selectedBox?.heightCm || 8;
    const boxWidthCm = selectedBox?.lengthCm || 20;
    const boxDepthCm = selectedBox?.widthCm || 15;

    // Check if the new orientation fits
    const rotationInfo = getItemRotationInfo(itemToToggle, newRotationState);
    console.log('Rotation info:', rotationInfo);

    if (rotationInfo.cannotFit) {
      console.log('❌ Cannot fit in new orientation');

      // Create detailed error message based on orientation
      let detailedMessage = '';
      if (newRotationState) {
        // Trying to lay down
        detailedMessage = `This item cannot be laid on its side.\n\n📏 Item dimensions: ${itemWidthCm}×${itemHeightCm}×${itemDepthCm} cm\n📦 Box height: ${boxHeightCm} cm\n\n❌ Even when laid down, the item is too tall to fit in the box.`;
      } else {
        // Trying to stand upright
        detailedMessage = `This item cannot stand upright in this box.\n\n📏 Item height: ${itemHeightCm} cm\n📦 Box height: ${boxHeightCm} cm\n\n❌ The item is ${(itemHeightCm - boxHeightCm).toFixed(1)} cm taller than the box height.\n\n💡 Tip: Keep it laid on its side or choose a taller box.`;
      }

      setErrorModalContent({
        title: 'Cannot Rotate Item',
        message: detailedMessage
      });
      setShowErrorModal(true);
      return;
    }

    // Check for collisions with box boundaries
    const wouldCollide = checkItemCollision(itemToToggle, itemToToggle.position, newRotationState);
    console.log('Would collide:', wouldCollide);

    if (wouldCollide) {
      const orientation = newRotationState ? 'laid on its side' : 'standing upright';
      setErrorModalContent({
        title: 'Cannot Rotate Item',
        message: `Item would exceed box boundaries when ${orientation}!\n\n📦 Box dimensions: ${boxWidthCm}×${boxHeightCm}×${boxDepthCm} cm\n📏 Item dimensions: ${itemWidthCm}×${itemHeightCm}×${itemDepthCm} cm\n\n💡 Tip: Try moving the item to a different position first, or choose a larger box.`
      });
      setShowErrorModal(true);
      return;
    }

    console.log('✅ Rotation allowed, updating item...');

    // Update the item with new rotation
    setPlacedItems(prev => prev.map(item => {
      if (item.position === itemToToggle.position) {
        return {
          ...item,
          rotation: rotationInfo.needsRotation ? rotationInfo : null,
          userRotationChoice: newRotationState
        };
      }
      return item;
    }));

    toast.success(`🔄 ${itemToToggle.name} ${newRotationState ? 'laid on its side' : 'standing upright'}!`, {
      duration: 3000
    });
  };

  // Game Control Handlers
  const handleControlMove = (direction) => {
    if (!selectedItemForControls || !selectedBox) return;

    const currentPosition = selectedItemForControls.position;
    const { rows, cols } = selectedBox.gridSize;
    const currentRow = Math.floor(currentPosition / cols);
    const currentCol = currentPosition % cols;

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, currentRow - 1);
        break;
      case 'down':
        newRow = Math.min(rows - 1, currentRow + 1);
        break;
      case 'left':
        newCol = Math.max(0, currentCol - 1);
        break;
      case 'right':
        newCol = Math.min(cols - 1, currentCol + 1);
        break;
    }

    const newPosition = newRow * cols + newCol;

    // Check if new position is different
    if (newPosition === currentPosition) {
      toast.error(`Cannot move ${direction} - edge of box!`, { duration: 2000 });
      return;
    }

    // Check if new position is occupied
    const isOccupied = placedItems.some(item =>
      item.position === newPosition && item.id !== selectedItemForControls.id
    );

    if (isOccupied) {
      toast.error('That spot is occupied!', { duration: 2000 });
      return;
    }

    // Move the item
    setPlacedItems(prev => prev.map(item => {
      if (item.id === selectedItemForControls.id && item.position === currentPosition) {
        return { ...item, position: newPosition };
      }
      return item;
    }));

    // Update selected item
    setSelectedItemForControls(prev => ({ ...prev, position: newPosition }));

    toast.success(`Moved ${direction}!`, { duration: 1500, icon: '🎮' });
  };

  const handleControlRotate = () => {
    if (!selectedItemForControls) return;
    toggleItemRotation(selectedItemForControls);

    // Update selected item with new rotation state
    setSelectedItemForControls(prev => {
      const updated = placedItems.find(item =>
        item.id === prev.id && item.position === prev.position
      );
      return updated || prev;
    });
  };

  const handleControlRotateDirection = () => {
    if (!selectedItemForControls || !selectedItemForControls.rotation?.needsRotation) {
      toast.info('Item must be laid down to rotate direction', { duration: 2000 });
      return;
    }

    // Rotate the item 90 degrees around Y-axis
    setPlacedItems(prev => prev.map(item => {
      if (item.position === selectedItemForControls.position) {
        const currentAngle = item.rotationAngle || 0;
        const newAngle = (currentAngle + 90) % 360;

        return {
          ...item,
          rotationAngle: newAngle
        };
      }
      return item;
    }));

    // Update selected item
    setSelectedItemForControls(prev => {
      const currentAngle = prev.rotationAngle || 0;
      const newAngle = (currentAngle + 90) % 360;
      return { ...prev, rotationAngle: newAngle };
    });

    toast.success('🔄 Rotated direction 90°!', { duration: 1500, icon: '↻' });
  };

  const handleControlDelete = () => {
    if (!selectedItemForControls) return;

    setPlacedItems(prev => prev.filter(item =>
      !(item.id === selectedItemForControls.id && item.position === selectedItemForControls.position)
    ));

    toast.success(`${selectedItemForControls.name} removed from hamper!`, {
      duration: 2000,
      icon: '🗑️'
    });

    setSelectedItemForControls(null);
  };

  const canMoveInDirection = (direction) => {
    if (!selectedItemForControls || !selectedBox) return false;

    const currentPosition = selectedItemForControls.position;
    const { rows, cols } = selectedBox.gridSize;
    const currentRow = Math.floor(currentPosition / cols);
    const currentCol = currentPosition % cols;

    switch (direction) {
      case 'up':
        return currentRow > 0;
      case 'down':
        return currentRow < rows - 1;
      case 'left':
        return currentCol > 0;
      case 'right':
        return currentCol < cols - 1;
      default:
        return false;
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, item) => {
    if (!canItemFitInBox(item)) {
      e.preventDefault();
      toast.error('This item is too large for the selected box!');
      return;
    }
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    toast.info(`🎯 Drag ${item.name} to a green spot in the box`, { duration: 2000 });
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setIsDragging(false);
    setHoveredSpotIndex(null);
  };

  const handleDragOverSpot = (e, spotIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem && !placedItems.some(item => item.position === spotIndex)) {
      setHoveredSpotIndex(spotIndex);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSpot = (e, spotIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    // Check if spot is occupied
    if (placedItems.some(item => item.position === spotIndex)) {
      toast.error('❌ This spot is already occupied!');
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredSpotIndex(null);
      return;
    }

    // Add item to the spot
    const newItem = {
      ...draggedItem,
      position: spotIndex,
      placedAt: new Date().toISOString(),
    };

    setPlacedItems(prev => [...prev, newItem]);
    toast.success(`✅ ${draggedItem.name} added to hamper!`);

    setDraggedItem(null);
    setIsDragging(false);
    setHoveredSpotIndex(null);
  };

  const getTotalPrice = () => {
    const itemsTotal = placedItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * (item.quantity || 1));
    }, 0);
    return itemsTotal + (selectedBox?.price || 0);
  };

  const handleFinalize = () => {
    if (placedItems.length === 0) {
      toast.error('Please add items to your hamper');
      return;
    }
    setStep(3);
    // Scroll to top to show preview
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    setTimeout(() => navigate('/checkout'), 1000);
  };

  const availableItems = cartItems.filter(
    cartItem => !placedItems.some(placed => placed.id === cartItem.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20 py-6 sm:py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-2 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Custom Hamper Builder
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600">
            Create your perfect gift hamper in 3 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200 -z-10">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>

            {[
              { num: 1, label: 'Select Box', icon: Box },
              { num: 2, label: 'Build Hamper', icon: Package },
              { num: 3, label: 'Preview', icon: Eye },
            ].map((s) => (
              <div
                key={s.num}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  // Allow navigation to completed steps or current step
                  if (s.num === 1) {
                    setStep(1);
                  } else if (s.num === 2 && selectedBox) {
                    setStep(2);
                  } else if (s.num === 3 && selectedBox && placedItems.length > 0) {
                    setStep(3);
                  }
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-lg scale-110'
                      : 'bg-white text-neutral-400 border-2 border-neutral-200'
                  } ${
                    (s.num === 1 || (s.num === 2 && selectedBox) || (s.num === 3 && selectedBox && placedItems.length > 0))
                      ? 'hover:scale-125 hover:shadow-xl'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={`mt-2 text-sm font-medium transition-colors ${
                  step >= s.num ? 'text-primary-600' : 'text-neutral-400'
                } group-hover:text-primary-700`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved State Indicator */}
        {placedItems.length > 0 && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-2">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm">
                    ✅ Hamper Saved Automatically
                  </h4>
                  <p className="text-xs text-green-700">
                    {placedItems.length} item{placedItems.length !== 1 ? 's' : ''} in your {selectedBox?.name} box • You can navigate away and come back anytime
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearHamper}
                className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
              >
                <RotateCcw className="h-3 w-3" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Select Hamper Box */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-neutral-900">
              Choose Your Hamper Box
            </h2>

            {cartItems.length === 0 && (
              <div className="card p-12 text-center">
                <ShoppingBag className="h-20 w-20 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h3>
                <p className="text-neutral-600 mb-6">Add items to your cart first to build a hamper</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                  Browse Products
                </button>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HAMPER_BOXES.map((box) => (
                  <div
                    key={box.id}
                    onClick={() => handleBoxSelect(box)}
                    className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedBox?.id === box.id
                        ? 'ring-4 ring-primary-500 shadow-2xl'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
                      <div className={`absolute inset-0 bg-gradient-to-br ${box.color} opacity-60`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Box className="h-24 w-24 text-neutral-400" />
                      </div>
                      {selectedBox?.id === box.id && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">{box.name}</h3>
                      <p className="text-sm text-neutral-600 mb-4">{box.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Capacity:</span>
                          <span className="font-semibold text-neutral-900">{box.capacity} items</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Size:</span>
                          <span className="font-semibold text-neutral-900">{box.dimensions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Best for:</span>
                          <span className="font-semibold text-neutral-900 text-right text-xs">{box.bestUsedFor}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                        <span className="text-2xl font-bold text-primary-600">₹{box.price}</span>
                        <button className="btn-primary text-sm py-2 px-4">
                          Select
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Build Hamper */}
        {step === 2 && selectedBox && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setShowBoxChangeModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                Change Box Size
              </button>
              <h2 className="text-3xl font-bold text-neutral-900">Build Your Hamper</h2>
              <button onClick={handleReset} className="btn-secondary">
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset Items
              </button>
            </div>

            {/* Box Change Modal */}
            {showBoxChangeModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">Change Hamper Box Size</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        {placedItems.length > 0
                          ? `Your ${placedItems.length} item${placedItems.length !== 1 ? 's' : ''} will be preserved if they fit in the new box`
                          : 'Select a new box size for your hamper'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBoxChangeModal(false)}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {HAMPER_BOXES.map((box) => {
                        const isCurrentBox = selectedBox?.id === box.id;
                        const boxVolume = box.lengthCm * box.widthCm * box.heightCm;
                        const currentItemsVolume = placedItems.reduce((total, item) => {
                          const w = parseFloat(item.widthCm) || 5;
                          const d = parseFloat(item.depthCm) || 5;
                          const h = parseFloat(item.heightCm) || 5;
                          return total + (w * d * h);
                        }, 0);
                        // Apply packing efficiency factor
                        const packingEfficiencyFactor = 1.4;
                        const effectiveVolume = currentItemsVolume * packingEfficiencyFactor;
                        const fillPercentage = boxVolume > 0 ? (effectiveVolume / boxVolume) * 100 : 0;
                        const willItemsFit = fillPercentage <= 100;

                        return (
                          <div
                            key={box.id}
                            className={`relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
                              isCurrentBox
                                ? 'border-primary-500 bg-primary-50'
                                : willItemsFit
                                ? 'border-neutral-200 hover:border-primary-300 hover:shadow-lg'
                                : 'border-red-200 bg-red-50 opacity-75'
                            }`}
                            onClick={() => {
                              if (!isCurrentBox) {
                                handleChangeBoxFromModal(box);
                              }
                            }}
                          >
                            {isCurrentBox && (
                              <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Current
                              </div>
                            )}

                            <div className="flex items-start gap-4">
                              <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${box.color} border-2 ${box.borderColor} flex items-center justify-center`}>
                                <Package className="h-10 w-10 text-neutral-700" />
                              </div>

                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-neutral-900">{box.name}</h4>
                                <p className="text-sm text-neutral-600">{box.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  📏 {box.dimensionsCm}
                                </p>
                                <p className="text-sm font-semibold text-primary-600 mt-2">
                                  ₹{box.price}
                                </p>
                              </div>
                            </div>

                            {placedItems.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-neutral-200">
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className="text-neutral-600">Items fit:</span>
                                  <span className={`font-bold ${willItemsFit ? 'text-green-600' : 'text-red-600'}`}>
                                    {willItemsFit ? '✅ Yes' : '❌ Too small'}
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      fillPercentage > 85 ? 'bg-red-500' : fillPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                                  />
                                </div>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {fillPercentage.toFixed(1)}% full with current items
                                </p>
                              </div>
                            )}

                            {!isCurrentBox && willItemsFit && (
                              <button
                                className="mt-4 w-full btn-primary text-sm py-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeBoxFromModal(box);
                                }}
                              >
                                Switch to {box.name}
                              </button>
                            )}

                            {!isCurrentBox && !willItemsFit && placedItems.length > 0 && (
                              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-2">
                                <p className="text-xs text-red-700 font-semibold">
                                  ⚠️ Some items won't fit in this box
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 p-4 flex justify-end gap-3">
                    <button
                      onClick={() => setShowBoxChangeModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile: Reverse order - Items first, then 3D box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* MOBILE: Available Items Section FIRST (shows at top on mobile) - COMPACT */}
              <div className="lg:hidden">
                <div className="card p-3">
                  {/* Mobile Instructions - Compact */}
                  <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-1 flex items-center text-xs">
                      <span className="text-base mr-1">👇</span>
                      Quick Guide
                    </h4>
                    <p className="text-[10px] text-blue-800">
                      <strong>1.</strong> Tap item → <strong>2.</strong> Scroll to 3D box → <strong>3.</strong> Tap green spot
                    </p>
                  </div>

                  {/* Available Items - Mobile - COMPACT */}
                  <div className="bg-white rounded-lg border-2 border-orange-300 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-1.5 flex items-center justify-between">
                      <h3 className="text-white font-bold text-xs flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        Items ({availableItems.length})
                      </h3>
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-white hover:bg-orange-50 text-orange-700 font-semibold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        Add
                      </button>
                    </div>

                    <div className="p-2 space-y-1.5 max-h-[200px] overflow-y-auto">
                      {availableItems.length === 0 ? (
                        <div className="text-center py-4">
                          <ShoppingBag className="h-8 w-8 text-neutral-300 mx-auto mb-1" />
                          <p className="text-xs text-neutral-600 mb-2">All items placed!</p>
                          <button
                            onClick={() => navigate('/products')}
                            className="btn-primary text-[10px] py-1.5 px-3"
                          >
                            Add More Items
                          </button>
                        </div>
                      ) : (
                        availableItems.map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                            onClick={() => {
                              setSelectedItemToPlace(item);
                              toast.info(`📦 ${item.name} selected! Scroll down and tap a green spot.`);
                            }}
                            className={`bg-white border-2 rounded-lg p-1.5 cursor-pointer transition-all hover:shadow-md active:scale-95 ${
                              selectedItemToPlace?.id === item.id
                                ? 'border-green-500 bg-green-50 shadow-lg'
                                : 'border-neutral-200 hover:border-orange-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                                ) : (
                                  <Gift className="h-5 w-5 text-neutral-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[11px] text-neutral-900 truncate leading-tight">{item.name}</p>
                                <p className="text-[10px] text-neutral-600">₹{item.price}</p>
                              </div>
                              {selectedItemToPlace?.id === item.id && (
                                <div className="flex-shrink-0">
                                  <div className="bg-green-500 text-white rounded-full p-0.5">
                                    <Check className="h-2.5 w-2.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Box Section */}
              <div className="lg:col-span-2">
                <div className="card p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-neutral-200 gap-2">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl text-neutral-900">{selectedBox.name}</h3>
                      <p className="text-xs sm:text-sm text-neutral-600">{selectedBox.dimensions}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-neutral-600">Items Placed</div>
                      <div className="text-xl sm:text-2xl font-bold text-primary-600">
                        {placedItems.length} / {selectedBox.capacity}
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Selected Item Indicator */}
                  {selectedItemToPlace && (
                    <div className="lg:hidden mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl">
                      <h4 className="font-bold text-green-900 mb-1 flex items-center text-sm">
                        <span className="text-lg mr-2">✅</span>
                        Selected: {selectedItemToPlace.name}
                      </h4>
                      <p className="text-xs text-green-700">
                        Tap a <strong>green spot</strong> below to place this item!
                      </p>
                    </div>
                  )}

                  {/* Desktop Instructions - Hidden on Mobile */}
                  <div className="hidden lg:block mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                      <span className="text-xl mr-2">💡</span>
                      Quick Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Drag & Drop:</strong> Drag items from sidebar to green spots</li>
                      <li>• <strong>Reposition:</strong> Click an item in box, then click a green spot</li>
                      <li>• <strong>Swap:</strong> Click an item, then click another item's spot</li>
                      <li>• <strong>Rotate View:</strong> Left-click + drag to rotate the box</li>
                    </ul>
                  </div>

                  {/* Dragging Indicator */}
                  {isDragging && draggedItem && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl animate-pulse">
                      <h4 className="font-bold text-green-900 mb-1 flex items-center">
                        <span className="text-xl mr-2">🎯</span>
                        Dragging: {draggedItem.name}
                      </h4>
                      <p className="text-sm text-green-700">
                        Drop on a <strong className="text-green-900">blue glowing spot</strong> in the 3D box!
                      </p>
                    </div>
                  )}

                  {/* 3D Box Container - Responsive Height (Reduced for mobile) */}
                  <div className="w-full h-[350px] sm:h-[450px] lg:h-[600px] relative mb-20 lg:mb-0">
                    {/* Drop Zone Overlay - Captures HTML5 drag events with Grid */}
                    {isDragging && draggedItem && (
                      <div
                        className="absolute inset-0 z-10 pointer-events-auto"
                        onDragOver={handleDragOverCanvas}
                      >
                        <div className="w-full h-full bg-blue-500/10 border-4 border-dashed border-blue-500 rounded-xl backdrop-blur-sm p-8">
                          {/* Grid of Drop Zones */}
                          <div className="w-full h-full grid grid-cols-3 gap-4">
                            {Array.from({ length: selectedBox.capacity }).map((_, spotIndex) => {
                              const isOccupied = placedItems.some(item => item.position === spotIndex);
                              const isHovered = hoveredSpotIndex === spotIndex;

                              return (
                                <div
                                  key={`drop-spot-${spotIndex}`}
                                  className={`relative flex items-center justify-center rounded-xl border-4 border-dashed transition-all ${
                                    isOccupied
                                      ? 'bg-red-100/50 border-red-400 cursor-not-allowed'
                                      : isHovered
                                      ? 'bg-green-400/80 border-green-600 scale-110 shadow-2xl'
                                      : 'bg-white/50 border-blue-400 hover:bg-green-300/60 hover:border-green-500 hover:scale-105'
                                  }`}
                                  onDragOver={(e) => handleDragOverSpot(e, spotIndex)}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                    if (hoveredSpotIndex === spotIndex) {
                                      setHoveredSpotIndex(null);
                                    }
                                  }}
                                  onDrop={(e) => {
                                    if (!isOccupied) {
                                      handleDropOnSpot(e, spotIndex);
                                    } else {
                                      e.preventDefault();
                                      toast.error('❌ This spot is already occupied!');
                                    }
                                  }}
                                >
                                  {isOccupied ? (
                                    <div className="text-center">
                                      <div className="text-4xl mb-2">🚫</div>
                                      <p className="text-xs font-bold text-red-700">Occupied</p>
                                    </div>
                                  ) : isHovered ? (
                                    <div className="text-center">
                                      <div className="text-5xl mb-2 animate-bounce">🎯</div>
                                      <p className="text-sm font-bold text-green-900">Drop Here!</p>
                                      <p className="text-xs text-green-800">Spot {spotIndex + 1}</p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <div className="text-4xl mb-2">📦</div>
                                      <p className="text-xs font-bold text-blue-700">Spot {spotIndex + 1}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Instructions */}
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 rounded-xl shadow-2xl px-6 py-3 pointer-events-none">
                            <p className="text-lg font-bold text-blue-900 text-center">
                              🎯 Drop <span className="text-green-600">{draggedItem.name}</span> on any green spot!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <HamperScene3D
                      selectedBox={selectedBox}
                      placedItems={placedItems}
                      autoRotate={false}
                      onSpotClick={handleSpotClick}
                      selectedItemToPlace={selectedItemToPlace}
                      onItemClick={handleItemClick3D}
                      onDragOverSpot={handleDragOverSpot}
                      onDropOnSpot={handleDropOnSpot}
                      onToggleRotation={toggleItemRotation}
                      draggedItem={draggedItem}
                      hoveredSpotIndex={hoveredSpotIndex}
                    />
                  </div>

                  {/* Game-like Control Panel */}
                  <ProductControlPanel
                    selectedItem={selectedItemForControls}
                    onMove={handleControlMove}
                    onRotate={handleControlRotate}
                    onRotateDirection={handleControlRotateDirection}
                    onDelete={handleControlDelete}
                    onClose={() => {
                      setSelectedItemForControls(null);
                      setSelectedItemToPlace(null);
                    }}
                    canMoveUp={canMoveInDirection('up')}
                    canMoveDown={canMoveInDirection('down')}
                    canMoveLeft={canMoveInDirection('left')}
                    canMoveRight={canMoveInDirection('right')}
                    canRotate={true}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="card p-3 sticky top-6 space-y-3 max-h-screen overflow-y-auto">

                  {/* 1. SELECTED BOX - Compact */}
                  <div className="bg-white rounded-lg border-2 border-blue-300 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-2">
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        Your Selected Box
                      </h3>
                    </div>

                    {/* Box Info */}
                    <div className="p-3 space-y-2">
                      {/* Box Name & Price - Inline */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                        <p className="text-lg font-bold text-neutral-900">{selectedBox.name}</p>
                        <p className="text-sm font-semibold text-blue-600">₹{selectedBox.price}</p>
                      </div>

                      {/* Dimensions - Compact */}
                      <div className="bg-blue-50 rounded-lg p-2">
                        <p className="text-xs text-neutral-600 text-center">
                          {selectedBox.dimensionsCm} • {selectedBox.dimensions}
                        </p>
                      </div>

                      {/* Change Box Button - Smaller */}
                      <button
                        onClick={() => setShowBoxChangeModal(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Package className="h-3 w-3" />
                        Change Box Size
                      </button>
                    </div>
                  </div>

                  {/* 2. SPACE TRACKER - Compact */}
                  <div className="bg-white rounded-lg border-2 border-green-300 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2">
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Space Tracker
                      </h3>
                    </div>

                    {/* Space Info */}
                    <div className="p-3 space-y-2">
                      {/* Percentage & Stats - Combined */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <p className="text-xs text-neutral-600">Box Filled</p>
                          <p className="text-2xl font-bold" style={{
                            color: getBoxFillPercentage() > 85 ? '#dc2626' :
                                   getBoxFillPercentage() > 70 ? '#f59e0b' : '#10b981'
                          }}>
                            {getBoxFillPercentage().toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-600">Items: {placedItems.length}</p>
                          <p className="text-xs text-neutral-600">Left: {(100 - getBoxFillPercentage()).toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Progress Bar - Compact */}
                      <div className="w-full bg-neutral-200 rounded-full h-5 overflow-hidden shadow-inner">
                        <div
                          className="h-5 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            width: `${Math.min(getBoxFillPercentage(), 100)}%`,
                            backgroundColor: getBoxFillPercentage() > 85 ? '#dc2626' :
                                           getBoxFillPercentage() > 70 ? '#f59e0b' : '#10b981'
                          }}
                        >
                          {getBoxFillPercentage() > 15 && `${getBoxFillPercentage().toFixed(0)}%`}
                        </div>
                      </div>

                      {/* Warning Message - Compact */}
                      {getBoxFillPercentage() > 70 && (
                        <div className={`rounded-lg p-2 ${
                          getBoxFillPercentage() > 85 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <p className={`text-xs font-semibold ${
                            getBoxFillPercentage() > 85 ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {getBoxFillPercentage() > 85
                              ? '⚠️ Almost full!'
                              : '💡 Filling up'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* 3. AVAILABLE ITEMS SECTION - Compact */}
                  <div className="bg-white rounded-lg border-2 border-orange-300 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 flex items-center justify-between">
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Available ({availableItems.length})
                      </h3>
                      <button
                        onClick={() => navigate('/products')}
                        className="bg-white hover:bg-orange-50 text-orange-700 font-semibold text-xs px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="p-2">
                      {availableItems.length === 0 ? (
                    <div className="text-center py-4">
                      <Package className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-600 text-xs font-semibold mb-2">All items placed!</p>
                      <button
                        onClick={() => navigate('/products')}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 mx-auto"
                      >
                        <Plus className="h-3 w-3" />
                        Browse
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableItems.map((item) => {
                        const itemFits = canItemFitInBox(item);
                        const sizeInfo = getItemSizeInfo(item);
                        const rotationInfo = getItemRotationInfo(item);
                        const isBeingDragged = draggedItem?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            draggable={itemFits}
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleItemClick(item)}
                            className={`bg-white border rounded-lg p-2 transition-all ${
                              !itemFits
                                ? 'border-red-300 opacity-60 cursor-not-allowed'
                                : isBeingDragged
                                ? 'border-green-500 shadow-lg opacity-50'
                                : selectedItemToPlace?.id === item.id
                                ? 'border-blue-500 shadow-lg'
                                : 'border-neutral-300 hover:border-primary-500 hover:shadow cursor-grab active:cursor-grabbing'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {/* Drag Handle Icon */}
                              {itemFits && (
                                <div className="flex-shrink-0">
                                  <Move className="h-4 w-4 text-neutral-400" />
                                </div>
                              )}

                              <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center flex-shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                                ) : (
                                  <Package className="h-6 w-6 text-neutral-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-neutral-900 truncate">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-neutral-600">₹{item.price}</p>

                                {!itemFits && (
                                  <p className="text-xs text-red-600 mt-1">⚠️ Too large</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  </div>
                </div>

                  {/* 4. PRICING SUMMARY - Compact */}
                  <div className="bg-white rounded-lg border-2 border-indigo-300 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-2">
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Price Summary
                      </h3>
                    </div>

                    {/* Pricing Details */}
                    <div className="p-3 space-y-2">
                      {/* Box Price */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <p className="text-xs font-semibold text-neutral-700">Box</p>
                          <p className="text-xs text-neutral-500">{selectedBox.name}</p>
                        </div>
                        <p className="text-sm font-bold text-neutral-900">₹{selectedBox.price}</p>
                      </div>

                      {/* Items Total */}
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                        <div>
                          <p className="text-xs font-semibold text-neutral-700">Items</p>
                          <p className="text-xs text-neutral-500">{placedItems.length} placed</p>
                        </div>
                        <p className="text-sm font-bold text-neutral-900">
                          ₹{placedItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}
                        </p>
                      </div>

                      {/* Grand Total */}
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-2 border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-neutral-900">Total</p>
                          <p className="text-xl font-bold text-indigo-600">₹{getTotalPrice()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. PREVIEW BUTTON - Compact */}
                  <button
                    onClick={handleFinalize}
                    disabled={placedItems.length === 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {placedItems.length === 0 ? 'Add Items First' : 'Preview Hamper'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* MOBILE ONLY: Sticky Floating Preview Button - Always visible at bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-50 pointer-events-none">
              <button
                onClick={handleFinalize}
                disabled={placedItems.length === 0}
                className="w-full pointer-events-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-base py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Eye className="h-5 w-5" />
                <span>{placedItems.length === 0 ? 'Add Items First' : `Preview Hamper (${placedItems.length} items)`}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && selectedBox && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Your Custom Hamper</h2>
              <p className="text-neutral-600">Review your beautiful creation</p>
            </div>

            <div className="card p-8 mb-6">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">🎁 Final Preview</h3>
              <div className="w-full h-[600px] mb-6">
                <HamperPreview3D
                  selectedBox={selectedBox}
                  placedItems={placedItems}
                  hamperName={hamperName}
                />
              </div>
            </div>

            <div className="card p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Hamper Name (Optional)
                </label>
                <input
                  type="text"
                  value={hamperName}
                  onChange={(e) => setHamperName(e.target.value)}
                  placeholder="e.g., Diwali Special, Birthday Gift"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-neutral-50 p-6 rounded-xl">
                  <h4 className="font-bold text-neutral-900 mb-4">Box Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Box Type:</span>
                      <span className="font-semibold text-neutral-900">{selectedBox.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Dimensions:</span>
                      <span className="font-semibold text-neutral-900">{selectedBox.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Box Price:</span>
                      <span className="font-semibold text-neutral-900">₹{selectedBox.price}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-xl">
                  <h4 className="font-bold text-neutral-900 mb-4">Items Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Items:</span>
                      <span className="font-semibold text-neutral-900">{placedItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Items Total:</span>
                      <span className="font-semibold text-neutral-900">
                        ₹{placedItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200">
                      <span className="text-neutral-900 font-bold">Grand Total:</span>
                      <span className="font-bold text-primary-600 text-lg">₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-blue-900 mb-3">📦 Items in Your Hamper</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {placedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-6 w-6 text-neutral-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm text-neutral-900">{item.name}</h5>
                        <p className="text-xs text-neutral-600">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Edit Hamper
                </button>
                <button onClick={handleCheckout} className="btn-primary flex-1">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Hamper Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmModal}
        onClose={() => setShowClearConfirmModal(false)}
        onConfirm={confirmClearHamper}
        title="Clear Entire Hamper?"
        message="This will remove all placed items, reset your box selection, and clear your progress. This action cannot be undone."
        confirmText="Yes, Clear Everything"
        cancelText="Keep My Hamper"
        variant="danger"
        icon={<Trash2 className="h-6 w-6" />}
        details={
          placedItems.length > 0 && (
            <div className="text-sm">
              <p className="font-semibold text-gray-700 mb-2">You will lose:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• {placedItems.length} placed item{placedItems.length !== 1 ? 's' : ''}</li>
                <li>• {selectedBox?.name} box selection</li>
                <li>• Current arrangement</li>
              </ul>
            </div>
          )
        }
      />

      {/* Error Notification Modal */}
      <ErrorNotificationModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalContent.title}
        message={errorModalContent.message}
        icon={<AlertCircle className="h-10 w-10 text-white" />}
        autoClose={!errorModalContent.action} // Don't auto-close if there's an action
        autoCloseDuration={4000}
        primaryAction={errorModalContent.action}
        primaryActionText="📦 Change Box Size"
      />
    </div>
  );
}

