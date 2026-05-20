import { useEffect, useRef } from 'react'

/**
 * Scroll-linked 3D tilt — works on BOTH mobile and desktop.
 * Element rotates on its X axis based on its position in the viewport.
 * No interaction required; the effect plays as you scroll.
 *
 * Returns a ref to attach to the target element.
 */
export function useScrollTilt({ amount = 14, axis = 'x', invert = false } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = null

    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      /* Center of element in viewport: 0 at top, 0.5 mid, 1 at bottom */
      const t = (rect.top + rect.height / 2) / vh
      /* Normalize: -1 above center, 0 at center, +1 below */
      const k = Math.max(-1, Math.min(1, (t - 0.5) * 2))
      const deg = k * amount * (invert ? -1 : 1)

      const rotX = axis === 'x' ? deg : 0
      const rotY = axis === 'y' ? deg : 0
      el.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
    }

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }

    el.style.willChange = 'transform'
    el.style.transformStyle = 'preserve-3d'
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [amount, axis, invert])

  return ref
}

/**
 * Scroll-linked parallax translate. Element moves up/down as you scroll.
 * Returns a ref. Works on touch + mouse.
 */
export function useParallax({ speed = 0.2, axis = 'y' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = null
    const update = () => {
      raf = null
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const t = (rect.top + rect.height / 2 - vh / 2) / vh
      const offset = -t * speed * 100
      const tx = axis === 'x' ? offset : 0
      const ty = axis === 'y' ? offset : 0
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
    }
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update) }
    el.style.willChange = 'transform'
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed, axis])

  return ref
}
