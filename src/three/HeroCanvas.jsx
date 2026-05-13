import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import GoliBottle from './GoliBottle'
import BubbleParticles from './BubbleParticles'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      {/* Warm key light */}
      <pointLight position={[3, 5, 4]}   color="#ff9f43" intensity={4} distance={20} />
      {/* Cool fill */}
      <pointLight position={[-4, 3, -2]} color="#9B5DE5" intensity={3} distance={18} />
      {/* Bottom rim */}
      <pointLight position={[0, -4, 5]}  color="#00B4D8" intensity={2.5} distance={15} />
      {/* Back accent */}
      <pointLight position={[5, 0, -3]}  color="#06D6A0" intensity={2} distance={15} />
      {/* Top sparkle */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={0.8}
        intensity={3}
        color="white"
        castShadow
      />
    </>
  )
}

function AnimatedLights() {
  return null
}

export default function HeroCanvas({ mousePosRef, liquidColor = '#E63946' }) {
  return (
    <Canvas
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0.8, 5.5], fov: 48 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}
      shadows
    >
      <Suspense fallback={null}>
        <Lights />

        {/* Environment map for realistic glass reflections */}
        <Environment preset="city" />

        {/* Main hero bottle — offset right */}
        <GoliBottle
          position={[1.1, -0.4, 0]}
          liquidColor={liquidColor}
          mousePosRef={mousePosRef}
          autoRotate
          entranceDelay={0.2}
        />

        {/* Fizzy bubble field */}
        <BubbleParticles
          count={220}
          spread={5}
          height={9}
        />

        {/* Subtle star field for depth */}
        <Stars
          radius={20}
          depth={10}
          count={300}
          factor={1}
          saturation={1}
          fade
          speed={0.4}
        />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.22}
          scale={10}
          blur={4}
          color="#9B5DE5"
        />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.85}
            radius={0.9}
            blendFunction={BlendFunction.SCREEN}
          />
          <ChromaticAberration
            offset={[0.0008, 0.0008]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
