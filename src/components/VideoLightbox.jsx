import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Fullscreen video lightbox with backdrop blur, close button, and ESC support.
 */
export default function VideoLightbox({ open, onClose, video, name, color = '#e63946' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(8,8,18,.92)',
            WebkitBackdropFilter: 'blur(18px)', backdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ scale: .92, opacity: 0, y: 30 }}
            animate={{ scale: 1,   opacity: 1, y: 0 }}
            exit   ={{ scale: .92, opacity: 0, y: 30 }}
            transition={{ duration: .35, ease: [0.2, 0.7, 0.3, 1.1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: 1100,
              borderRadius: 24, overflow: 'hidden',
              background: '#000',
              boxShadow: `0 40px 100px ${color}55, 0 10px 40px rgba(0,0,0,.5)`,
              aspectRatio: '16 / 10',
            }}
          >
            <video
              src={video}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />

            {/* Name pill */}
            <div style={{
              position: 'absolute', top: 18, left: 18, zIndex: 2,
              padding: '.5rem 1rem', borderRadius: 9999,
              background: color, color: '#fff',
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.85rem',
              letterSpacing: '.02em',
              boxShadow: `0 6px 20px ${color}60`,
            }}>
              {name}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14, zIndex: 2,
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,.15)',
                WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,.3)', color: '#fff',
                fontSize: '1.4rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .2s, transform .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.28)'; e.currentTarget.style.transform = 'scale(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.15)'; e.currentTarget.style.transform = 'none' }}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
