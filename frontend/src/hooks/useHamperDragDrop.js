import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing drag-and-drop functionality in the hamper builder
 * Handles both adding new items and rearranging existing items
 */
export const useHamperDragDrop = (placedItems, setPlacedItems, canItemFitInBox = null) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromPosition, setDraggedFromPosition] = useState(null);
  const [hoveredSpot, setHoveredSpot] = useState(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  /**
   * Start dragging an item
   * @param {Event} e - Drag event
   * @param {Object} item - Item being dragged
   * @param {number|null} fromPosition - Position in grid if rearranging, null if from sidebar
   */
  const handleDragStart = useCallback((e, item, fromPosition = null) => {
    // Prevent event bubbling to avoid conflicts with other handlers
    e.stopPropagation();

    // Check if item can fit in box (only for new items, not rearranging)
    if (fromPosition === null && canItemFitInBox && !canItemFitInBox(item)) {
      e.preventDefault();
      toast.error(`❌ ${item.name} is too large for this box!\nItem: ${item.widthCm}×${item.heightCm}×${item.depthCm}cm`, {
        duration: 5000
      });
      return;
    }
    
    setDraggedItem(item);
    setDraggedFromPosition(fromPosition);
    setIsDraggingActive(true);
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ item, fromPosition }));
    
    // Create custom drag preview with proportional dimensions
    const dragPreview = document.createElement('div');

    // Calculate proportional size based on actual product dimensions
    const itemWidth = parseFloat(item.widthCm) || 10;
    const itemHeight = parseFloat(item.heightCm) || 10;
    const itemDepth = parseFloat(item.depthCm) || 10;

    // Scale factor to make preview visible but not too large (max 120px)
    const maxDimension = Math.max(itemWidth, itemHeight, itemDepth);
    const scaleFactor = Math.min(120 / maxDimension, 8); // Max 120px or 8x scale

    const previewWidth = itemWidth * scaleFactor;
    const previewHeight = itemHeight * scaleFactor;

    dragPreview.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${previewWidth}px;
      height: ${previewHeight}px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 11px;
      text-align: center;
      padding: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      z-index: 9999;
    `;

    dragPreview.innerHTML = `
      <div style="font-size: 20px; margin-bottom: 4px;">📦</div>
      <div style="font-size: 10px; line-height: 1.2; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${item.name}
      </div>
      <div style="font-size: 9px; opacity: 0.9; margin-top: 4px; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px;">
        ${itemWidth}×${itemHeight}×${itemDepth}cm
      </div>
    `;

    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, previewWidth / 2, previewHeight / 2);
    
    // Clean up drag preview
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);
    
    // Visual feedback on source element
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.4';
    }
  }, []);

  /**
   * End dragging
   */
  const handleDragEnd = useCallback((e) => {
    e.stopPropagation();
    
    // Reset visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
    
    setDraggedItem(null);
    setDraggedFromPosition(null);
    setHoveredSpot(null);
    setIsDraggingActive(false);
  }, []);

  /**
   * Handle drag over a drop zone
   */
  const handleDragOver = useCallback((e, position) => {
    e.preventDefault();
    e.stopPropagation();
    
    e.dataTransfer.dropEffect = 'move';
    setHoveredSpot(position);
  }, []);

  /**
   * Handle drag leave from a drop zone
   */
  const handleDragLeave = useCallback((e) => {
    e.stopPropagation();
    setHoveredSpot(null);
  }, []);

  /**
   * Handle drop on a position
   */
  const handleDrop = useCallback((e, position) => {
    e.preventDefault();
    e.stopPropagation();
    
    setHoveredSpot(null);
    
    if (!draggedItem) {
      setIsDraggingActive(false);
      return;
    }

    // CASE 1: Rearranging existing item (dragging from box to box)
    if (draggedFromPosition !== null) {
      // Dropping on same position - do nothing
      if (draggedFromPosition === position) {
        setDraggedItem(null);
        setDraggedFromPosition(null);
        setIsDraggingActive(false);
        return;
      }

      const targetItem = placedItems.find(item => item.position === position);

      if (targetItem) {
        // Swap items
        const updatedItems = placedItems.map(item => {
          if (item.position === draggedFromPosition) {
            return { ...item, position };
          } else if (item.position === position) {
            return { ...item, position: draggedFromPosition };
          }
          return item;
        });
        setPlacedItems(updatedItems);
        toast.success('🔄 Items swapped!', { duration: 2000 });
      } else {
        // Move to empty spot
        const updatedItems = placedItems.map(item =>
          item.position === draggedFromPosition ? { ...item, position } : item
        );
        setPlacedItems(updatedItems);
        toast.success('✅ Item moved!', { duration: 2000 });
      }
    } 
    // CASE 2: Adding new item from sidebar
    else {
      // Check if position is occupied
      if (placedItems.some(item => item.position === position)) {
        toast.error('❌ This spot is already occupied!', { duration: 2000 });
        setDraggedItem(null);
        setDraggedFromPosition(null);
        setIsDraggingActive(false);
        return;
      }

      // Add new item
      setPlacedItems([...placedItems, { ...draggedItem, position }]);
      toast.success(`🎉 ${draggedItem.name} added to hamper!`, { duration: 2000 });
    }

    setDraggedItem(null);
    setDraggedFromPosition(null);
    setIsDraggingActive(false);
  }, [draggedItem, draggedFromPosition, placedItems, setPlacedItems, canItemFitInBox]);

  return {
    draggedItem,
    draggedFromPosition,
    hoveredSpot,
    isDraggingActive,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

