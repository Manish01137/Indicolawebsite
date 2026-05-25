import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

import {
  BottleBody, BottleLiquid, BottleMarble, BottleCap, BottleLabel,
} from './BottleParts'
import Bubbles from './Bubbles'
import { MARBLE_Y, LABEL_Y } from './bottleGeometry'

gsap.registerPlugin(ScrollTrigger)

/* ─────────── 3D parts orchestrated by parent's progress signal ─────────── */
function AssemblyBottle({ liquidColor, progressRef }) {
  const groupRef  = useRef()
  const bodyRef   = useRef()
  const liquidRef = useRef()
  const marbleRef = useRef()
  const capRef    = useRef()
  const labelRef  = useRef()
  const bubblesGroupRef = useRef()
  const [showBubbles, setShowBubbles] = useState(false)

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0

    /* Each part has a "phase window" — it animates only in its window */

    /* PHASE 1 (0.10 → 0.30): body slides in from below-left */
    const bp = clamp((p - 0.10) / 0.20)  // 0 → 1
    if (bodyRef.current) {
      bodyRef.current.position.x = lerp(-2.8, 0,      easeOut(bp))
      bodyRef.current.position.y = lerp(-3.6, -1.6,   easeOut(bp))
      bodyRef.current.position.z = lerp(-1.5, 0,      easeOut(bp))
      bodyRef.current.rotation.x = lerp( 0.45, 0,     easeOut(bp))
      bodyRef.current.rotation.z = lerp( 0.50, 0,     easeOut(bp))
    }

    /* PHASE 2 (0.30 → 0.50): liquid fills up (scale.y 0→1) */
    const lp = clamp((p - 0.30) / 0.20)
    if (liquidRef.current) {
      liquidRef.current.scale.y = Math.max(0.001, easeOut(lp))
    }
    /* Activate bubbles when liquid is mostly filled */
    if (lp > 0.4 && !showBubbles) setShowBubbles(true)
    if (lp < 0.2 && showBubbles)  setShowBubbles(false)

    /* PHASE 3 (0.50 → 0.65): marble drops from above */
    const mp = clamp((p - 0.50) / 0.15)
    if (marbleRef.current) {
      /* bouncy entry */
      const eased = bounceOut(mp)
      marbleRef.current.position.x = lerp(-1.6, 0, eased)
      marbleRef.current.position.y = lerp( 4.0, MARBLE_Y - 1.6, eased)
      marbleRef.current.rotation.x = lerp( 2.0, 0, eased)
    }

    /* PHASE 4 (0.65 → 0.82): cap descends and snaps on */
    const cp = clamp((p - 0.65) / 0.17)
    if (capRef.current) {
      capRef.current.position.x = lerp( 2.0, 0,    easeIn(cp))
      capRef.current.position.y = lerp( 4.2, -1.6, easeOut(cp))
      capRef.current.rotation.z = lerp(-0.8, 0,    easeOut(cp))
    }

    /* PHASE 5 (0.82 → 1.00): label wraps + bottle spins 360° */
    const sp = clamp((p - 0.82) / 0.18)
    if (labelRef.current) {
      const s = easeOut(sp)
      labelRef.current.scale.x = s
      labelRef.current.scale.y = s
      labelRef.current.scale.z = s
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = sp * Math.PI * 2 + delta * 0.0  // tied to scroll only
    }

    /* Gentle idle float on the bottle group throughout */
    if (groupRef.current) {
      const idle = Math.sin(state.clock.elapsedTime * 1.1) * 0.04
      groupRef.current.position.y = idle * (p > 0.3 ? 1 : 0)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body — starts off-screen, settles at center */}
      <BottleBody
        ref={bodyRef}
        position={[-2.8, -3.6, -1.5]}
        rotation={[0.45, 0, 0.5]}
      />
      {/* Liquid — starts collapsed, scales up */}
      <BottleLiquid
        ref={liquidRef}
        color={liquidColor}
        position={[0, -1.6, 0]}
        scale={[1, 0.001, 1]}
      />
      {/* Bubbles inside liquid — toggled on once it's filled */}
      {showBubbles && (
        <group ref={bubblesGroupRef} position={[0, -1.6, 0]}>
          <Bubbles count={50} radius={0.45} height={1.3} yBase={0.15} color="#ffffff" />
        </group>
      )}
      {/* Marble — drops from above */}
      <BottleMarble
        ref={marbleRef}
        position={[-1.6, 4.0, 0]}
      />
      {/* Cap — descends from top-right */}
      <BottleCap
        ref={capRef}
        position={[2.0, 4.2, 0]}
        rotation={[0, 0, -0.8]}
      />
      {/* Label — fades in last */}
      <BottleLabel
        ref={labelRef}
        color={liquidColor}
        position={[0, LABEL_Y - 1.6, 0]}
        scale={[0, 0, 0]}
      />
    </group>
  )
}

