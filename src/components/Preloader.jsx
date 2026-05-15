import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const VIDEOS = [
  '/videos/cherrycola.mp4',
  '/videos/cocaberry.mp4',
  '/videos/gingerlime.mp4',
  '/videos/cottoncanday.mp4',
]
const IMAGES = [
  '/images/bottles-sky.png',
  '/images/banner.jpg',
  '/images/logo.png',
]

const COLORS = ['#fff8f0', '#fff0f0', '#fffbf0', '#fff0f8', '#f0f8ff']
const BRAND = 'IndiColas'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting]   = useState(false)

  useEffect(() => {
    const assets = [...IMAGES, ...VIDEOS]
    let loaded = 0

    const bump = () => {
      loaded++
      setProgress(Math.min(100, Math.round((loaded / assets.length) * 100)))
      if (loaded >= assets.length) {
        setTimeout(() => setExiting(true), 350)
      }
    }

    /* Preload images */
    IMAGES.forEach(src => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = src
    })

    /* Preload video (metadata only — gives us first frame quickly) */
    VIDEOS.forEach(src => {
      const v = document.createElement('video')
      v.preload = 'auto'
      v.muted = true
      v.playsInline = true
      v.oncanplaythrough = bump
      v.onloadeddata = bump
      v.onerror = bump
      v.src = src
      /* Some browsers need a play() attempt to actually buffer */
      v.load()
    })

    /* Failsafe — never block more than 4.5s */
    const failsafe = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setExiting(true), 200)
    }, 4500)

    return () => clearTimeout(failsafe)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(onComplete, 1100)
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
          transition: `transform 1.05s cubic-bezier(.7,0,.3,1) ${i * 75}ms`,
        }} />
      ))}

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2rem',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.06)' : 'scale(1)',
        transition: 'opacity .35s ease, transform .5s ease',
      }}>
        {/* Logo + brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1,   rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.3, 1.3] }}
            style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'linear-gradient(135deg,#e63946,#f77f00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Sora',sans-serif",
              fontWeight: 800, fontSize: '1.65rem',
              boxShadow: '0 14px 32px rgba(230,57,70,.42)',
            }}
          >
            i
          </motion.div>

          <div style={{ overflow: 'hidden', display: 'flex' }}>
            {BRAND.split('').map((c, i) => (
              <motion.span key={i}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.045, duration: 0.55, ease: [0.2, 0.7, 0.3, 1.05] }}
                style={{
                  display: 'inline-block',
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 800, fontSize: '2.3rem',
                  letterSpacing: '-0.03em',
                  color: i >= 4 ? '#e63946' : '#1a1a2e',
                }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          width: 260, height: 4, borderRadius: 9999,
          background: 'rgba(26,26,46,.08)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg,#e63946,#f77f00,#ff70a6)',
            borderRadius: 9999,
            transition: 'width .35s ease',
          }} />
        </div>

        {/* Status */}
        <div style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: '.74rem', fontWeight: 700,
          letterSpacing: '.22em', textTransform: 'uppercase',
          color: '#9ca3af',
          minHeight: 14,
        }}>
          {progress < 100 ? `Loading · ${progress}%` : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#e63946' }}
            >
              Pop The Fizz ★
            </motion.span>
          )}
        </div>
      </div>
    </div>
  )
}
