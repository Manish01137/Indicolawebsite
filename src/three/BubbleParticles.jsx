import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PALETTE = [
  '#E63946', '#F77F00', '#06D6A0',
  '#9B5DE5', '#00B4D8', '#FFB347',
  '#FF70A6', '#FFD166', '#4CC9F0',
]

export default function BubbleParticles({
  count = 180,
  spread = 3.5,
  height = 7,
  colors = PALETTE,
  size = 0.048,
}) {
  const pointsRef = useRef()

  const { positions, velocities, phases, colorArray } = useMemo(() => {
    const positions  = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    const phases     = new Float32Array(count)
    const colorArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r     = Math.sqrt(Math.random()) * spread

      positions[i * 3]     = Math.cos(theta) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * height
      positions[i * 3 + 2] = Math.sin(theta) * r

      velocities[i] = 0.004 + Math.random() * 0.012
      phases[i]     = Math.random() * Math.PI * 2

      const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
      colorArray[i * 3]     = c.r
      colorArray[i * 3 + 1] = c.g
      colorArray[i * 3 + 2] = c.b
    }

    return { positions, velocities, phases, colorArray }
  }, [count, spread, height])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    const t   = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += velocities[i]
      // Gentle horizontal drift
      pos[i * 3]     += Math.sin(t * 0.5 + phases[i]) * 0.001
      pos[i * 3 + 2] += Math.cos(t * 0.4 + phases[i]) * 0.001

      if (pos[i * 3 + 1] > height / 2 + 0.5) {
        pos[i * 3 + 1] = -height / 2 - 0.5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
