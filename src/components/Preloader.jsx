import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Only preload critical above-the-fold assets — fast first paint */
const CRITICAL = [
  '/images/logo.png',
  '/images/bottles-sky.png',
]

const COLORS = ['#fff8f0', '#fff0f0', '#fffbf0', '#fff0f8', '#f0f8ff']

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting]   = useState(false)

  useEffect(() => {
    let loaded = 0
    let done = false
    const finish = () => {
      if (done) return
      done = true
      setProgress(100)
      setTimeout(() => setExiting(true), 250)
    }

    const bump = () => {
      loaded++
      const pct = Math.min(95, Math.round((loaded / CRITICAL.length) * 95))
      setProgress(pct)
      if (loaded >= CRITICAL.length) finish()
    }

    CRITICAL.forEach(src => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = src
    })

    /* Hard cap — never block more than 1.5s on first paint */
    const failsafe = setTimeout(finish, 1500)
    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(onComplete, 850)
    return () => clearTimeout(t)
  }, [exiting, onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      pointerEvents: exiting ? 'none' : 'auto',
      overflow: 'hidden',
    }}>
      {/* Color stripes — start covering, slide UP on exit */}
      {COLORS.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0, left: `${i * 20}%`,
          width: '20.1%', height: '100%',
          background: c,
          transform: exiting ? 'translateY(-101%)' : 'translateY(0)',
          transition: `transform .85s cubic-bezier(.7,0,.3,1) ${i * 60}ms`,
        }} />
      ))}

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1.8rem',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity .3s ease, transform .45s ease',
      }}>
        {/* The actual brand logo (same one used in Navbar) */}
        <motion.img
          src="/images/logo.png"
          alt="IndiColas"
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1.05] }}
          style={{
            height: 78, width: 'auto', objectFit: 'contain',
            filter: 'drop-shadow(0 10px 28px rgba(230,57,70,.25))',
          }}
        />

        {/* Progress bar */}
        <div style={{
          width: 220, height: 3, borderRadius: 9999,
          background: 'rgba(26,26,46,.08)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg,#e63946,#f77f00,#ff70a6)',
            borderRadius: 9999,
            transition: 'width .3s ease',
          }} />
        </div>

        <div style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: '.7rem', fontWeight: 700,
          letterSpacing: '.22em', textTransform: 'uppercase',
          color: '#9ca3af',
        }}>
          {progress < 100 ? `${progress}%` : 'Pop The Fizz ★'}
        </div>
      </div>
    </div>
  )
}
