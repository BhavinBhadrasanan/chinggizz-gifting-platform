import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Package } from 'lucide-react';

/**
 * 3D Box Component - Realistic transparent gift box
 */
function Box3D({ widthCm, heightCm, depthCm, boxType }) {
  const boxRef = useRef();

  // Auto-rotate the box
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.005;
    }
  });

  // Convert cm to 3D units (scale down)
  const length = widthCm / 10;
  const height = heightCm / 10;
  const width = depthCm / 10;

  console.log('📦 Box3D rendering:', { widthCm, heightCm, depthCm, length, height, width, boxType });

  // Determine box color based on type
  const getBoxColor = () => {
    if (boxType?.toLowerCase().includes('transparent')) return '#F5E6D3';
    if (boxType?.toLowerCase().includes('closed')) return '#D4A574';
    return '#F5E6D3';
  };

  const boxColor = getBoxColor();
  const isTransparent = boxType?.toLowerCase().includes('transparent');

  return (
    <group ref={boxRef} position={[0, 0, 0]}>
      {/* Box Floor */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.1, width]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Box Walls - Transparent or Solid */}
      {/* Back Wall */}
      <mesh position={[0, height / 2 + 0.05, -width / 2]}>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.1}
          metalness={0.3}
          transparent={isTransparent}
          opacity={isTransparent ? 0.25 : 0.9}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-length / 2, height / 2 + 0.05, 0]}>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.1}
          metalness={0.3}
          transparent={isTransparent}
          opacity={isTransparent ? 0.25 : 0.9}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Right Wall */}
      <mesh position={[length / 2, height / 2 + 0.05, 0]}>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.1}
          metalness={0.3}
          transparent={isTransparent}
          opacity={isTransparent ? 0.25 : 0.9}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, height / 2 + 0.05, width / 2]}>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color={boxColor}
          roughness={0.1}
          metalness={0.3}
          transparent={isTransparent}
          opacity={isTransparent ? 0.25 : 0.9}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Cart Box Preview 3D Component
 * Displays a realistic 3D rotating box with dimensions
 */
export default function CartBoxPreview3D({ widthCm, heightCm, depthCm, boxType }) {
  const [error, setError] = React.useState(false);

  if (error) {
    // Fallback to simple CSS 3D if WebGL fails
    return (
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-200">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-primary-600" />
          <p className="text-xs font-bold text-primary-900">Your Selected Box</p>
        </div>

        {/* Simple 2D Box Preview */}
        <div className="relative w-full h-40 bg-gradient-to-br from-white to-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">{boxType}</p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-2 text-center mt-3">
          <div className="bg-white rounded-lg p-2">
            <p className="text-[10px] text-gray-600">Width</p>
            <p className="text-xs font-bold text-primary-700">{widthCm}cm</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-[10px] text-gray-600">Height</p>
            <p className="text-xs font-bold text-primary-700">{heightCm}cm</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-[10px] text-gray-600">Depth</p>
            <p className="text-xs font-bold text-primary-700">{depthCm}cm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-200">
      <div className="flex items-center gap-2 mb-2">
        <Package className="h-4 w-4 text-primary-600" />
        <p className="text-xs font-bold text-primary-900">Your Selected Box</p>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-40 bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            console.log('✅ Cart 3D Canvas created');
          }}
          onError={(error) => {
            console.error('❌ Cart 3D Canvas error:', error);
            setError(true);
          }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#F5E6D3" />
            </mesh>
          }>
            {/* Camera - Positioned to show box centered and slightly lower */}
            <PerspectiveCamera
              makeDefault
              position={[4, 2, 4]}
              fov={45}
              lookAt={[0, 1, 0]}
            />

            {/* Orbit Controls for debugging */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              target={[0, 1, 0]}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />

            {/* Lights */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />

            {/* Environment for reflections */}
            <Environment preset="sunset" />

            {/* 3D Box */}
            <Box3D
              widthCm={widthCm}
              heightCm={heightCm}
              depthCm={depthCm}
              boxType={boxType}
            />

            {/* Ground Shadows */}
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.3}
              scale={6}
              blur={1.5}
              far={3}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-2 text-center mt-3">
        <div className="bg-white rounded-lg p-2">
          <p className="text-[10px] text-gray-600">Width</p>
          <p className="text-xs font-bold text-primary-700">{widthCm}cm</p>
        </div>
        <div className="bg-white rounded-lg p-2">
          <p className="text-[10px] text-gray-600">Height</p>
          <p className="text-xs font-bold text-primary-700">{heightCm}cm</p>
        </div>
        <div className="bg-white rounded-lg p-2">
          <p className="text-[10px] text-gray-600">Depth</p>
          <p className="text-xs font-bold text-primary-700">{depthCm}cm</p>
        </div>
      </div>
    </div>
  );
}

