import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Environment, ContactShadows, Text, Sparkles, Float } from '@react-three/drei';
import HamperBoxMesh from './HamperBox3D';
import { Eye, Download, Share2, RotateCcw, Package } from 'lucide-react';

/**
 * Animated Lid Component - Drops from top, flips, and lands on box
 */
function AnimatedLid({ boxLength, boxWidth, boxHeight, boxColor, onAnimationComplete }) {
  const lidRef = useRef();
  const [animationPhase, setAnimationPhase] = useState('dropping'); // dropping, flipping, landing, shaking, settled
  const startTime = useRef(Date.now());
  const hasCompletedRef = useRef(false);

  // Reset animation when component mounts
  useEffect(() => {
    setAnimationPhase('dropping');
    startTime.current = Date.now();
    hasCompletedRef.current = false;
  }, []);

  useFrame(() => {
    if (!lidRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000; // seconds

    if (animationPhase === 'dropping') {
      // Phase 1: Drop from above (0-1.2 seconds)
      const dropDuration = 1.2;
      const progress = Math.min(elapsed / dropDuration, 1);

      // Easing function for realistic drop (gravity acceleration)
      const easeInQuad = progress * progress;

      const startY = boxHeight + 5; // Start 5 units above
      const endY = boxHeight + 1.8; // End just above the box
      lidRef.current.position.y = startY - (startY - endY) * easeInQuad;

      if (progress >= 1) {
        setAnimationPhase('flipping');
        startTime.current = Date.now();
      }
    } else if (animationPhase === 'flipping') {
      // Phase 2: EXACTLY 3 Complete Flips (1.2-2.7 seconds = 1.5 seconds)
      const flipDuration = 1.5;
      const progress = Math.min(elapsed / flipDuration, 1);

      // EXACTLY 3 complete 360-degree flips (3 × 2π = 6π radians)
      // Using modulo to ensure clean rotations
      lidRef.current.rotation.x = progress * Math.PI * 6;

      // Slight bounce up during flips
      const bounceHeight = Math.sin(progress * Math.PI) * 0.4;
      lidRef.current.position.y = boxHeight + 1.8 + bounceHeight;

      if (progress >= 1) {
        // Ensure rotation ends at exactly 0 (6π = 0 in modulo 2π)
        lidRef.current.rotation.x = 0;
        setAnimationPhase('landing');
        startTime.current = Date.now();
      }
    } else if (animationPhase === 'landing') {
      // Phase 3: Land on box (2.7-3.2 seconds = 0.5 seconds)
      const landDuration = 0.5;
      const progress = Math.min(elapsed / landDuration, 1);

      // Smooth landing with slight bounce
      const easeOutBounce = (t) => {
        if (t < 0.5) return 2 * t * t;
        return 1 - Math.pow(-2 * t + 2, 2) / 2;
      };

      const startY = boxHeight + 1.8;
      const endY = boxHeight + 0.05; // Final position on top of box
      lidRef.current.position.y = startY - (startY - endY) * easeOutBounce(progress);

      // Keep rotation at 0 (already flat from flipping phase)
      lidRef.current.rotation.x = 0;

      if (progress >= 1) {
        setAnimationPhase('shaking');
        startTime.current = Date.now();
      }
    } else if (animationPhase === 'shaking') {
      // Phase 4: Shaking animation after landing (3.2-3.8 seconds = 0.6 seconds)
      const shakeDuration = 0.6;
      const progress = Math.min(elapsed / shakeDuration, 1);

      // Damped oscillation for realistic shake
      const frequency = 15; // How fast it shakes
      const amplitude = 0.03 * (1 - progress); // Decreasing shake intensity

      // Shake in X and Z directions (horizontal shake)
      const shakeX = Math.sin(elapsed * frequency * Math.PI) * amplitude;
      const shakeZ = Math.cos(elapsed * frequency * Math.PI * 1.3) * amplitude;

      // Slight rotation shake
      const shakeRotation = Math.sin(elapsed * frequency * Math.PI * 0.8) * amplitude * 0.5;

      lidRef.current.position.x = shakeX;
      lidRef.current.position.z = shakeZ;
      lidRef.current.rotation.z = shakeRotation;

      if (progress >= 1) {
        // Reset to center position
        lidRef.current.position.x = 0;
        lidRef.current.position.z = 0;
        lidRef.current.rotation.z = 0;

        setAnimationPhase('settled');
        if (onAnimationComplete && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onAnimationComplete();
        }
      }
    }
  });

  return (
    <mesh ref={lidRef} position={[0, boxHeight + 5, 0]}>
      <boxGeometry args={[boxLength, 0.15, boxWidth]} />
      <meshStandardMaterial
        color={boxColor}
        roughness={0.05}
        metalness={0.4}
        transparent
        opacity={0.2}
        envMapIntensity={2.0}
      />
    </mesh>
  );
}

/**
 * Realistic Gift Bow Component - Like the reference image
 */
function GiftBow({ position, boxLength, boxWidth, ribbonColor = "#D4AF37" }) {
  const bowRef = useRef();

  useFrame((state) => {
    if (bowRef.current) {
      // Subtle animation
      bowRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={bowRef} position={position}>
      {/* Horizontal Ribbon across the box */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[boxLength + 0.3, 0.2, 0.5]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.3}
          emissive={ribbonColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Vertical Ribbon across the box */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.2, boxWidth + 0.3]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.3}
          emissive={ribbonColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Bow Center Knot */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bow Loops - Left */}
      <mesh position={[-0.7, 0.4, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.6}
          roughness={0.4}
          side={2}
        />
      </mesh>

      {/* Bow Loops - Right */}
      <mesh position={[0.7, 0.4, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.6}
          roughness={0.4}
          side={2}
        />
      </mesh>

      {/* Bow Loops - Front */}
      <mesh position={[0, 0.4, -0.7]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.6}
          roughness={0.4}
          side={2}
        />
      </mesh>

      {/* Bow Loops - Back */}
      <mesh position={[0, 0.4, 0.7]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.6}
          roughness={0.4}
          side={2}
        />
      </mesh>

      {/* Ribbon Tails - Left */}
      <mesh position={[-0.8, -0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.4, 1.2, 0.15]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Ribbon Tails - Right */}
      <mesh position={[0.8, -0.3, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.4, 1.2, 0.15]} />
        <meshStandardMaterial
          color={ribbonColor}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * Decorative Sparkles - Subtle and elegant
 */
function DecorativeSparkles() {
  return (
    <>
      <Sparkles
        count={10}
        scale={[8, 8, 8]}
        size={1.5}
        speed={0.1}
        opacity={0.15}
        color="#FFD700"
      />
    </>
  );
}

/**
 * Final Hamper Preview with Beautiful Presentation
 */
export default function HamperPreview3D({ selectedBox, placedItems, hamperName }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLidAnimation, setShowLidAnimation] = useState(true);
  const [lidAnimationComplete, setLidAnimationComplete] = useState(false);

  // Reset animation when box or items change
  useEffect(() => {
    setShowLidAnimation(true);
    setLidAnimationComplete(false);
  }, [selectedBox, placedItems]);

  const handleDownload = () => {
    // TODO: Implement screenshot functionality
    alert('Screenshot feature coming soon!');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share feature coming soon!');
  };

  const handleLidAnimationComplete = () => {
    setLidAnimationComplete(true);
  };

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [0.5, 0.75] : [1, 2]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
            failIfMajorPerformanceCaveat: false,
            precision: isMobile ? "lowp" : "highp",
            ...(isMobile && {
              stencil: false,
              depth: true,
              logarithmicDepthBuffer: false,
            })
          }}
          performance={{
            min: 0.1,
            max: 1,
            debounce: 200
          }}
          frameloop="demand"
          onCreated={({ gl }) => {
            console.log('✅ Preview Canvas created successfully');
            if (isMobile) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            }
          }}
        >
          <Suspense fallback={
            <Html center>
              <div className="text-purple-600 font-bold">Loading 3D Preview...</div>
            </Html>
          }>
            {/* Camera - Zoomed out for better mobile view */}
            <PerspectiveCamera makeDefault position={[4.5, 3.5, 4.5]} fov={55} />

            {/* Lighting - Simplified for mobile */}
            <ambientLight intensity={isMobile ? 1.2 : 1.0} />
            {!isMobile && (
              <>
                <directionalLight position={[10, 15, 8]} intensity={1.5} />
                <pointLight position={[-8, 10, -8]} intensity={0.5} color="#FFFFFF" />
                <pointLight position={[8, 10, 8]} intensity={0.5} color="#FFFFFF" />
                <pointLight position={[0, 10, 0]} intensity={0.3} color="#FFFFFF" />
              </>
            )}
            {isMobile && (
              <directionalLight position={[10, 15, 8]} intensity={1.8} />
            )}

            {/* Environment - Only on desktop */}
            {!isMobile && <Environment preset="sunset" />}

            {/* Elegant Pedestal/Platform - Simplified on mobile */}
            <mesh position={[0, -0.15, 0]} receiveShadow>
              <cylinderGeometry args={[4, 4.5, 0.2, isMobile ? 16 : 32]} />
              <meshStandardMaterial
                color="#F5F5DC"
                roughness={0.7}
                metalness={0.2}
              />
            </mesh>

            {/* Hamper Box - Transparent gift box with visible products */}
            {selectedBox && placedItems && (
              <>
                <HamperBoxMesh
                  box={selectedBox}
                  placedItems={placedItems}
                  isPreview={true}
                  hideLid={showLidAnimation && !lidAnimationComplete}
                  isMobile={isMobile}
                />

                {/* Animated Lid - Drops, flips, and lands */}
                {showLidAnimation && selectedBox.dimensionsCm && (
                  <AnimatedLid
                    boxLength={parseFloat(selectedBox.dimensionsCm.split(' × ')[0]) / 10}
                    boxWidth={parseFloat(selectedBox.dimensionsCm.split(' × ')[1]) / 10}
                    boxHeight={parseFloat(selectedBox.dimensionsCm.split(' × ')[2]) / 10}
                    boxColor={
                      selectedBox.color && selectedBox.color.includes('amber') ? '#F59E0B' :
                      selectedBox.color && selectedBox.color.includes('purple') ? '#9333EA' :
                      selectedBox.color && selectedBox.color.includes('rose') ? '#F43F5E' :
                      selectedBox.color && selectedBox.color.includes('blue') ? '#3B82F6' :
                      '#F5E6D3'
                    }
                    onAnimationComplete={handleLidAnimationComplete}
                  />
                )}
              </>
            )}



            {/* Hamper Name Label */}
            <Text
              position={[0, -1, 0]}
              fontSize={0.5}
              color="#4A148C"
              anchorX="center"
              anchorY="middle"
            >
              {hamperName || 'My Custom Hamper'}
            </Text>

            {/* "Ready to Dispatch" Badge - Shows after lid animation */}
            {lidAnimationComplete && (
              <Text
                position={[0, -1.5, 0]}
                fontSize={0.35}
                color="#10B981"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#FFFFFF"
              >
                ✓ Ready to Dispatch!
              </Text>
            )}

            {/* Static Ground Plane with shadow receiver */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <shadowMaterial opacity={0.2} />
            </mesh>

            {/* Subtle Grid - Elegant presentation surface */}
            <gridHelper args={[20, 20, '#D4AF37', '#F5F5DC']} position={[0, -0.05, 0]} />

            {/* Controls - Optimized for hamper viewing */}
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={12}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 2.2}
              target={[0, 0.5, 0]}
              enableDamping={true}
              dampingFactor={0.08}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Replay Lid Animation Button */}
        <button
          onClick={() => {
            setShowLidAnimation(true);
            setLidAnimationComplete(false);
          }}
          className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:scale-110 transition-all"
          title="Replay Lid Animation"
        >
          <Package className="h-5 w-5" />
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            autoRotate
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title={autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={handleDownload}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
          title="Download Screenshot"
        >
          <Download className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={handleShare}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
          title="Share Hamper"
        >
          <Share2 className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}

