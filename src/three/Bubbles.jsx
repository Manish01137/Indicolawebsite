import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Bubbles rising inside the liquid. Constrained to a cylinder ~r=0.6, h=1.5
 * so they appear to live inside the bottle body.
 *
 * Visibility scales with `fillLevel` (0 = none, 1 = all visible).
 */
export default function Bubbles({
  count     = 60,
  radius    = 0.5,
  height    = 1.4,
  yBase     = 0.1,
  fillLevel = 1,
  color     = '#ffffff',
  size      = 0.06,
}) {
  const ref = useRef()

  const { positions, speeds, phases, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds   = new Float32Array(count)
    const phases   = new Float32Array(count)
    const scales   = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r     = Math.sqrt(Math.random()) * radius
      positions[i * 3]     = Math.cos(theta) * r
      positions[i * 3 + 1] = yBase + Math.random() * height
      positions[i * 3 + 2] = Math.sin(theta) * r
      speeds[i]  = 0.0035 + Math.random() * 0.011
      phases[i]  = Math.random() * Math.PI * 2
      scales[i]  = 0.3 + Math.random() * 0.7
    }
    return { positions, speeds, phases, scales }
  }, [count, radius, height, yBase])

  useFrame((state) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array
    const t   = state.clock.elapsedTime
    const topY = yBase + height

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i]
      /* tiny lateral wobble */
      arr[i * 3]     += Math.sin(t * 0.7 + phases[i]) * 0.0015
      arr[i * 3 + 2] += Math.cos(t * 0.6 + phases[i]) * 0.0015
      if (arr[i * 3 + 1] > topY) {
        arr[i * 3 + 1] = yBase
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (fillLevel <= 0) return null

  return (
    <points ref={ref} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.55 * fillLevel}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
