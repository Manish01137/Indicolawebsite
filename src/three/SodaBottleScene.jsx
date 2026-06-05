import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useGLTF, Center, Bounds, Environment, ContactShadows,
  Float, RoundedBox,
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

useGLTF.preload('/glb/soda.glb')

/* ─── Stable radial positions around the bottle ─── */
function shellPositions(count, minR, maxR, ySpread = 1.2, zComp = 0.55, seed = 0) {
  const out = []
  const rng = mulberry32(seed * 1000 + count)
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 + rng() * 0.7
    const phi = (rng() - 0.5) * 0.7
    const r = minR + rng() * (maxR - minR)
    out.push([
      Math.cos(theta) * Math.cos(phi) * r,
      Math.sin(phi) * r * ySpread + (rng() - 0.4) * 0.7,
      Math.sin(theta) * Math.cos(phi) * r * zComp,
    ])
  }
  return out
}

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6D2B79F5) >>> 0
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/* ─── BOTTLE — soda.glb ─── */
function SodaModel() {
  const { scene } = useGLTF('/glb/soda.glb')
  useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (o.material) {
          if ('envMapIntensity' in o.material) o.material.envMapIntensity = 1.5
          o.material.needsUpdate = true
        }
      }
    })
  }, [scene])
  return <primitive object={scene} />
}

function CenterBottle() {
  return (
    <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.28}>
      <Bounds fit clip observe margin={1.25}>
        <Center>
          <SodaModel />
        </Center>
      </Bounds>
    </Float>
  )
}

/* ─── WATER DROPLETS — varied sizes, frozen in time ─── */
function Droplets({ count = 30, accent = '#e63946' }) {
  const positions = useMemo(() => shellPositions(count, 1.5, 2.8, 0.95, 0.55, 1), [count])
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.position.y = positions[i][1] + Math.sin(t * 0.55 + i * 0.7) * 0.07
      c.rotation.x = t * 0.18 + i
      c.rotation.y = t * 0.12 + i * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => {
        const size = 0.07 + (i % 6) * 0.02 + (i % 3) * 0.015
        const stretch = i % 4 === 0 ? [1.35, 0.82, 0.82] : i % 5 === 0 ? [0.9, 1.2, 0.9] : [1, 1, 1]
        return (
          <mesh key={i} position={p} scale={stretch} castShadow>
            <icosahedronGeometry args={[size, 2]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.95}
              roughness={0.04}
              metalness={0}
              ior={1.33}
              thickness={0.4}
              transparent
              opacity={0.92}
              attenuationColor={accent}
              attenuationDistance={1.3}
              envMapIntensity={1.4}
              clearcoat={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ─── ICE CUBES — frosted rounded cubes ─── */
function IceCubes({ count = 8 }) {
  const positions = useMemo(() => shellPositions(count, 1.7, 2.9, 1.0, 0.5, 7), [count])
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.x = t * 0.12 + i * 0.3
      c.rotation.y = t * 0.08 + i * 0.7
      c.position.y = positions[i][1] + Math.sin(t * 0.4 + i * 1.7) * 0.09
    })
  })

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => {
        const s = 0.20 + (i % 3) * 0.05
        return (
          <RoundedBox
            key={i} args={[s, s, s]} radius={0.035} smoothness={3}
            position={p} castShadow
          >
            <meshPhysicalMaterial
              color="#e8f4ff"
              transmission={0.52}
              roughness={0.18}
              metalness={0}
              ior={1.31}
              thickness={0.32}
              transparent
              opacity={0.85}
              clearcoat={0.85}
              clearcoatRoughness={0.18}
              envMapIntensity={1.3}
            />
          </RoundedBox>
        )
      })}
    </group>
  )
}

/* ─── FLAVOR-SPECIFIC INGREDIENT GROUPS ─── */
function Cherries({ count = 7, seed = 1 }) {
  const positions = useMemo(() => shellPositions(count, 1.5, 2.6, 1.0, 0.5, seed), [count, seed])
  const groupRef = useRef()
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.z = Math.sin(t * 0.4 + i) * 0.25
      c.position.y = positions[i][1] + Math.sin(t * 0.5 + i * 1.3) * 0.07
    })
  })
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshPhysicalMaterial color="#d62828" roughness={0.22} metalness={0} clearcoat={0.7} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[0.02, 0.18, 0]} rotation={[0, 0, -0.22]}>
            <cylinderGeometry args={[0.012, 0.014, 0.16, 6]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Limes({ count = 6, seed = 2 }) {
  const positions = useMemo(() => shellPositions(count, 1.5, 2.7, 1.0, 0.5, seed), [count, seed])
  const groupRef = useRef()
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.x = t * 0.18 + i
      c.rotation.y = t * 0.12 + i * 0.6
      c.position.y = positions[i][1] + Math.sin(t * 0.42 + i * 1.5) * 0.08
    })
  })
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <group key={i} position={p} castShadow>
          {/* lime slice */}
          <mesh castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.045, 24]} />
            <meshPhysicalMaterial color="#9bcf3b" roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.2} />
          </mesh>
          {/* inner pulp */}
          <mesh position={[0, 0.024, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.001, 24]} />
            <meshStandardMaterial color="#dff7b3" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function CocoBerries({ count = 8, seed = 3 }) {
  const positions = useMemo(() => shellPositions(count, 1.5, 2.6, 1.0, 0.5, seed), [count, seed])
  const groupRef = useRef()
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.x = t * 0.15 + i * 0.7
      c.rotation.y = t * 0.1 + i
      c.position.y = positions[i][1] + Math.sin(t * 0.45 + i * 1.7) * 0.08
    })
  })
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => {
        const isBerry = i % 2 === 0
        return isBerry ? (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshPhysicalMaterial color="#ff70a6" roughness={0.25} metalness={0} clearcoat={0.6} clearcoatRoughness={0.1} />
          </mesh>
        ) : (
          <RoundedBox key={i} args={[0.2, 0.16, 0.16]} radius={0.04} smoothness={2} position={p} castShadow>
            <meshStandardMaterial color="#f5e6cf" roughness={0.7} />
          </RoundedBox>
        )
      })}
    </group>
  )
}

