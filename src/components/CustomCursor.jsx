import { useEffect, useRef, useState } from 'react'
import { useDevice } from '../hooks/useTilt'

/**
 * Context-aware brand cursor:
 *   default → small dot + outline ring (ring lags behind)
 *   link    → ring expands + tints red
 *   video   → ring becomes "▶ PLAY" pill
 *   drag    → ring becomes "↔ DRAG" pill
 *   text    → ring becomes thin vertical line
 *
 * Set per-element behavior with `data-cursor="video|drag|text"`.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [mode, setMode]     = useState('default')
  const [hidden, setHidden] = useState(false)
  const { isTouch } = useDevice()

  useEffect(() => {
    if (isTouch) return

    let targetX = -200, targetY = -200
    let ringX = -200, ringY = -200
    let rafId

    const tick = () => {
      ringX += (targetX - ringX) * 0.22
      ringY += (targetY - ringY) * 0.22
      if (dotRef.current)
        dotRef.current.style.transform  = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }

    const onMove = (e) => { targetX = e.clientX; targetY = e.clientY }

    const onOver = (e) => {
      const t = e.target
      if (!t || !t.closest) return
      if      (t.closest('[data-cursor="video"]')) setMode('video')
      else if (t.closest('[data-cursor="drag"]'))  setMode('drag')
      else if (t.closest('[data-cursor="text"]'))  setMode('text')
      else if (t.closest('a, button, [role="button"], input, textarea, select, [data-cursor="link"]')) setMode('link')
      else setMode('default')
    }

    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    rafId = requestAnimationFrame(tick)

    /* Hide system cursor on interactive surfaces — keeps text caret on inputs */
    document.documentElement.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafId)
      document.documentElement.style.cursor = ''
    }
  }, [isTouch])

  if (isTouch) return null

  const ringSize = mode === 'video' || mode === 'drag' ? 90 : mode === 'link' ? 48 : mode === 'text' ? 4 : 34
  const ringHeight = mode === 'text' ? 28 : ringSize

  return (
    <>
      {/* Inner dot — solid red, follows precisely */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 7, height: 7, borderRadius: '50%',
          background: '#e63946',
          pointerEvents: 'none', zIndex: 99999,
          opacity: hidden || mode !== 'default' ? 0 : 1,
          transition: 'opacity .2s',
          willChange: 'transform',
        }}
      />
      {/* Outer ring — lags behind, morphs by mode */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: ringSize, height: ringHeight, borderRadius: mode === 'text' ? 2 : '50%',
          border: mode === 'default' ? '1.5px solid rgba(230,57,70,.5)' : 'none',
          background:
            mode === 'video' ? 'rgba(230,57,70,.92)' :
            mode === 'drag'  ? 'rgba(155,93,229,.92)' :
            mode === 'link'  ? 'rgba(230,57,70,.18)' :
            mode === 'text'  ? '#e63946' :
            'transparent',
          pointerEvents: 'none', zIndex: 99998,
          opacity: hidden ? 0 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Sora',sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          color: '#fff', textTransform: 'uppercase',
          transition: 'width .28s cubic-bezier(.2,.7,.3,1.2), height .28s cubic-bezier(.2,.7,.3,1.2), background .25s, opacity .2s, border-radius .25s',
          willChange: 'transform',
          boxShadow: (mode === 'video' || mode === 'drag') ? `0 8px 28px ${mode === 'video' ? 'rgba(230,57,70,.55)' : 'rgba(155,93,229,.55)'}` : 'none',
        }}
      >
        {mode === 'video' && <span>▶&nbsp;PLAY</span>}
        {mode === 'drag'  && <span>↔&nbsp;DRAG</span>}
      </div>
    </>
  )
}
