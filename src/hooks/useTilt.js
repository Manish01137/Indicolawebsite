import { useEffect, useRef } from 'react'

/**
 * 3D tilt that tracks mouse position. Auto-disabled on touch devices.
 *   const tiltRef = useTilt({ intensity: 17, scale: 1.03 })
 *   <div ref={tiltRef}>tilted card</div>
 */
export function useTilt({ intensity = 17, scale = 1.03 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = null
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    let currentScale = 1

    const tick = () => {
      currentX     += (targetX - currentX) * 0.14
      currentY     += (targetY - currentY) * 0.14
      el.style.transform = `perspective(1200px) rotateY(${currentX}deg) rotateX(${-currentY}deg) scale3d(${currentScale},${currentScale},${currentScale})`
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const handleEnter = () => { currentScale = scale }
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width  - 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5
      targetX = x * intensity
      targetY = y * intensity
      if (!rafId) rafId = requestAnimationFrame(tick)
    }
    const handleLeave = () => {
      targetX = 0; targetY = 0; currentScale = 1
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    el.style.willChange = 'transform'
    el.style.transformStyle = 'preserve-3d'
    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mousemove',  handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mousemove',  handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [intensity, scale])

  return ref
}

/**
 * Magnetic effect — element drifts toward cursor.
 *   const ref = useMagnetic({ strength: 0.35 })
 */
export function useMagnetic({ strength = 0.3 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = null
    let tx = 0, ty = 0, cx = 0, cy = 0

    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      tx = (e.clientX - (rect.left + rect.width  / 2)) * strength
      ty = (e.clientY - (rect.top  + rect.height / 2)) * strength
      if (!rafId) rafId = requestAnimationFrame(tick)
    }
    const handleLeave = () => {
      tx = 0; ty = 0
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    el.style.willChange = 'transform'
    el.addEventListener('mousemove',  handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove',  handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [strength])

  return ref
}

/**
 * Detect when an element is on-screen (toggles every entry/exit).
 *   const [ref, onScreen] = useOnScreen({ threshold: 0.3 })
 */
import { useState } from 'react'
export function useOnScreen({ threshold = 0.25, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [onScreen, setOnScreen] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, onScreen]
}

/**
 * Detect mobile / touch / reduced-motion in one hook.
 */
export function useDevice() {
  const [d, setD] = useState({ isTouch: false, isMobile: false, reducedMotion: false })

  useEffect(() => {
    const check = () => setD({
      isTouch:        window.matchMedia('(hover: none)').matches,
      isMobile:       window.innerWidth < 768,
      reducedMotion:  window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return d
}