function Lights({ accent }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 4, 3]}   color={accent}   intensity={3.5} distance={20} />
      <pointLight position={[-3, 3, -2]} color="#9b5de5"  intensity={2.5} distance={18} />
      <pointLight position={[0, -3, 5]}  color="#00b4d8"  intensity={1.8} distance={15} />
      <pointLight position={[4, 0, -3]}  color="#06d6a0"  intensity={1.5} distance={15} />
      <spotLight position={[0, 7, 3]} angle={0.45} penumbra={0.8} intensity={2.8} color="white" />
    </>
  )
}

/* ─────────── Phase metadata for the UI overlay ─────────── */
const PHASES = [
  { id: 1, label: 'Step 01', title: 'The Glass Body',  sub: 'Hand-crafted Codd-neck bottle — designed to naturally seal carbonation with a glass marble.', range: [0.10, 0.30] },
  { id: 2, label: 'Step 02', title: 'The Liquid Pours', sub: 'Premium ingredients flow in — bold flavor that defines every IndiColas bottle.',              range: [0.30, 0.50] },
  { id: 3, label: 'Step 03', title: 'The Marble Drops', sub: 'A small glass sphere that completes the iconic Codd seal — the heart of the "POP" sound.',     range: [0.50, 0.65] },
  { id: 4, label: 'Step 04', title: 'The Cap Snaps On', sub: 'Sealed with our signature red crown — preserving fizz from factory to fridge.',                  range: [0.65, 0.82] },
  { id: 5, label: 'Step 05', title: 'Ready To Pop',     sub: 'The complete bottle — wrapped, sealed, and ready to deliver bold desi flavors.',                 range: [0.82, 1.00] },
]

/* ─────────── Helpers ─────────── */
const clamp = (v) => Math.max(0, Math.min(1, v))
const lerp  = (a, b, t) => a + (b - a) * t
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeIn  = (t) => t * t * t
const bounceOut = (t) => {
  const n = 7.5625, d = 2.75
  if (t < 1 / d)        return n * t * t
  else if (t < 2 / d) { t -= 1.5 / d;  return n * t * t + 0.75 }
  else if (t < 2.5 / d){ t -= 2.25 / d; return n * t * t + 0.9375 }
  else                 { t -= 2.625 / d; return n * t * t + 0.984375 }
}

