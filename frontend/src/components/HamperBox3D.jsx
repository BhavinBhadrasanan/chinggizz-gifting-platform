import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DragControls } from 'three-stdlib';

/**
 * Dimension Line Component - Simple and reliable version
 */
function DimensionLine({ start, end, label, color = "#374151", axis = "x" }) {
  const midpoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  // Calculate distance
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Determine rotation based on axis
  let rotation = [0, 0, 0];
  if (axis === "x") {
    rotation = [0, 0, Math.PI / 2]; // Horizontal along X
  } else if (axis === "y") {
    rotation = [0, 0, 0]; // Vertical along Y
  } else if (axis === "z") {
    rotation = [Math.PI / 2, 0, 0]; // Depth along Z
  }

  return (
    <group>
      {/* Main dimension line - thin cylinder */}
      <mesh position={midpoint} rotation={rotation}>
        <cylinderGeometry args={[0.015, 0.015, distance, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Start arrow - small sphere */}
      <mesh position={start}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* End arrow - small sphere */}
      <mesh position={end}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label with background */}
      <Text
        position={[midpoint[0], midpoint[1] + 0.2, midpoint[2]]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFFFFF"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * Create a realistic cup/mug shape using LatheGeometry
 * This creates a smooth, rounded cup body like a real ceramic tumbler
 * @param {number} radius - Radius of the mug
 * @param {number} height - Height of the mug
 * @param {boolean} isMobile - Whether to use simplified geometry for mobile
 */
function createMugGeometry(radius, height, isMobile = false) {
  const points = [];
  // AGGRESSIVE reduction for mobile - 8 segments instead of 16
  const segments = isMobile ? 8 : 40;
  const wallThickness = radius * 0.1;

  // Create the outer profile curve (bottom to top)
  const outerProfile = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 (bottom) to 1 (top)
    const y = (t - 0.5) * height; // Center vertically

    let x;

    if (t < 0.08) {
      // Bottom base - flat
      x = radius * 0.65;
    } else if (t < 0.2) {
      // Rounded bottom transition
      const localT = (t - 0.08) / 0.12;
      x = radius * 0.65 + Math.sin(localT * Math.PI / 2) * radius * 0.1;
    } else if (t < 0.85) {
      // Main body - gentle taper (narrower at bottom, wider at top)
      const localT = (t - 0.2) / 0.65;
      x = radius * 0.75 + localT * radius * 0.2;
    } else {
      // Top rim - slight outward flare
      const localT = (t - 0.85) / 0.15;
      x = radius * 0.95 + localT * radius * 0.05;
    }

    outerProfile.push({ x, y });
  }

  // Build the complete profile: outer wall + inner wall
  // Start from bottom center (base)
  points.push(new THREE.Vector2(0, -height / 2));

  // Add outer wall (bottom to top)
  for (let i = 0; i <= segments; i++) {
    points.push(new THREE.Vector2(outerProfile[i].x, outerProfile[i].y));
  }

  // Add inner wall (top to bottom) - creates the hollow interior
  for (let i = segments; i >= 0; i--) {
    const t = i / segments;
    let innerX = Math.max(wallThickness, outerProfile[i].x - wallThickness);

    // Inner wall is slightly shorter to create the cup opening
    let innerY = outerProfile[i].y;
    if (t > 0.88) {
      // Taper the rim thickness
      innerY = Math.min(innerY, height * 0.42);
    }

    points.push(new THREE.Vector2(innerX, innerY));
  }

  // Close the path back to center at bottom
  points.push(new THREE.Vector2(0, -height / 2));

  // Create the lathe geometry by rotating around Y-axis
  // AGGRESSIVE reduction for mobile - 8 radial segments instead of 16
  const radialSegments = isMobile ? 8 : 48;
  return new THREE.LatheGeometry(points, radialSegments);
}

/**
 * Individual 3D Product Component with Drag Support
 */
function Product3DModel({ item, position, onClick, isSelected, onDragStart, onDragEnd, isDraggable = false, onToggleRotation = null, isMobile = false }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Check if this is a candle product
  const isCandle = item.name.toLowerCase().includes('candle');
  const isMug = item.name.toLowerCase().includes('mug') || item.name.toLowerCase().includes('cup');

  // Animate on hover (but not while dragging)
  useFrame((state) => {
    if (meshRef.current && hovered && !isDragging) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } else if (meshRef.current && !isDragging) {
      meshRef.current.position.y = position[1];
    }
  });

  // Determine product shape and color based on item type
  const getProductGeometry = () => {
    const name = item.name.toLowerCase();

    // Use actual product dimensions if available
    const widthCm = parseFloat(item.widthCm) || 6;
    const heightCm = parseFloat(item.heightCm) || 6;
    const depthCm = parseFloat(item.depthCm) || 6;

    // Scale to Three.js units - use actual cm values for proper sizing
    // 1 cm = 0.1 Three.js units for realistic scale in hamper
    // Apply scale factor to match parent component calculations
    const scaleFactor = 0.7; // Match the scale factor used in Y position calculation

    // Check if this is a cylindrical item
    const isCylindrical = name.includes('candle') || name.includes('mug') ||
                         name.includes('cup') || name.includes('jar') ||
                         name.includes('cake');

    // For cylindrical items, we rotate the mesh instead of swapping dimensions
    // For box-shaped items, we swap dimensions in the geometry
    let effectiveWidth = widthCm;
    let effectiveHeight = heightCm;
    let effectiveDepth = depthCm;

    if (item.rotation?.needsRotation && !isCylindrical) {
      // Only swap dimensions for box-shaped items
      if (item.rotation.rotationAxis === 'width') {
        // Lying on width side: width becomes height, height becomes width
        effectiveHeight = widthCm;
        effectiveWidth = heightCm;
      } else if (item.rotation.rotationAxis === 'depth') {
        // Lying on depth side: depth becomes height, height becomes depth
        effectiveHeight = depthCm;
        effectiveDepth = heightCm;
      }
    }

    const width = effectiveWidth * 0.1 * scaleFactor;
    const height = effectiveHeight * 0.1 * scaleFactor;
    const depth = effectiveDepth * 0.1 * scaleFactor;

    // Determine shape based on product type, but use effective dimensions
    if (name.includes('candle')) {
      // Scented candle - cylindrical with glass jar appearance
      const radius = Math.min(width, depth) / 2;
      // AGGRESSIVE reduction for mobile - 8 segments instead of 16
      const segments = isMobile ? 8 : 32;
      return <cylinderGeometry args={[radius, radius, height, segments]} />;
    } else if (name.includes('mug') || name.includes('cup')) {
      // Realistic mug shape using custom lathe geometry
      const radius = Math.min(width, depth) / 2;
      const mugGeometry = useMemo(() => createMugGeometry(radius, height, isMobile), [radius, height, isMobile]);
      return <primitive object={mugGeometry} />;
    } else if (name.includes('jar')) {
      // Cylindrical products - use width as radius, height as height
      const radius = Math.min(width, depth) / 2;
      return <cylinderGeometry args={[radius, radius, height, 32]} />;
    } else if (name.includes('keychain')) {
      // Torus for keychain - small and ring-shaped
      const radius = Math.max(width, depth) / 4;
      const tube = radius / 3;
      return <torusGeometry args={[radius, tube, 16, 32]} />;
    } else if (name.includes('cake')) {
      // Cylindrical cake - use actual dimensions
      const radius = Math.min(width, depth) / 2;
      return <cylinderGeometry args={[radius, radius, height, 32]} />;
    } else {
      // Box-shaped products (default) - use effective dimensions
      return <boxGeometry args={[width, height, depth]} />;
    }
  };

  // Check if this is a couple mug
  const isCoupleMug = () => {
    if (!isMug || !item.customization) {
      return false;
    }

    const customization = typeof item.customization === 'string'
      ? JSON.parse(item.customization)
      : item.customization;

    const selectedType = customization?.selectedOptions?.Type;
    return selectedType && selectedType.includes('Couple');
  };

  // Get candle wax color based on selected fragrance
  const getCandleWaxColor = () => {
    // Check if this is a candle with customization
    if (!isCandle || !item.customization) {
      return '#F5E6D3'; // Default cream/beige
    }

    // Parse customization to get selected fragrance
    const customization = typeof item.customization === 'string'
      ? JSON.parse(item.customization)
      : item.customization;

    const selectedFragrance = customization?.selectedOptions?.Fragrance;

    // Fragrance color mapping
    const fragranceColors = {
      'Lavender': '#9B7EBD',      // Purple
      'Vanilla Rose': '#FFB6C1',  // Light pink
      'Sandalwood': '#D2B48C',    // Tan
      'Jasmine': '#FFFACD',       // Light yellow
      'Citrus Fresh': '#FFA500',  // Orange
      'Apple': '#DC143C'          // Red
    };

    return fragranceColors[selectedFragrance] || '#F5E6D3'; // Default cream/beige
  };

  const getProductColor = () => {
    const name = item.name.toLowerCase();

    if (name.includes('candle')) return getCandleWaxColor();
    if (name.includes('chocolate')) return '#8B4513';
    if (name.includes('mug') || name.includes('cup')) return '#FFFFFF';
    if (name.includes('keychain')) return '#FFD700';
    if (name.includes('notebook')) return '#4169E1';
    if (name.includes('frame')) return '#C0C0C0';
    if (name.includes('tshirt')) return '#FF6347';
    if (name.includes('cookie')) return '#F5DEB3';
    if (name.includes('shoes')) return '#000000';
    if (name.includes('nuts')) return '#D2691E';
    if (name.includes('cake')) return '#FFB6C1';
    if (name.includes('tea')) return '#228B22';
    if (name.includes('watch')) return '#C0C0C0'; // Silver/gray for watch

    return '#9B59B6'; // Default purple
  };

  // Get actual dimensions for display with safety checks
  const widthCm = (item.widthCm && !isNaN(parseFloat(item.widthCm))) ? parseFloat(item.widthCm) : 6;
  const heightCm = (item.heightCm && !isNaN(parseFloat(item.heightCm))) ? parseFloat(item.heightCm) : 6;
  const depthCm = (item.depthCm && !isNaN(parseFloat(item.depthCm))) ? parseFloat(item.depthCm) : 6;

  // Handle drag events
  const handlePointerDown = (e) => {
    if (isDraggable) {
      e.stopPropagation();
      setIsDragging(true);
      if (onDragStart) {
        onDragStart(item, item.position);
      }
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      if (onDragEnd) {
        onDragEnd();
      }
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isDragging && onClick) {
      onClick(e);
    }
  };

  // Determine actual mesh rotation for cylindrical items
  // Cylinders are created vertically (Y-axis), so we need to rotate them when lying down
  const isCylindrical = isCandle || isMug || item.name.toLowerCase().includes('jar') || item.name.toLowerCase().includes('cake');

  // Get the Y-axis rotation angle (for direction rotation when laid down)
  const rotationAngle = typeof item.rotationAngle === 'number' ? item.rotationAngle : 0;
  const yRotation = (rotationAngle * Math.PI) / 180; // Convert degrees to radians

  let meshRotation = [0, yRotation, 0]; // Default: only Y-axis rotation

  // Safety check: ensure item.rotation exists and is an object
  if (item.rotation && typeof item.rotation === 'object') {
    if (item.rotation.needsRotation && isCylindrical) {
      if (item.rotation.rotationAxis === 'width') {
        // Rotate 90° around Z-axis to lay on width side, plus Y-axis rotation
        meshRotation = [0, yRotation, Math.PI / 2];
      } else if (item.rotation.rotationAxis === 'depth') {
        // Rotate 90° around X-axis to lay on depth side, plus Y-axis rotation
        meshRotation = [Math.PI / 2, yRotation, 0];
      }
    } else if (item.rotation.needsRotation) {
      // For non-cylindrical items that are laid down, apply Y-axis rotation
      meshRotation = [0, yRotation, 0];
    }
  }

  return (
    <group>
      {/* Main Product Mesh with Rotation Support */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={meshRotation}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        {getProductGeometry()}
        <meshStandardMaterial
          color={getProductColor()}
          roughness={isCandle ? 0.1 : (isMug ? 0.2 : 0.3)}
          metalness={isCandle ? 0.0 : (isMug ? 0.1 : 0.6)}
          transparent={isCandle || isDragging}
          opacity={isCandle ? 0.5 : (isDragging ? 0.7 : 1.0)}
          emissive={isSelected ? '#FFD700' : (isDragging ? '#4F46E5' : (hovered ? getProductColor() : '#000000'))}
          emissiveIntensity={isSelected ? 0.6 : (isDragging ? 0.8 : (hovered ? 0.3 : 0))}
          envMapIntensity={isCandle ? 1.5 : (isMug ? 0.8 : 1.0)}
          clearcoat={isMug ? 0.3 : 0}
          clearcoatRoughness={isMug ? 0.4 : 0}
        />
      </mesh>

      {/* Inner Wax Layer for Candle */}
      {isCandle && (
        <>
          <mesh
            position={position}
            castShadow
          >
            <cylinderGeometry args={[
              (Math.min(widthCm, depthCm) * 0.1 / 2) * 0.85,
              (Math.min(widthCm, depthCm) * 0.1 / 2) * 0.85,
              (heightCm * 0.1) * 0.9,
              32
            ]} />
            <meshStandardMaterial
              color={getCandleWaxColor()}
              roughness={0.6}
              metalness={0.0}
              opacity={1.0}
            />
          </mesh>

          {/* Candle Wick */}
          <mesh
            position={[position[0], position[1] + (heightCm * 0.1 / 2), position[2]]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial
              color="#2C2416"
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>

          {/* Wick Flame (small glowing sphere) */}
          <mesh
            position={[position[0], position[1] + (heightCm * 0.1 / 2) + 0.2, position[2]]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color="#FFA500"
              emissive="#FF6600"
              emissiveIntensity={1.5}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Point light for flame glow */}
          <pointLight
            position={[position[0], position[1] + (heightCm * 0.1 / 2) + 0.2, position[2]]}
            color="#FFA500"
            intensity={0.5}
            distance={2}
            decay={2}
          />
        </>
      )}



      {/* "2" Text for Couple Mugs */}
      {isMug && isCoupleMug() && (
        <Text
          position={[position[0], position[1], position[2] + (Math.min(widthCm, depthCm) / 10 / 2) * 0.8]}
          fontSize={0.35}
          color="#FF1493"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#FFFFFF"
        >
          2
        </Text>
      )}

      {/* Selection Ring */}
      {isSelected && !isDragging && (
        <mesh position={[position[0], position[1] - 0.3, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Dragging Indicator */}
      {isDragging && (
        <>
          <mesh position={[position[0], position[1] - 0.3, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.75, 32]} />
            <meshBasicMaterial color="#4F46E5" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[position[0], position[1] + 1.2, position[2]]}
            fontSize={0.18}
            color="#4F46E5"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#FFFFFF"
          >
            🔄 Dragging...
          </Text>
        </>
      )}



      {/* Product label with dimensions on hover or click */}
      {(hovered || isSelected) && !isDragging && (
        <>
          <Text
            position={[position[0], position[1] + 1, position[2]]}
            fontSize={0.16}
            color="#1F2937"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#FFFFFF"
          >
            {item.name}
          </Text>
          <Text
            position={[position[0], position[1] + 0.7, position[2]]}
            fontSize={0.11}
            color="#6366F1"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#FFFFFF"
          >
            {`📏 ${widthCm.toFixed(1)}×${depthCm.toFixed(1)}×${heightCm.toFixed(1)} cm`}
          </Text>
        </>
      )}




      {/* Rotation button removed - now using control panel */}
    </group>
  );
}

/**
 * Interactive Grid Spot Component with HTML5 Drag & Drop Support
 * Only renders when in placement mode (isHighlighted = true)
 * This prevents blocking OrbitControls when not placing items
 */
function GridSpot({ position, isOccupied, onClick, isHighlighted, isDropTarget = false, onDragOver, onDrop, spotIndex }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Only render grid spots when in placement mode
  if (!isHighlighted) {
    return null;
  }

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick && !isOccupied) {
      onClick();
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    if (onDragOver) {
      onDragOver(e, spotIndex);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (onDrop && !isOccupied) {
      onDrop(e, spotIndex);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerUp={handlePointerUp}
      visible={!isOccupied}
    >
      <boxGeometry args={[0.8, 0.05, 0.8]} />
      <meshStandardMaterial
        color={isDropTarget ? '#3B82F6' : (hovered ? '#059669' : '#10b981')}
        transparent
        opacity={isDropTarget ? 1.0 : (hovered ? 0.9 : 0.7)}
        emissive={isDropTarget ? '#3B82F6' : '#10b981'}
        emissiveIntensity={isDropTarget ? 1.0 : (hovered ? 0.6 : 0.4)}
      />
    </mesh>
  );
}

/**
 * Get actual box color from Tailwind gradient class
 */
const getBoxColor = (colorClass) => {
  // Map Tailwind gradient classes to actual hex colors
  const colorMap = {
    'from-amber-100 to-amber-200': '#FDE68A',      // Amber/Yellow
    'from-purple-100 to-purple-200': '#E9D5FF',    // Purple
    'from-rose-100 to-rose-200': '#FFE4E6',        // Rose/Pink
    'from-blue-100 to-blue-200': '#DBEAFE',        // Blue
  };

  return colorMap[colorClass] || '#F5E6D3'; // Default beige
};

/**
 * 3D Hamper Box Component with Drag & Drop Support
 */
function HamperBoxMesh({
  box,
  placedItems,
  onSpotClick,
  selectedItemToPlace,
  onItemClick,
  isPreview = false,
  hideLid = false,
  onDragOverSpot = null,
  onDropOnSpot = null,
  draggedItem = null,
  hoveredSpotIndex = null,
  onToggleRotation = null,
  isMobile = false
}) {
  const boxRef = useRef();
  const [internalDraggedItem, setInternalDraggedItem] = useState(null);
  const [draggedFromPosition, setDraggedFromPosition] = useState(null);
  const [hoveredSpot, setHoveredSpot] = useState(null);

  // Parse box dimensions
  const [length, width, height] = box.dimensionsCm.split(' × ').map(d => parseFloat(d) / 10);

  // Get the actual box color
  const boxColor = getBoxColor(box.color);

  // Calculate item positions in 3D space (X and Z only, Y calculated per item)
  const getItemPosition = (index) => {
    const { rows, cols } = box.gridSize;
    const row = Math.floor(index / cols);
    const col = index % cols;

    const cellWidth = length / cols;
    const cellDepth = width / rows;

    const x = (col - cols / 2 + 0.5) * cellWidth;
    const z = (row - rows / 2 + 0.5) * cellDepth;

    // Y position will be calculated based on item height
    const y = 0;

    return [x, y, z];
  };

  // Handle drag start (for internal 3D dragging)
  const handleDragStart = (item, fromPosition) => {
    setInternalDraggedItem(item);
    setDraggedFromPosition(fromPosition);
  };

  // Handle drag end (for internal 3D dragging)
  const handleDragEnd = () => {
    setInternalDraggedItem(null);
    setDraggedFromPosition(null);
    setHoveredSpot(null);
  };

  // Handle drop on spot (for internal 3D dragging)
  const handleDropOnSpot = (toPosition) => {
    if (internalDraggedItem && draggedFromPosition !== null) {
      // Check if spot is occupied by a different item
      const isOccupied = placedItems.some(
        item => item.position === toPosition && item.position !== draggedFromPosition
      );

      if (!isOccupied && onItemClick) {
        // Trigger the move by calling onItemClick with the dragged item
        // This will use the existing logic in the parent component
        onItemClick(internalDraggedItem, draggedFromPosition);
        // Then trigger spot click for the new position
        setTimeout(() => {
          if (onSpotClick) {
            onSpotClick(toPosition);
          }
        }, 0);
      }
    }
    handleDragEnd();
  };

  return (
    <group ref={boxRef}>
      {/* Box Floor - positioned so top surface is at y=0 (where walls start) */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.1, width]} />
        <meshStandardMaterial
          color={isPreview ? boxColor : "#F5E6D3"}
          roughness={0.6}
          metalness={0.1}
          side={2}
        />
      </mesh>

      {/* Box Dimension Labels - SKIP on mobile for MASSIVE performance gain */}
      {!isMobile && (
        <>
          <Text
            position={[0, -0.2, width / 2 + 0.3]}
            fontSize={0.16}
            color="#374151"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#FFFFFF"
          >
            {box.dimensionsCm}
          </Text>
          <Text
            position={[0, -0.4, width / 2 + 0.3]}
            fontSize={0.13}
            color="#6366F1"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#FFFFFF"
          >
            {`Capacity: ${box.capacity} items`}
          </Text>
        </>
      )}

      {/* Box Walls - Transparent glass-like in preview mode */}
      {/* Back Wall */}
      <mesh position={[0, height / 2, -width / 2]}>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color={isPreview ? boxColor : "#F5E6D3"}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={isPreview ? 0.25 : 0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-length / 2, height / 2, 0]}>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color={isPreview ? boxColor : "#F5E6D3"}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={isPreview ? 0.25 : 0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Right Wall */}
      <mesh position={[length / 2, height / 2, 0]}>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color={isPreview ? boxColor : "#F5E6D3"}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={isPreview ? 0.25 : 0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, height / 2, width / 2]}>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color={isPreview ? boxColor : "#F5E6D3"}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={isPreview ? 0.25 : 0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Transparent Lid (only in preview mode and when not animating) */}
      {isPreview && !hideLid && (
        <mesh position={[0, height + 0.05, 0]}>
          <boxGeometry args={[length, 0.15, width]} />
          <meshStandardMaterial
            color={boxColor}
            roughness={0.05}
            metalness={0.4}
            transparent
            opacity={0.2}
            envMapIntensity={2.0}
          />
        </mesh>
      )}

      {/* Dimension Lines - Show Length, Width, and Height measurements - NOW ON MOBILE TOO! */}
      <>
        {/* Length dimension (along X-axis) - Bottom front */}
        <DimensionLine
          start={[-length / 2, -0.25, width / 2 + 0.4]}
          end={[length / 2, -0.25, width / 2 + 0.4]}
          label={`${(length * 10).toFixed(0)}cm`}
          color="#EF4444"
          axis="x"
        />

        {/* Width dimension (along Z-axis) - Bottom right */}
        <DimensionLine
          start={[length / 2 + 0.4, -0.25, -width / 2]}
          end={[length / 2 + 0.4, -0.25, width / 2]}
          label={`${(width * 10).toFixed(0)}cm`}
          color="#3B82F6"
          axis="z"
        />

        {/* Height dimension (along Y-axis) - Back right */}
        <DimensionLine
          start={[length / 2 + 0.4, 0, -width / 2 - 0.4]}
          end={[length / 2 + 0.4, height, -width / 2 - 0.4]}
          label={`${(height * 10).toFixed(0)}cm`}
          color="#10B981"
          axis="y"
        />
      </>

      {/* Interactive Grid Spots (only show if onSpotClick is provided) */}
      {onSpotClick && Array.from({ length: box.capacity }).map((_, position) => {
        const isOccupied = placedItems.some(item => item.position === position);
        const isHighlighted = (selectedItemToPlace && !isOccupied) || (internalDraggedItem && draggedFromPosition !== null) || (draggedItem && !isOccupied);
        const isDropTarget = (internalDraggedItem && hoveredSpot === position) || (draggedItem && hoveredSpotIndex === position);

        return (
          <GridSpot
            key={`spot-${position}`}
            position={getItemPosition(position)}
            isOccupied={isOccupied}
            isHighlighted={isHighlighted}
            isDropTarget={isDropTarget}
            spotIndex={position}
            onDragOver={onDragOverSpot}
            onDrop={onDropOnSpot}
            onClick={() => {
              if (internalDraggedItem && draggedFromPosition !== null) {
                handleDropOnSpot(position);
              } else if (!isOccupied && onSpotClick) {
                onSpotClick(position);
              }
            }}
          />
        );
      })}

      {/* Placed Items */}
      {placedItems.map((item, idx) => {
        // Calculate proper position based on item dimensions and rotation
        const itemWidthCm = parseFloat(item.widthCm) || 6;
        const itemDepthCm = parseFloat(item.depthCm) || 6;
        const itemHeightCm = parseFloat(item.heightCm) || 6;
        const scaleFactor = 0.7; // Same scaling factor as in getProductGeometry

        // Determine effective dimensions based on rotation
        let effectiveWidthCm = itemWidthCm;
        let effectiveDepthCm = itemDepthCm;
        let effectiveHeightCm = itemHeightCm;

        if (item.rotation?.needsRotation) {
          // When rotated, dimensions swap
          if (item.rotation.rotationAxis === 'width') {
            // Lying on width side: width becomes height, height becomes width
            effectiveHeightCm = itemWidthCm;
            effectiveWidthCm = itemHeightCm;
          } else if (item.rotation.rotationAxis === 'depth') {
            // Lying on depth side: depth becomes height, height becomes depth
            effectiveHeightCm = itemDepthCm;
            effectiveDepthCm = itemHeightCm;
          }
        }

        const itemWidthUnits = effectiveWidthCm * 0.1 * scaleFactor;
        const itemDepthUnits = effectiveDepthCm * 0.1 * scaleFactor;
        const itemHeightUnits = effectiveHeightCm * 0.1 * scaleFactor;

        // Get base position (x, y, z) from grid
        const basePosition = getItemPosition(item.position);

        // Calculate grid cell dimensions
        const { rows, cols } = box.gridSize;
        const cellWidth = length / cols;
        const cellDepth = width / rows;

        // Start with base grid position
        let adjustedX = basePosition[0];
        let adjustedZ = basePosition[2];
        // Position item sitting on the box floor
        // Floor is at y=-0.05 with thickness 0.1, so floor top is at y=0
        // Item center should be at: floor top (0) + half item height + small gap
        const floorTopY = 0;
        const gapAboveFloor = 0.02; // Small gap to prevent z-fighting
        let adjustedY = floorTopY + gapAboveFloor + (itemHeightUnits / 2);

        // Debug log for first item
        if (idx === 0) {
          console.log('🔍 Item positioning:', {
            itemName: item.name,
            itemHeightCm: effectiveHeightCm,
            itemHeightUnits,
            adjustedY,
            itemBottomY: adjustedY - (itemHeightUnits / 2),
            floorTopY: floorTopY,
            gapAboveFloor: gapAboveFloor,
            expectedBottomY: floorTopY + gapAboveFloor
          });
        }

        // Get all other items with their calculated positions and dimensions
        const otherItems = placedItems
          .filter(other => other.id !== item.id)
          .map(other => {
            // Calculate other item's effective dimensions
            const otherWidthCm = parseFloat(other.widthCm) || 6;
            const otherDepthCm = parseFloat(other.depthCm) || 6;
            const otherHeightCm = parseFloat(other.heightCm) || 6;

            let otherEffectiveWidth = otherWidthCm;
            let otherEffectiveDepth = otherDepthCm;
            let otherEffectiveHeight = otherHeightCm;

            if (other.rotation?.needsRotation) {
              if (other.rotation.rotationAxis === 'width') {
                otherEffectiveHeight = otherWidthCm;
                otherEffectiveWidth = otherHeightCm;
              } else if (other.rotation.rotationAxis === 'depth') {
                otherEffectiveHeight = otherDepthCm;
                otherEffectiveDepth = otherHeightCm;
              }
            }

            const otherWidthUnits = otherEffectiveWidth * 0.1 * scaleFactor;
            const otherDepthUnits = otherEffectiveDepth * 0.1 * scaleFactor;
            const otherHeightUnits = otherEffectiveHeight * 0.1 * scaleFactor;
            const otherPos = getItemPosition(other.position);

            return {
              position: otherPos,
              width: otherWidthUnits,
              depth: otherDepthUnits,
              height: otherHeightUnits,
              gridPosition: other.position
            };
          });

        // AABB Collision Detection and Resolution
        // Check for collisions with all other items and adjust position
        const collisionMargin = 0.15; // Minimum spacing between items

        for (const other of otherItems) {
          // Calculate bounding boxes
          const thisMinX = adjustedX - (itemWidthUnits / 2);
          const thisMaxX = adjustedX + (itemWidthUnits / 2);
          const thisMinZ = adjustedZ - (itemDepthUnits / 2);
          const thisMaxZ = adjustedZ + (itemDepthUnits / 2);

          const otherMinX = other.position[0] - (other.width / 2);
          const otherMaxX = other.position[0] + (other.width / 2);
          const otherMinZ = other.position[2] - (other.depth / 2);
          const otherMaxZ = other.position[2] + (other.depth / 2);

          // Check for overlap in X and Z axes
          const overlapX = thisMaxX + collisionMargin > otherMinX && thisMinX - collisionMargin < otherMaxX;
          const overlapZ = thisMaxZ + collisionMargin > otherMinZ && thisMinZ - collisionMargin < otherMaxZ;

          if (overlapX && overlapZ) {
            // Collision detected! Calculate separation vector
            const centerDiffX = adjustedX - other.position[0];
            const centerDiffZ = adjustedZ - other.position[2];

            // Calculate overlap amounts
            const overlapAmountX = (itemWidthUnits / 2) + (other.width / 2) + collisionMargin - Math.abs(centerDiffX);
            const overlapAmountZ = (itemDepthUnits / 2) + (other.depth / 2) + collisionMargin - Math.abs(centerDiffZ);

            // Resolve collision by moving along the axis with smallest overlap
            if (overlapAmountX < overlapAmountZ) {
              // Move along X axis
              adjustedX += (centerDiffX > 0 ? overlapAmountX : -overlapAmountX);
            } else {
              // Move along Z axis
              adjustedZ += (centerDiffZ > 0 ? overlapAmountZ : -overlapAmountZ);
            }
          }
        }

        // Clamp X position to keep item within box width
        // Account for wall thickness (0.1 units) and add safety margin
        const wallThickness = 0.1;
        const safetyMargin = 0.1; // Increased from 0.05 to prevent wall penetration
        const boxWidthUnits = length;
        const maxX = (boxWidthUnits / 2) - (itemWidthUnits / 2) - wallThickness - safetyMargin;
        const minX = -(boxWidthUnits / 2) + (itemWidthUnits / 2) + wallThickness + safetyMargin;
        const clampedX = Math.max(minX, Math.min(maxX, adjustedX));

        // Clamp Z position to keep item within box depth
        const boxDepthUnits = width;
        const maxZ = (boxDepthUnits / 2) - (itemDepthUnits / 2) - wallThickness - safetyMargin;
        const minZ = -(boxDepthUnits / 2) + (itemDepthUnits / 2) + wallThickness + safetyMargin;
        const clampedZ = Math.max(minZ, Math.min(maxZ, adjustedZ));

        // Clamp Y position to keep item within box height and above floor
        const boxHeightUnits = height;
        const maxY = boxHeightUnits - (itemHeightUnits / 2) - safetyMargin;
        const minY = floorTopY + gapAboveFloor + (itemHeightUnits / 2); // Minimum Y to keep item above floor
        const clampedY = Math.max(minY, Math.min(adjustedY, maxY));

        // Validation: Check if item exceeds box boundaries (should not happen with proper validation)
        if (itemHeightUnits > boxHeightUnits) {
          console.warn(`⚠️ Item ${item.name} height (${itemHeightUnits.toFixed(2)}) exceeds box height (${boxHeightUnits.toFixed(2)})!`);
        }
        if (itemWidthUnits > boxWidthUnits - (2 * wallThickness)) {
          console.warn(`⚠️ Item ${item.name} width (${itemWidthUnits.toFixed(2)}) exceeds box width (${(boxWidthUnits - 2 * wallThickness).toFixed(2)})!`);
        }
        if (itemDepthUnits > boxDepthUnits - (2 * wallThickness)) {
          console.warn(`⚠️ Item ${item.name} depth (${itemDepthUnits.toFixed(2)}) exceeds box depth (${(boxDepthUnits - 2 * wallThickness).toFixed(2)})!`);
        }

        const adjustedPosition = [clampedX, clampedY, clampedZ];

        return (
          <Product3DModel
            key={`${item.id}-${item.position}-${idx}`}
            item={item}
            position={adjustedPosition}
            onClick={onItemClick ? (e) => {
              e.stopPropagation();
              onItemClick(item, item.position);
            } : null}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDraggable={false}
            isSelected={selectedItemToPlace && selectedItemToPlace.id === item.id && selectedItemToPlace.position === item.position}
            onToggleRotation={onToggleRotation}
            isMobile={isMobile}
          />
        );
      })}
    </group>
  );
}

export default HamperBoxMesh;