function CottonPuffs({ count = 7, seed = 4 }) {
  const positions = useMemo(() => shellPositions(count, 1.4, 2.6, 1.0, 0.5, seed), [count, seed])
  const groupRef = useRef()
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((c, i) => {
      c.rotation.y = t * 0.15 + i
      c.position.y = positions[i][1] + Math.sin(t * 0.32 + i * 1.4) * 0.11
    })
  })
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          {[
            [0, 0, 0, 0.16, '#ff9ec3'],
            [0.13, 0.05, 0.04, 0.13, '#a0e2ff'],
            [-0.11, 0.05, 0.06, 0.12, '#ff9ec3'],
            [0.04, -0.09, 0.05, 0.11, '#a0e2ff'],
            [-0.06, -0.08, -0.04, 0.10, '#ff9ec3'],
          ].map(([x, y, z, r, color], j) => (
            <mesh key={j} position={[x, y, z]}>
              <sphereGeometry args={[r, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function FlavorIngredients({ flavorName, isMobile }) {
  /* Cap counts on mobile */
  const m = isMobile ? 0.6 : 1
  switch (flavorName) {
    case 'Cherry Cola':   return <Cherries    count={Math.round(7 * m)} seed={1} />
    case 'Ginger Lime':   return <Limes       count={Math.round(6 * m)} seed={2} />
    case 'Coco Berry':    return <CocoBerries count={Math.round(8 * m)} seed={3} />
    case 'Cotton Candy':  return <CottonPuffs count={Math.round(7 * m)} seed={4} />
    default:              return <Cherries    count={Math.round(7 * m)} seed={1} />
  }
}

/* ─── CAMERA DOLLY — slow pull-in tied to scroll progress ─── */
function CameraDolly({ progressRef }) {
  useFrame((state) => {
    const p = (progressRef?.current ?? 0)
    const cam = state.camera
    /* z: 5.6 → 4.0 */
    const targetZ = 5.6 - p * 1.6
    /* x: subtle orbit */
    const targetX = Math.sin(p * Math.PI * 0.55) * 0.6
    /* y: subtle rise */
    const targetY = 0.3 + p * 0.25
    cam.position.x += (targetX - cam.position.x) * 0.06
    cam.position.y += (targetY - cam.position.y) * 0.06
    cam.position.z += (targetZ - cam.position.z) * 0.06
    cam.lookAt(0, 0, 0)
  })
  return null
}

/* ─── CINEMATIC LIGHTS ─── */
function CinematicLights({ accent = '#e63946' }) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight position={[3, 4, 3]}   color={accent}  intensity={3.6} distance={18} />
      <pointLight position={[-3, 3, -2]} color="#9b5de5" intensity={2.8} distance={15} />
      <pointLight position={[0, -2, 5]}  color="#00b4d8" intensity={2.0} distance={12} />
      <pointLight position={[4, 0, -3]}  color="#06d6a0" intensity={1.8} distance={12} />
      <spotLight position={[0, 7, 3]} angle={0.4} penumbra={0.85} intensity={2.8} color="#ffffff" castShadow />
    </>
  )
}

/* ─── MAIN EXPORT ─── */
export default function SodaBottleScene({
  accent      = '#e63946',
  flavorName  = 'Cherry Cola',
  progressRef,
  isMobile    = false,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5.6], fov: 36 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={!isMobile}
      style={{ background: 'transparent', touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        <CinematicLights accent={accent} />
        <Environment preset="city" />

        <CenterBottle />
        <Droplets       count={isMobile ? 18 : 32} accent={accent} />
        <IceCubes       count={isMobile ? 5  : 9} />
        <FlavorIngredients flavorName={flavorName} isMobile={isMobile} />

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.30}
          scale={9}
          blur={3.8}
          color={accent}
        />

        <CameraDolly progressRef={progressRef} />

        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.9}
              radius={0.95}
              blendFunction={BlendFunction.SCREEN}
            />
            <ChromaticAberration offset={[0.0006, 0.0006]} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