/* ─────────── EXPORT: Full assembly section with scroll-driven scene + UI ─────────── */
export default function BottleAssemblySection({ liquidColor = '#e63946', accent = '#e63946', isMobile = false }) {
  const sectionRef  = useRef(null)
  const progressRef = useRef(0)
  const [activePhase, setActivePhase] = useState(0)
  const [progressDisplay, setProgressDisplay] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: '+=220%',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          progressRef.current = p
          setProgressDisplay(p)
          /* Find current phase */
          const phase = PHASES.findIndex(ph => p >= ph.range[0] && p < ph.range[1])
          setActivePhase(phase >= 0 ? phase : (p >= 1 ? PHASES.length - 1 : -1))
        },
      })
      return () => trigger.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const active = PHASES[activePhase] || PHASES[0]

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, #fff8f0 0%, ${tintBg(liquidColor)} 60%, #fdf4ff 100%)`,
        transition: 'background 1s ease',
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        top: '-15%', right: '-5%', borderRadius: '50%',
        background: `radial-gradient(circle, ${liquidColor}33, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
        transition: 'background 1s',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        bottom: '-10%', left: '5%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,93,229,.2), transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div
        className="assembly-grid"
        style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '2rem', alignItems: 'center',
          maxWidth: 'var(--max-w)', margin: '0 auto',
          padding: '0 2rem',
          minHeight: '100vh',
        }}
      >
        {/* LEFT — phase text */}
        <div style={{ paddingTop: '4rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '.4rem 1rem',
            borderRadius: 9999,
            background: '#fff',
            boxShadow: `0 6px 22px ${liquidColor}24`,
            fontFamily: "'Sora',sans-serif",
            fontSize: '.7rem', fontWeight: 700, letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: liquidColor,
            marginBottom: '1.2rem',
            transition: 'color 1s, box-shadow 1s',
          }}>
            Built In 5 Steps
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.6rem)',
            marginBottom: '1.2rem',
            letterSpacing: '-0.03em',
          }}>
            Crafted Piece<br />
            <span style={{
              background: `linear-gradient(135deg, ${liquidColor}, #f77f00)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              transition: 'background 1s',
            }}>by Piece.</span>
          </h2>

          {/* Phase indicator */}
          <div key={activePhase} style={{
            opacity: activePhase >= 0 ? 1 : 0.4,
            transition: 'opacity .35s',
          }}>
            <div style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 'clamp(3.2rem, 7vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: liquidColor,
              opacity: 0.15,
              marginBottom: '-1.4rem',
              transition: 'color 1s',
            }}>
              {active.label}
            </div>
            <div style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: '.7rem', fontWeight: 700, letterSpacing: '.18em',
              textTransform: 'uppercase', color: '#9ca3af',
              marginBottom: '.5rem',
            }}>
              {active.label}
            </div>
            <h3 style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '.8rem',
              letterSpacing: '-0.02em',
            }}>
              {active.title}
            </h3>
            <p style={{
              fontSize: '1rem', color: '#4b5563', lineHeight: 1.7,
              maxWidth: 440,
            }}>
              {active.sub}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '2.5rem', maxWidth: 320 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: '#9ca3af',
              marginBottom: '.5rem',
            }}>
              <span>Progress</span>
              <span style={{ color: liquidColor, transition: 'color 1s' }}>
                {Math.round(progressDisplay * 100)}%
              </span>
            </div>
            <div style={{
              height: 4, borderRadius: 9999,
              background: 'rgba(26,26,46,.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressDisplay * 100}%`,
                background: `linear-gradient(90deg, ${liquidColor}, #f77f00)`,
                borderRadius: 9999,
                transition: 'background 1s, width .1s linear',
              }} />
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '1.5rem' }}>
            {PHASES.map((ph, i) => (
              <div key={ph.id} style={{
                width: i === activePhase ? 28 : 10,
                height: 10,
                borderRadius: 9999,
                background: i <= activePhase ? liquidColor : 'rgba(26,26,46,.15)',
                transition: 'width .4s, background .6s',
              }} />
            ))}
          </div>

          <div style={{ marginTop: '2rem', fontSize: '.78rem', color: '#9ca3af', letterSpacing: '.06em' }}>
            ↓ Continue scrolling to assemble
          </div>
        </div>

        {/* RIGHT — Canvas */}
        <div className="assembly-canvas" style={{
          position: 'relative',
          width: '100%',
          height: '85vh',
          maxHeight: 720,
        }}>
          <Canvas
            camera={{ position: [0, 0.5, 6.5], fov: 38 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <Lights accent={liquidColor} />
              <Environment preset="city" />
              <AssemblyBottle liquidColor={liquidColor} progressRef={progressRef} />
              <ContactShadows
                position={[0, -2.4, 0]}
                opacity={0.22}
                scale={9}
                blur={3.5}
                color={liquidColor}
              />
              {!isMobile && (
                <EffectComposer>
                  <Bloom
                    intensity={0.45}
                    luminanceThreshold={0.5}
                    luminanceSmoothing={0.85}
                    radius={0.9}
                    blendFunction={BlendFunction.SCREEN}
                  />
                </EffectComposer>
              )}
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media(max-width:900px){
          .assembly-grid{grid-template-columns:1fr!important;gap:1rem!important;padding-top:4rem!important;padding-bottom:2rem!important}
          .assembly-canvas{height:55vh!important;max-height:480px!important;order:-1!important}
        }
      `}</style>
    </section>
  )
}

/* very light tint based on liquid color (for section bg) */
function tintBg(hex) {
  /* parse hex → rgb, mix with white */
  if (!hex || hex.length < 4) return '#fff5e8'
  const h = hex.replace('#', '')
  const r = parseInt(h.length === 3 ? h[0]+h[0] : h.substring(0, 2), 16)
  const g = parseInt(h.length === 3 ? h[1]+h[1] : h.substring(2, 4), 16)
  const b = parseInt(h.length === 3 ? h[2]+h[2] : h.substring(4, 6), 16)
  /* mix 92% white + 8% color */
  const mix = (c) => Math.round(c * 0.08 + 255 * 0.92)
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`
}
