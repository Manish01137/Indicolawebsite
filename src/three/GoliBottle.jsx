import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function GoliBottle({
  liquidColor = '#E63946',
  position = [0, 0, 0],
  scale = 1,
  mousePosRef = null,
  autoRotate = true,
  entranceDelay = 0,
}) {
  const groupRef = useRef()
  const liquidRef = useRef()
  const marbleRef = useRef()
  const baseY = useRef(position[1])
  const hasEntrance = useRef(false)

  /* ─── Bottle outer glass profile ─── */
  const bottlePoints = useMemo(() => [
    new THREE.Vector2(0.001, 0.00),
    new THREE.Vector2(0.620, 0.00),
    new THREE.Vector2(0.650, 0.10),
    new THREE.Vector2(0.670, 0.28),
    new THREE.Vector2(0.670, 1.90),
    new THREE.Vector2(0.610, 2.12),
    new THREE.Vector2(0.440, 2.35),
    new THREE.Vector2(0.310, 2.52),
    new THREE.Vector2(0.275, 2.72),
    new THREE.Vector2(0.255, 2.92),
    new THREE.Vector2(0.268, 3.02),
    new THREE.Vector2(0.240, 3.13),
    new THREE.Vector2(0.220, 3.28),
    new THREE.Vector2(0.235, 3.38),
    new THREE.Vector2(0.255, 3.46),
    new THREE.Vector2(0.230, 3.52),
  ], [])

  /* ─── Liquid fill profile (inner, 72% full) ─── */
  const liquidPoints = useMemo(() => [
    new THREE.Vector2(0.001, 0.06),
    new THREE.Vector2(0.580, 0.06),
    new THREE.Vector2(0.610, 0.20),
    new THREE.Vector2(0.625, 0.40),
    new THREE.Vector2(0.625, 1.55),
    new THREE.Vector2(0.560, 1.72),
    new THREE.Vector2(0.200, 1.82),
    new THREE.Vector2(0.001, 1.82),
  ], [])

  /* ─── Cap profile ─── */
  const capPoints = useMemo(() => [
    new THREE.Vector2(0.001, 3.44),
    new THREE.Vector2(0.260, 3.44),
    new THREE.Vector2(0.272, 3.48),
    new THREE.Vector2(0.272, 3.64),
    new THREE.Vector2(0.255, 3.68),
    new THREE.Vector2(0.001, 3.68),
  ], [])

  /* ─── GSAP entrance animation ─── */
  useEffect(() => {
    if (!groupRef.current || hasEntrance.current) return
    hasEntrance.current = true

    groupRef.current.position.y = position[1] - 5
    groupRef.current.rotation.z = 0.6
    groupRef.current.scale.setScalar(0)

    gsap.to(groupRef.current.position, {
      y: position[1],
      duration: 1.8,
      delay: entranceDelay,
      ease: 'elastic.out(1, 0.55)',
    })
    gsap.to(groupRef.current.rotation, {
      z: 0,
      duration: 1.8,
      delay: entranceDelay,
      ease: 'elastic.out(1, 0.55)',
    })
    gsap.to(groupRef.current.scale, {
      x: scale, y: scale, z: scale,
      duration: 1.0,
      delay: entranceDelay,
      ease: 'power3.out',
    })
  }, [])

  /* ─── Per-frame: rotation + mouse tilt + gentle float ─── */
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.35
    }

    /* Gentle floating bob */
    groupRef.current.position.y =
      position[1] + Math.sin(t * 1.4) * 0.06

    /* Mouse influence */
    if (mousePosRef?.current) {
      const mx = mousePosRef.current.x
      const my = mousePosRef.current.y
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, my * 0.35, 0.06
      )
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, -mx * 0.18, 0.06
      )
    }

    /* Liquid slosh */
    if (liquidRef.current) {
      liquidRef.current.rotation.z =
        Math.sin(t * 0.9) * 0.015 +
        (mousePosRef?.current?.x ?? 0) * 0.04
    }

    /* Marble spin */
    if (marbleRef.current) {
      marbleRef.current.rotation.y += delta * 1.2
      marbleRef.current.rotation.x += delta * 0.8
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>

      {/* ── Outer glass shell ── */}
      <mesh castShadow>
        <latheGeometry args={[bottlePoints, 80]} />
        <MeshTransmissionMaterial
          color="#cceedd"
          transmission={0.96}
          roughness={0.03}
          thickness={0.45}
          chromaticAberration={0.03}
          distortionScale={0.08}
          temporalDistortion={0.06}
          ior={1.52}
          envMapIntensity={1.8}
          backside
          backsideThickness={0.25}
          anisotropy={0.2}
        />
      </mesh>

      {/* ── Liquid inside ── */}
      <mesh ref={liquidRef} renderOrder={1}>
        <latheGeometry args={[liquidPoints, 80]} />
        <meshPhysicalMaterial
          color={liquidColor}
          transmission={0.55}
          roughness={0.0}
          metalness={0.0}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Codd marble ── */}
      <mesh ref={marbleRef} position={[0, 3.02, 0]} castShadow>
        <sphereGeometry args={[0.19, 40, 40]} />
        <MeshTransmissionMaterial
          color="#aaddff"
          transmission={0.94}
          roughness={0.0}
          thickness={0.35}
          ior={1.56}
          chromaticAberration={0.06}
          envMapIntensity={2}
        />
      </mesh>

      {/* ── Cap / seal ── */}
      <mesh castShadow>
        <latheGeometry args={[capPoints, 48]} />
        <meshStandardMaterial
          color="#E63946"
          metalness={0.45}
          roughness={0.28}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* ── Cap top disc ── */}
      <mesh position={[0, 3.66, 0]}>
        <circleGeometry args={[0.255, 40]} />
        <meshStandardMaterial color="#C92030" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* ── Label band (white area on bottle) ── */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.672, 0.672, 0.85, 72, 1, true]} />
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.72}
          side={THREE.FrontSide}
          roughness={0.4}
        />
      </mesh>

      {/* ── Highlight stripe (gloss) ── */}
      <mesh position={[0.42, 1.2, 0.38]} rotation={[0, -0.4, 0.15]}>
        <planeGeometry args={[0.08, 0.65]} />
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

    </group>
  )
}
