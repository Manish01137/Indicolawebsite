import { useEffect, useRef } from 'react'
import { useOnScreen, useTilt, useDevice } from '../hooks/useTilt'

/**
 * Premium video tile with:
 *  - lazy autoplay (only when on-screen)
 *  - 3D tilt on desktop (disabled on touch)
 *  - animated gradient border matched to brand color
 *  - poster fallback while video loads
 */
export default function VideoCard({
  src,
  poster,
  name,
  tagline,
  color = '#e63946',
  glow = 'rgba(230,57,70,.45)',
  onClick,
  height = 460,
  tiltIntensity = 17,
  showPlayBadge = true,
  rounded = 26,
}) {
  const tiltRef = useTilt({ intensity: tiltIntensity, scale: 1.04 })
  const [screenRef, onScreen] = useOnScreen({ threshold: 0.25 })
  const videoRef = useRef(null)
  const { isTouch } = useDevice()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (onScreen) v.play().catch(() => {})
    else          v.pause()
  }, [onScreen])

  return (
    <div ref={screenRef} style={{ perspective: 1200 }}>
      <div
        ref={isTouch ? null : tiltRef}
        onClick={onClick}
        style={{
          position: 'relative',
          height,
          borderRadius: rounded,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform .5s cubic-bezier(.2,.7,.3,1.1)',
          boxShadow: `0 24px 60px ${glow}, 0 6px 20px rgba(0,0,0,.12)`,
        }}
      >
        {/* Animated gradient border */}
        <div style={{
          position: 'absolute', inset: -2, borderRadius: rounded + 2,
          background: `conic-gradient(from 0deg, ${color}, transparent 30%, ${color}80 60%, transparent 90%, ${color})`,
          animation: 'spin 8s linear infinite',
          zIndex: 0, opacity: .85,
        }} />

        {/* Inner card */}
        <div style={{
          position: 'absolute', inset: 3,
          borderRadius: rounded - 2,
          overflow: 'hidden',
          background: '#000',
          zIndex: 1,
        }}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Gradient overlay at bottom */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%',
            background: `linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.4) 60%, transparent 100%)`,
            pointerEvents: 'none',
          }} />

          {/* Color glow corner */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 180, height: 180,
            borderRadius: '50%', background: glow,
            filter: 'blur(40px)', pointerEvents: 'none', opacity: .7,
          }} />

          {/* Content */}
          <div style={{
            position: 'absolute', left: 24, right: 24, bottom: 22,
            color: '#fff', zIndex: 2,
          }}>
            <div style={{
              display: 'inline-block', padding: '.22rem .75rem',
              borderRadius: 9999, fontSize: '.7rem', fontWeight: 700,
              letterSpacing: '.1em', textTransform: 'uppercase',
              background: color, color: '#fff', marginBottom: '.75rem',
            }}>
              ▶ Watch
            </div>
            <h3 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 'clamp(1.3rem,2.4vw,1.7rem)',
              fontWeight: 800, lineHeight: 1.05, marginBottom: '.35rem',
              letterSpacing: '-0.02em',
            }}>
              {name}
            </h3>
            {tagline && (
              <p style={{
                fontSize: '.85rem', opacity: .85, fontWeight: 500,
                letterSpacing: '.02em',
              }}>
                {tagline}
              </p>
            )}
          </div>

          {/* Play badge corner */}
          {showPlayBadge && (
            <div style={{
              position: 'absolute', top: 18, right: 18, zIndex: 3,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,.18)',
              WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '.95rem',
            }}>
              ▶
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
