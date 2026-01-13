import React, { Suspense } from 'react';
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
  if (!selectedBox) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold">Select a box to start building</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent', touchAction: 'none' }}
      >
        <Suspense fallback={<Loader />}>
          {/* Camera - Zoomed in closer for better view */}
          <PerspectiveCamera makeDefault position={[3, 2.5, 3]} fov={50} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
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

          {/* Sky Background */}
          <Sky
            distance={450000}
            sunPosition={[5, 1, 8]}
            inclination={0.6}
            azimuth={0.25}
          />

          {/* Environment for reflections */}
          <Environment preset="sunset" />

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

          {/* Ground Shadows */}
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4}
          />

          {/* Grid Helper (optional) */}
          <gridHelper args={[20, 20, '#cccccc', '#eeeeee']} position={[0, -0.05, 0]} />

          {/* Controls - Always enabled for camera rotation */}
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
            maxPolarAngle={Math.PI / 2}
            zoomSpeed={0.8}
            panSpeed={0.5}
            rotateSpeed={0.8}
            mouseButtons={{
              LEFT: 0,   // Rotate
              MIDDLE: 1, // Zoom
              RIGHT: 2   // Pan
            }}
          />
        </Suspense>
      </Canvas>

      {/* Controls Info Overlay - pointer-events-none to allow interaction with canvas */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg pointer-events-none">
        <p className="text-xs text-gray-600 font-semibold">
          🖱️ <strong>Left Click + Drag:</strong> Rotate | <strong>Right Click + Drag:</strong> Pan | <strong>Scroll:</strong> Zoom
        </p>
      </div>

      {/* Item Count Badge - pointer-events-none to allow interaction with canvas */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-lg pointer-events-none">
        <p className="text-sm font-bold">
          {placedItems.length} / {selectedBox.capacity} Items
        </p>
      </div>
    </div>
  );
}

