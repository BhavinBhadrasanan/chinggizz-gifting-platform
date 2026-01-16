import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html, Sky } from '@react-three/drei';
import HamperBoxMesh from './HamperBox3D';

/**
 * Loading fallback component
 */
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary-600 font-semibold">Loading 3D Scene...</p>
      </div>
    </Html>
  );
}

/**
 * Error Boundary for 3D Canvas
 */
class Canvas3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('3D Error Boundary caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Canvas crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
class Canvas3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Main 3D Scene Component
 * Renders the hamper box with realistic lighting and shadows
 */
export default function HamperScene3D({
  selectedBox,
  placedItems,
  autoRotate = false,
  onSpotClick = null,
  selectedItemToPlace = null,
  onItemClick = null,
  onDragOverSpot = null,
  onDropOnSpot = null,
  onToggleRotation = null,
  draggedItem = null,
  hoveredSpotIndex = null
}) {
  const [webGLError, setWebGLError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(mobile);
      console.log('📱 Mobile device detected:', mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('❌ WebGL not supported');
        setWebGLError(true);
      } else {
        console.log('✅ WebGL supported');
      }
    } catch (e) {
      console.error('❌ WebGL error:', e);
      setWebGLError(true);
    }
  }, []);

  if (!selectedBox) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold">Select a box to start building</p>
        </div>
      </div>
    );
  }

  // Mobile-optimized 3D settings
  const mobileSettings = {
    dpr: [0.5, 1], // Lower pixel ratio for mobile
    shadows: false, // Disable shadows on mobile
    antialias: false, // Disable antialiasing on mobile
    powerPreference: "low-power" // Use low power mode
  };

  const desktopSettings = {
    dpr: [1, 1.5],
    shadows: true,
    antialias: true,
    powerPreference: "high-performance"
  };

  const settings = isMobile ? mobileSettings : desktopSettings;

  // Fallback UI if WebGL fails
  const FallbackUI = () => (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 relative p-6">
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📦 {selectedBox.name} Box
          </h3>
          <div className="space-y-3 text-left">
            <p className="text-sm text-gray-600">
              <strong>Dimensions:</strong> {selectedBox.dimensionsCm}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Capacity:</strong> {selectedBox.capacity} items
            </p>
            <p className="text-sm text-gray-600">
              <strong>Items Placed:</strong> {placedItems.length} / {selectedBox.capacity}
            </p>
          </div>

          {placedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Items in Box:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {placedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <button
                      onClick={() => onItemClick && onItemClick(item)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            💡 3D view unavailable. Using simplified view.
          </p>
        </div>
      </div>
    </div>
  );

  if (webGLError) {
    return <FallbackUI />;
  }

  return (
    <Canvas3DErrorBoundary fallback={<FallbackUI />}>
      <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 relative">
        <Canvas
          shadows={settings.shadows}
          dpr={settings.dpr}
          gl={{
            antialias: settings.antialias,
            alpha: true,
            powerPreference: settings.powerPreference,
            failIfMajorPerformanceCaveat: false // Don't fail on slow devices
          }}
          performance={{ min: 0.3 }}
          style={{ background: 'transparent', touchAction: 'none' }}
          onCreated={({ gl }) => {
            console.log('✅ 3D Canvas created successfully');
            gl.setClearColor(0x000000, 0);
          }}
          onError={(error) => {
            console.error('❌ Canvas error:', error);
            setWebGLError(true);
          }}
        >
        <Suspense fallback={<Loader />}>
          {/* Camera - Optimized angle and zoom for attractive view */}
          <PerspectiveCamera makeDefault position={[3.5, 3, 3.5]} fov={50} />

          {/* Lighting - Simplified for mobile */}
          <ambientLight intensity={isMobile ? 0.8 : 0.5} />
          {!isMobile && (
            <>
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              <pointLight position={[-10, 10, -10]} intensity={0.5} />
              <spotLight
                position={[0, 15, 0]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                castShadow
              />
            </>
          )}
          {isMobile && (
            <>
              {/* Simplified lighting for mobile */}
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[-5, 5, -5]} intensity={0.3} />
            </>
          )}

          {/* Sky Background - Only on desktop */}
          {!isMobile && (
            <Sky
              distance={450000}
              sunPosition={[5, 1, 8]}
              inclination={0.6}
              azimuth={0.25}
            />
          )}

          {/* Environment for reflections - Simplified for mobile */}
          {!isMobile && <Environment preset="sunset" />}

          {/* Hamper Box */}
          <HamperBoxMesh
            box={selectedBox}
            placedItems={placedItems}
            onSpotClick={onSpotClick}
            selectedItemToPlace={selectedItemToPlace}
            onItemClick={onItemClick}
            onDragOverSpot={onDragOverSpot}
            onDropOnSpot={onDropOnSpot}
            onToggleRotation={onToggleRotation}
            draggedItem={draggedItem}
            hoveredSpotIndex={hoveredSpotIndex}
          />

          {/* Ground Shadows - Simplified for mobile */}
          {!isMobile && (
            <ContactShadows
              position={[0, -0.05, 0]}
              opacity={0.4}
              scale={20}
              blur={2}
              far={4}
            />
          )}

          {/* Grid Helper (optional) */}
          <gridHelper args={[20, 20, '#cccccc', '#eeeeee']} position={[0, -0.05, 0]} />

          {/* Controls - Optimized for better user experience */}
          <OrbitControls
            makeDefault
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            zoomSpeed={1}
            panSpeed={0.5}
            rotateSpeed={1}
            mouseButtons={{
              LEFT: 0,   // Rotate
              MIDDLE: 1, // Zoom
              RIGHT: 2   // Pan
            }}
          />
        </Suspense>
      </Canvas>

      {/* Controls Info Overlay - pointer-events-none to allow interaction with canvas */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow-lg pointer-events-none">
        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold">
          {isMobile ? (
            <>👆 <strong>Swipe:</strong> Rotate | <strong>Pinch:</strong> Zoom</>
          ) : (
            <>🖱️ <strong>Left Click + Drag:</strong> Rotate | <strong>Right Click + Drag:</strong> Pan | <strong>Scroll:</strong> Zoom</>
          )}
        </p>
      </div>

      {/* Item Count Badge - pointer-events-none to allow interaction with canvas */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg pointer-events-none">
        <p className="text-xs sm:text-sm font-bold">
          {placedItems.length} / {selectedBox.capacity} Items
        </p>
      </div>
    </div>
    </Canvas3DErrorBoundary>
  );
}

