import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import { CompleteBottle } from './BottleParts'
import Bubbles from './Bubbles'
import { MARBLE_Y } from './bottleGeometry'

/* ─────────── INTERACTIVE BOTTLE — auto-rotates, drag to spin ─────────── */
function InteractiveBottle({ liquidColor, capColor = '#e63946', dragRef }) {
  const groupRef = useRef()
  const bubbleGroupRef = useRef()

  /* Bubbles need to follow the bottle group */
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const targetRotY = dragRef.current.rotY
    const currentY = groupRef.current.rotation.y
    /* Smooth lerp toward drag target + auto-spin */
    groupRef.current.rotation.y = currentY + (targetRotY + delta * 0.35 - currentY) * 0.1
    dragRef.current.rotY = groupRef.current.rotation.y

    /* Tilt by drag.x */
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      dragRef.current.tilt,
      0.08
    )

    /* Gentle floating bob */
    groupRef.current.position.y = -0.4 + Math.sin(state.clock.elapsedTime * 1.1) * 0.06
  })

  return (
    <group ref={groupRef}>
      <CompleteBottle
        liquidColor={liquidColor}
        capColor={capColor}
        labelColor={liquidColor}
      />
      {/* Bubbles inside the bottle */}
      <group position={[0, -1.6, 0]}>
        <Bubbles count={70} radius={0.45} height={1.3} yBase={0.15} color="#ffffff" />
      </group>
    </group>
  )
}

/* Scene lights */
function Lights({ accent = '#e63946' }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 4, 3]}  color={accent}  intensity={3.2} distance={20} />
      <pointLight position={[-3, 3, -2]} color="#9b5de5" intensity={2.6} distance={18} />
      <pointLight position={[0, -3, 5]}  color="#00b4d8" intensity={2}   distance={15} />
      <pointLight position={[4, 0, -3]}  color="#06d6a0" intensity={1.8} distance={15} />
      <spotLight
        position={[0, 7, 3]} angle={0.4} penumbra={0.8}
        intensity={3} color="white" castShadow
      />
    </>
  )
}

/* ─────────── HERO 3D BOTTLE SCENE WRAPPER ─────────── */
export default function HeroBottleScene({ liquidColor = '#e63946', accent = '#e63946', isMobile = false }) {
  const dragRef    = useRef({ rotY: 0, tilt: 0 })
  const canvasRef  = useRef()
  const [grabbing, setGrabbing] = useState(false)

  /* Mouse / touch drag tracking */
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    let dragging = false
    let lastX = 0, lastY = 0

    const onDown = (e) => {
      dragging = true
      setGrabbing(true)
      lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    }

    const onMove = (e) => {
      if (!dragging) {
        /* Subtle parallax tilt from mouse position even when not dragging */
        const cx = e.clientX ?? e.touches?.[0]?.clientX
        const cy = e.clientY ?? e.touches?.[0]?.clientY
        if (cx == null) return
        const rect = el.getBoundingClientRect()
        const nx = (cx - rect.left) / rect.width  - 0.5
        const ny = (cy - rect.top)  / rect.height - 0.5
        dragRef.current.tilt = -ny * 0.22
        return
      }
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0
      const dx = cx - lastX
      const dy = cy - lastY
      lastX = cx; lastY = cy
      dragRef.current.rotY += dx * 0.012
      dragRef.current.tilt = THREE.MathUtils.clamp(dragRef.current.tilt + -dy * 0.005, -0.6, 0.6)
    }

    const onUp = () => { dragging = false; setGrabbing(false) }

    el.addEventListener('mousedown',  onDown)
    el.addEventListener('mousemove',  onMove)
    el.addEventListener('mouseleave', onUp)
    window.addEventListener('mouseup', onUp)

    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchmove',  onMove, { passive: true })
    el.addEventListener('touchend',   onUp)
    el.addEventListener('touchcancel', onUp)

    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onUp)
      window.removeEventListener('mouseup', onUp)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onUp)
      el.removeEventListener('touchcancel', onUp)
    }
  }, [])

  return (
    <div
      ref={canvasRef}
      data-cursor="drag"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        cursor: grabbing ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.4, 4.6], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        shadows={!isMobile}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lights accent={accent} />
          <Environment preset="city" />

          <InteractiveBottle liquidColor={liquidColor} capColor={capColor(accent)} dragRef={dragRef} />

          <ContactShadows
            position={[0, -2.3, 0]}
            opacity={0.25}
            scale={9}
            blur={3.2}
            color={accent}
          />

          {!isMobile && (
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.45}
                luminanceSmoothing={0.85}
                radius={0.9}
                blendFunction={BlendFunction.SCREEN}
              />
              <ChromaticAberration offset={[0.0008, 0.0008]} blendFunction={BlendFunction.NORMAL} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

function capColor(accent) {
  /* Keep cap red regardless of liquid — it's branded that way */
  return '#c12838'
}
