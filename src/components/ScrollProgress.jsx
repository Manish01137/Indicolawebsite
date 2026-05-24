import { useEffect, useRef } from 'react'

/**
 * Thin rainbow gradient bar fixed at top — fills based on document scroll.
 * Subtle but premium polish that signals "long-form, scrollable content".
 */
export default function ScrollProgress({
  height   = 3,
  gradient = 'linear-gradient(90deg, #e63946, #f77f00, #ffd166, #06d6a0, #00b4d8, #9b5de5)',
  zIndex   = 9100,
  showPercent = false,
}) {
  const fillRef = useRef(null)
  const pctRef  = useRef(null)

  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? Math.max(0, Math.min(1, window.scrollY / h)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`
      if (pctRef.current)  pctRef.current.textContent = Math.round(p * 100) + '%'
    }
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height, zIndex, pointerEvents: 'none',
        background: 'rgba(26,26,46,.05)',
      }}>
        <div
          ref={fillRef}
          style={{
            height: '100%', width: '100%',
            background: gradient,
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            willChange: 'transform',
          }}
        />
      </div>
      {showPercent && (
        <div
          ref={pctRef}
          style={{
            position: 'fixed', top: 12, right: 14, zIndex,
            fontFamily: "'Sora',sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em',
            color: '#9ca3af', pointerEvents: 'none',
          }}
        >0%</div>
      )}
    </>
  )
}
