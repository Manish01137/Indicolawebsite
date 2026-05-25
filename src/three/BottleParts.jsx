import { forwardRef, useMemo } from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import {
  BOTTLE_PROFILE, LIQUID_PROFILE, CAP_PROFILE,
  MARBLE_R, MARBLE_Y,
  LABEL_R, LABEL_HEIGHT, LABEL_Y,
} from './bottleGeometry'

/* ─────────── GLASS BODY ─────────── */
export const BottleBody = forwardRef(function BottleBody(props, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh castShadow renderOrder={3}>
        <latheGeometry args={[BOTTLE_PROFILE, 80]} />
        <MeshTransmissionMaterial
          color="#e0f4e8"
          transmission={0.98}
          roughness={0.05}
          thickness={0.35}
          ior={1.52}
          chromaticAberration={0.04}
          distortionScale={0.05}
          temporalDistortion={0.04}
          backside
          backsideThickness={0.25}
          envMapIntensity={1.4}
          anisotropy={0.15}
          attenuationDistance={1.5}
          attenuationColor="#f0fff0"
        />
      </mesh>
    </group>
  )
})

/* ─────────── LIQUID INSIDE ─────────── */
/* Use the OUTER group scale to control fill level (assembly scene animates it) */
export const BottleLiquid = forwardRef(function BottleLiquid({ color = '#e63946', ...props }, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh renderOrder={2}>
        <latheGeometry args={[LIQUID_PROFILE, 64]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.55}
          roughness={0.05}
          metalness={0}
          ior={1.34}
          thickness={0.6}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          depthWrite={false}
          attenuationDistance={0.6}
          attenuationColor={color}
        />
      </mesh>
    </group>
  )
})

/* ─────────── MARBLE (codd ball) ─────────── */
export const BottleMarble = forwardRef(function BottleMarble(props, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh castShadow renderOrder={1}>
        <sphereGeometry args={[MARBLE_R, 40, 32]} />
        <MeshTransmissionMaterial
          color="#cce8ff"
          transmission={0.96}
          roughness={0.03}
          thickness={0.35}
          ior={1.55}
          chromaticAberration={0.06}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  )
})

/* ─────────── CAP ─────────── */
export const BottleCap = forwardRef(function BottleCap({ color = '#e63946', ...props }, ref) {
  return (
    <group ref={ref} {...props}>
      <mesh castShadow>
        <latheGeometry args={[CAP_PROFILE, 40]} />
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.32}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Tiny brand dot on top */}
      <mesh position={[0, 3.445, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#fff" metalness={0.1} roughness={0.5} />
      </mesh>
    </group>
  )
})

/* ─────────── LABEL (wraps body) ─────────── */
export const BottleLabel = forwardRef(function BottleLabel({ color = '#e63946', accent = '#ffffff', ...props }, ref) {
  /* Procedural canvas texture — gets a "Indi Cola" looking band.
     Replaced by image texture when .glb loads with mapped UVs. */
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 256
    const ctx = c.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, c.width, 0)
    grad.addColorStop(0, color)
    grad.addColorStop(0.5, accent)
    grad.addColorStop(1, color)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 96px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('IndiColas', c.width / 2, c.height / 2 - 8)
    ctx.fillStyle = color
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('POP THE FIZZ', c.width / 2, c.height / 2 + 60)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [color, accent])

  return (
    <group ref={ref} {...props}>
      <mesh position={[0, LABEL_Y, 0]} renderOrder={4}>
        <cylinderGeometry args={[LABEL_R, LABEL_R, LABEL_HEIGHT, 80, 1, true]} />
        <meshStandardMaterial
          map={texture}
          transparent
          side={THREE.FrontSide}
          metalness={0.1}
          roughness={0.55}
        />
      </mesh>
    </group>
  )
})

/* ─────────── COMPLETE BOTTLE — all parts composed ─────────── */
export const CompleteBottle = forwardRef(function CompleteBottle(
  { liquidColor = '#e63946', capColor = '#e63946', labelColor = '#e63946', ...props },
  ref,
) {
  return (
    <group ref={ref} position={[0, -1.6, 0]} {...props}>
      <BottleBody />
      <BottleLiquid color={liquidColor} />
      <BottleMarble position={[0, MARBLE_Y, 0]} />
      <BottleCap color={capColor} />
      <BottleLabel color={labelColor} />
    </group>
  )
})
