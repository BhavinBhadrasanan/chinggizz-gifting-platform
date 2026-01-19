import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Environment, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Package, Sparkles } from 'lucide-react';
import HamperBoxMesh from './HamperBox3D';

/**
 * Loading fallback component - Enhanced for mobile
 */
function Loader() {
  const [loadingTime, setLoadingTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary-600 font-semibold text-center">Loading 3D Scene...</p>
        <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
          {loadingTime < 5 ? (
            "Preparing your hamper box..."
          ) : loadingTime < 10 ? (
            "Loading 3D models... Please wait"
          ) : loadingTime < 20 ? (
            "Almost there! Building the scene..."
          ) : (
            "Still loading... Your device is working hard!"
          )}
        </p>
        {loadingTime > 15 && (
          <p className="text-xs text-blue-600 mt-1 text-center max-w-xs">
            💡 Tip: The 3D view is loading. This is normal on mobile devices.
          </p>
        )}
      </div>
    </Html>
  );
}

/**
 * Component to signal when 3D scene is ready
 */
function SceneReady({ onReady }) {
  React.useEffect(() => {
    console.log('✅ 3D Scene components loaded');
    onReady && onReady();
  }, [onReady]);
  return null;
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
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [canvasError, setCanvasError] = useState(false);

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
        // Check WebGL capabilities
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          console.log('🎨 GPU Renderer:', renderer);
        }
      }
    } catch (e) {
      console.error('❌ WebGL error:', e);
      setWebGLError(true);
    }
  }, []);

  // Callback when 3D scene is ready
  const handleSceneReady = React.useCallback(() => {
    console.log('✅ 3D Scene fully loaded and ready');
    setSceneLoaded(true);
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

  // Mobile-optimized 3D settings - AGGRESSIVE optimization for mobile
  const mobileSettings = {
    dpr: [0.5, 0.75], // Very low pixel ratio for mobile - prioritize performance
    shadows: false, // Disable shadows on mobile
    antialias: false, // Disable antialiasing on mobile
    powerPreference: "low-power", // Use low power mode
    precision: "lowp" // Low precision for mobile
  };

  const desktopSettings = {
    dpr: [1, 1.5],
    shadows: true,
    antialias: true,
    powerPreference: "high-performance",
    precision: "highp"
  };

  const settings = isMobile ? mobileSettings : desktopSettings;

  // Fallback UI if WebGL fails - GLASSY MOBILE DESIGN
  const FallbackUI = () => (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative p-4 md:p-6">
      {/* Glassy overlay effect */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

      {/* Animated background orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center h-full flex flex-col justify-center">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl border border-white/50">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-2xl shadow-lg">
              <Package className="h-12 w-12 text-white" />
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            📦 {selectedBox.name} Box
          </h3>

          <div className="space-y-3 text-left bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-between">
              <strong className="text-primary-700">Dimensions:</strong>
              <span className="font-mono text-gray-900">{selectedBox.dimensionsCm}</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-between">
              <strong className="text-primary-700">Capacity:</strong>
              <span className="font-semibold text-gray-900">{selectedBox.capacity} items</span>
            </p>
            <p className="text-sm md:text-base text-gray-700 flex items-center justify-between">
              <strong className="text-primary-700">Items Placed:</strong>
              <span className="font-bold text-secondary-600">{placedItems.length} / {selectedBox.capacity}</span>
            </p>
          </div>

          {placedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/60">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Items in Box
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                {placedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-white/80 hover:bg-white/90 transition-all">
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <button
                      onClick={() => onItemClick && onItemClick(item)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1 rounded-full transition-all hover:scale-105"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-lg">
            <p className="text-xs text-blue-700 font-medium flex items-center justify-center gap-2">
              <span className="text-base">💡</span>
              3D view unavailable. Using simplified glassy view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Show fallback UI ONLY if WebGL is not supported OR Canvas has critical error
  // DO NOT show fallback just because loading is slow - let it load!
  if (webGLError || canvasError) {
    return <FallbackUI />;
  }

  return (
    <Canvas3DErrorBoundary fallback={<FallbackUI />}>
      {/* BEAUTIFUL GLASSY CONTAINER - Premium smooth experience */}
      <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative border-2 border-white/60">
        {/* Multi-layer gradient background for depth and smoothness */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-50/60 via-transparent to-cyan-50/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Animated gradient orbs - beautiful smooth movement */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tl from-pink-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/10 via-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        {/* Glossy glass overlay - smooth and transparent */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.5px] pointer-events-none"></div>

        {/* Shine effect - premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

        {/* 3D Canvas - Beautiful smooth rendering */}
        <Canvas
          shadows={settings.shadows}
          dpr={settings.dpr}
          gl={{
            antialias: true, // Always enable for smooth edges
            alpha: true, // Transparent background
            powerPreference: settings.powerPreference,
            failIfMajorPerformanceCaveat: false, // Don't fail on slow devices
            precision: 'highp', // High precision for smooth rendering
            toneMapping: THREE.ACESFilmicToneMapping, // Beautiful color grading
            toneMappingExposure: 1.2, // Slightly brighter
            // Mobile-specific optimizations
            ...(isMobile && {
              stencil: false, // Disable stencil buffer on mobile
              depth: true, // Keep depth buffer for proper rendering
              logarithmicDepthBuffer: false, // Disable for better mobile performance
            })
          }}
          performance={{
            min: 0.1, // Allow very low performance - don't give up!
            max: 1,
            debounce: 200
          }}
          frameloop="demand" // Only render when needed - saves battery on mobile
          style={{ background: 'transparent', touchAction: 'none' }}
          onCreated={({ gl, scene, camera }) => {
            console.log('✅ 3D Canvas created successfully');
            gl.setClearColor(0x000000, 0);

            // Mobile-specific optimizations
            if (isMobile) {
              console.log('📱 Applying mobile-specific optimizations');
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // Cap pixel ratio
              scene.matrixAutoUpdate = true; // Ensure proper updates
            }

            // Mark scene as ready after a short delay to ensure everything is loaded
            setTimeout(() => {
              handleSceneReady();
            }, 100);
          }}
          onError={(error) => {
            console.error('❌ Canvas error:', error);
            setCanvasError(true);
          }}
        >
        <Suspense fallback={<Loader />}>
          {/* Camera - Beautiful angle for premium view */}
          <PerspectiveCamera makeDefault position={[3.5, 3, 3.5]} fov={50} />

          {/* Beautiful Lighting Setup - Smooth and glossy */}
          <ambientLight intensity={0.9} color="#ffffff" />

          {/* Key light - main illumination */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={isMobile ? 0.8 : 1.0}
            color="#fff5e6"
            castShadow={!isMobile}
          />

          {/* Fill light - soften shadows */}
          <directionalLight
            position={[-5, 3, -5]}
            intensity={0.4}
            color="#e6f3ff"
          />

          {/* Rim light - glossy edge highlight */}
          <directionalLight
            position={[0, 5, -8]}
            intensity={0.3}
            color="#fff0f5"
          />

          {!isMobile && (
            <>
              {/* Additional desktop lighting for extra smoothness */}
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

          {/* Environment for reflections - Only on desktop */}
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
            isMobile={isMobile}
          />

          {/* Ground Shadows - Only on desktop */}
          {!isMobile && (
            <ContactShadows
              position={[0, -0.05, 0]}
              opacity={0.4}
              scale={20}
              blur={2}
              far={4}
            />
          )}

          {/* Grid Helper - Simplified for mobile */}
          {!isMobile && <gridHelper args={[20, 20, '#cccccc', '#eeeeee']} position={[0, -0.05, 0]} />}
          {isMobile && <gridHelper args={[20, 10, '#cccccc', '#eeeeee']} position={[0, -0.05, 0]} />}

          {/* Controls - Optimized for mobile and desktop */}
          <OrbitControls
            makeDefault
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enablePan={!isMobile} // Disable pan on mobile to avoid conflicts with touch gestures
            enableZoom={true}
            enableRotate={true}
            enableDamping={!isMobile} // Disable damping on mobile for better performance
            dampingFactor={isMobile ? 0 : 0.05}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            zoomSpeed={isMobile ? 0.5 : 1} // Slower zoom on mobile
            panSpeed={0.5}
            rotateSpeed={isMobile ? 0.8 : 1} // Slightly slower rotation on mobile
            touches={{
              ONE: THREE.TOUCH.ROTATE, // One finger to rotate
              TWO: THREE.TOUCH.DOLLY_PAN // Two fingers to zoom
            }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,   // Rotate
              MIDDLE: THREE.MOUSE.DOLLY, // Zoom
              RIGHT: THREE.MOUSE.PAN   // Pan
            }}
          />

          {/* Signal when scene is ready */}
          <SceneReady onReady={handleSceneReady} />
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

