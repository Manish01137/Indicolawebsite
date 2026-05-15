import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Clip-path curtain that sweeps in from the top on route change.
 * Skips initial mount.
 */
export default function PageWipe() {
  const location = useLocation()
  const [phase, setPhase] = useState('idle') // idle → wipingIn → wipingOut
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }

    setPhase('wipingIn')
    const t1 = setTimeout(() => setPhase('wipingOut'), 320)
    const t2 = setTimeout(() => setPhase('idle'),       720)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [location.pathname])

  /* Clip-path values:
     idle      → inset(0 0 100% 0)  cut from bottom (hidden above-screen)
     wipingIn  → inset(0 0 0 0)     fully visible
     wipingOut → inset(100% 0 0 0)  cut from top (hidden below-screen)
  */
  const clip =
    phase === 'wipingIn'  ? 'inset(0 0 0 0)' :
    phase === 'wipingOut' ? 'inset(100% 0 0 0)' :
                            'inset(0 0 100% 0)'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      background: 'linear-gradient(135deg,#e63946 0%,#f77f00 50%,#ff70a6 100%)',
      pointerEvents: 'none',
      clipPath: clip,
      WebkitClipPath: clip,
      transition: 'clip-path .35s cubic-bezier(.7,0,.3,1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: "'Sora',sans-serif",
        fontSize: 'clamp(2rem,6vw,4rem)',
        fontWeight: 800,
        color: '#fff',
        opacity: phase === 'wipingIn' ? 1 : 0,
        transition: 'opacity .25s',
        letterSpacing: '-0.02em',
      }}>
        IndiColas
      </div>
    </div>
  )
}
