import React, { Suspense, useRef, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Package } from 'lucide-react';

/**
 * Error Boundary for 3D Canvas
 */
class Canvas3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('🚨 Canvas3D Error Boundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Canvas3D Error Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * 3D Box Component - Simple container box with lid
 */
function Box3D({ widthCm, heightCm, depthCm, boxType }) {
  const boxRef = useRef();

  // No auto-rotation - using OrbitControls instead

  // Convert cm to 3D units (scale down) - with safety checks
  const length = Math.max(0.1, widthCm / 10);
  const height = Math.max(0.1, heightCm / 10);
  const width = Math.max(0.1, depthCm / 10);

  console.log('📦 Box3D rendering:', { widthCm, heightCm, depthCm, length, height, width, boxType });

  // Determine box color based on type - Lighter, more transparent look
  const getBoxColor = () => {
    if (boxType?.toLowerCase().includes('transparent')) return '#F5F0E8';
    if (boxType?.toLowerCase().includes('closed')) return '#F5F0E8';
    return '#F5F0E8';
  };

  const boxColor = getBoxColor();
  const isTransparent = boxType?.toLowerCase().includes('transparent');

  // Wall thickness - thinner for cleaner look
  const wallThickness = 0.05;

  return (
    <group ref={boxRef}>
      {/* Box Floor - EXACT match to HamperBox3D */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.1, width]} />
        <meshStandardMaterial
          color="#F5E6D3"
          roughness={0.6}
          metalness={0.1}
          side={2}
        />
      </mesh>

      {/* Back Wall - EXACT match to HamperBox3D */}
      <mesh position={[0, height / 2, -width / 2]} castShadow receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color="#F5E6D3"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Left Wall - EXACT match to HamperBox3D */}
      <mesh position={[-length / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color="#F5E6D3"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Right Wall - EXACT match to HamperBox3D */}
      <mesh position={[length / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial
          color="#F5E6D3"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Front Wall - EXACT match to HamperBox3D */}
      <mesh position={[0, height / 2, width / 2]} castShadow receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial
          color="#F5E6D3"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.3}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* NO LID - Open box design matching HamperBox3D */}
    </group>
  );
}

/**
 * Cart Box Preview 3D Component
 * Displays a realistic 3D rotating box with dimensions
 */
export default function CartBoxPreview3D({ widthCm, heightCm, depthCm, boxType }) {
  const [error, setError] = React.useState(false);

  // Validate dimensions - prevent crashes from invalid values
  const isValidDimensions = widthCm > 0 && heightCm > 0 && depthCm > 0 &&
                           !isNaN(widthCm) && !isNaN(heightCm) && !isNaN(depthCm);

  console.log('🔍 CartBoxPreview3D props:', { widthCm, heightCm, depthCm, boxType, isValidDimensions });

  if (!isValidDimensions || error) {
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

  // Fallback UI component
  const FallbackUI = () => (
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

  return (
    <Canvas3DErrorBoundary fallback={<FallbackUI />}>
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-200">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-primary-600" />
          <p className="text-xs font-bold text-primary-900">Your Selected Box</p>
        </div>

        {/* 3D Canvas - Light background like expected image */}
        <div className="relative w-full h-40 bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-lg overflow-hidden">
          <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          onCreated={({ gl }) => {
            console.log('✅ Cart 3D Canvas created successfully');
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
            {/* Camera - Matching HamperScene3D viewing angle */}
            <PerspectiveCamera
              makeDefault
              position={[3, 2.5, 3]}
              fov={40}
            />

            {/* Orbit Controls - targets the box center at floor level */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={1.5}
              target={[0, 0, 0]}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
            />

            {/* Lights - Soft, even lighting like expected image */}
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
            <directionalLight position={[-5, 8, -5]} intensity={0.5} />
            <pointLight position={[0, 15, 0]} intensity={0.4} color="#ffffff" />

            {/* Environment for soft reflections */}
            <Environment preset="city" />

            {/* 3D Box - Force re-render with key */}
            <Box3D
              key={`${widthCm}-${heightCm}-${depthCm}-${boxType}-v2`}
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
    </Canvas3DErrorBoundary>
  );
}

