import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Smooth ease-out counter that starts when the element enters the viewport.
 *
 *   <CountUp end={1872} duration={1600} prefix="" suffix="" startFrom={1800} />
 *
 * startFrom: optional starting value (defaults to 0). Useful for years
 *  so you don't tick through 0 → 1872 boringly.
 */
export default function CountUp({
  end,
  duration  = 1500,
  prefix    = '',
  suffix    = '',
  startFrom = 0,
  decimals  = 0,
  className,
  style,
}) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const [val, setVal] = useState(startFrom)

  useEffect(() => {
    if (!inView) return
    const t0   = performance.now()
    const from = startFrom
    let raf

    const tick = (now) => {
      const elapsed = now - t0
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(from + (end - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [inView, end, startFrom, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  )
}
