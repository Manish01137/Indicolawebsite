import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useDevice } from '../hooks/useTilt'
import { PlayIcon, PauseIcon, VolumeIcon, StarIcon, QuoteIcon, ArrowIcon } from './SocialIcons'

const REVIEWS = [
  { id: 1, video: '/reviewVideo/video.mp4',  name: 'Priya S.',   role: 'First-time taster', quote: 'The moment the marble dropped, I was eight years old again. This is pure nostalgia in a bottle.',  color: '#e63946', glow: 'rgba(230,57,70,.45)' },
  { id: 2, video: '/reviewVideo/video1.mp4', name: 'Marcus R.',  role: 'Soda enthusiast',   quote: 'I run a beverage blog. IndiColas is the most exciting craft soda to hit the US market in years.',     color: '#9b5de5', glow: 'rgba(155,93,229,.45)' },
  { id: 3, video: '/reviewVideo/video3.mp4', name: 'Ananya K.',  role: 'Chef',              quote: 'The flavor pairings are sophisticated. We are now serving it at our restaurant — guests love it.',       color: '#06d6a0', glow: 'rgba(6,214,160,.45)' },
  { id: 4, video: '/reviewVideo/video4.mp4', name: 'Daniel L.',  role: 'Distributor',       quote: 'Premium product, premium packaging, premium experience. This brand is going places.',                     color: '#f77f00', glow: 'rgba(247,127,0,.45)' },
  { id: 5, video: '/reviewVideo/video5.mp4', name: 'Riya M.',    role: 'Creator',           quote: 'My followers cannot get enough of the POP. The Ginger Lime is a vibe in every single sip.',                color: '#ff70a6', glow: 'rgba(255,112,166,.45)' },
  { id: 6, video: '/reviewVideo/video6.mp4', name: 'Arjun V.',   role: 'Connoisseur',       quote: 'Crafted with intention. You can taste the heritage and the innovation — masterclass execution.',         color: '#00b4d8', glow: 'rgba(0,180,216,.45)' },
]

/* ─────────── A single testimonial card with 3D tilt, video preview, premium chrome ─────────── */
function ReviewCard({ r, isActive, onActivate, isMobile }) {
  const cardRef = useRef(null)
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  /* Desktop: 3D tilt on hover */
  useEffect(() => {
    if (isMobile) return
    const el = cardRef.current
    if (!el) return
    let raf = null
    let tx = 0, ty = 0, cx = 0, cy = 0, scale = 1
    const tick = () => {
      cx += (tx - cx) * 0.16
      cy += (ty - cy) * 0.16
      el.style.transform = `perspective(1400px) rotateY(${cx}deg) rotateX(${-cy}deg) scale3d(${scale},${scale},${scale})`
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(tick)
      else raf = null
    }
    const enter = () => { scale = 1.025; if (!raf) raf = requestAnimationFrame(tick) }
    const move = e => {
      const rect = el.getBoundingClientRect()
      tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
      ty = ((e.clientY - rect.top)  / rect.height - 0.5) * 14
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const leave = () => { tx = 0; ty = 0; scale = 1; if (!raf) raf = requestAnimationFrame(tick) }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mousemove',  move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mousemove',  move)
      el.removeEventListener('mouseleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isMobile])

  /* Auto play/pause on active */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isActive) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [isActive])

  const togglePlay = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}) }
    else { v.pause(); setPlaying(false) }
  }
  const toggleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div style={{ perspective: 1400, transformStyle: 'preserve-3d' }}>
      <div
        ref={cardRef}
        onClick={onActivate}
        data-cursor="video"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9 / 16',
          borderRadius: 28,
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#000',
          boxShadow: isActive
            ? `0 40px 80px ${r.glow}, 0 12px 36px rgba(0,0,0,.22), 0 0 0 1px ${r.color}66`
            : '0 16px 44px rgba(0,0,0,.16), 0 0 0 1px rgba(255,255,255,.08)',
          transition: 'box-shadow .6s ease, transform .5s ease',
          willChange: 'transform',
        }}
      >
        {/* Animated gradient border ring on active */}
        {isActive && (
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 30, zIndex: 0,
            background: `conic-gradient(from 0deg, ${r.color}, transparent 30%, ${r.color}80 60%, transparent 90%, ${r.color})`,
            animation: 'spin 6s linear infinite',
            opacity: .55,
          }} />
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={r.video}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          style={{
            position: 'absolute', inset: 2, borderRadius: 26,
            width: 'calc(100% - 4px)', height: 'calc(100% - 4px)',
            objectFit: 'cover', zIndex: 1,
          }}
        />

        {/* Top gradient + quote glyph */}
        <div style={{
          position: 'absolute', inset: 2, borderRadius: 26, zIndex: 2,
          background: `linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 25%, transparent 55%, rgba(0,0,0,.78) 100%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', top: 18, left: 18, zIndex: 3,
          color: r.color, opacity: .8, filter: `drop-shadow(0 4px 12px ${r.glow})`,
        }}>
          <QuoteIcon size={36} />
        </div>

        {/* Play/mute controls */}
        <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', gap: 8, zIndex: 3 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}
            style={ctrlBtn(r.color)}>
            {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
            style={ctrlBtn(r.color)}>
            <VolumeIcon muted={muted} size={16} />
          </button>
        </div>

        {/* Bottom content: quote, name, stars */}
        <div style={{
          position: 'absolute', left: 22, right: 22, bottom: 22, zIndex: 3, color: '#fff',
        }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 10, color: '#FFD166' }}>
            {[0,1,2,3,4].map(i => <StarIcon key={i} size={13} />)}
          </div>
          <p style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(.92rem, 1.4vw, 1.04rem)',
            fontWeight: 500, lineHeight: 1.45,
            marginBottom: '.85rem',
            textShadow: '0 2px 16px rgba(0,0,0,.6)',
          }}>"{r.quote}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: `linear-gradient(135deg, ${r.color}, #f77f00)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 800,
              fontSize: '.95rem',
              boxShadow: `0 6px 20px ${r.glow}`,
            }}>
              {r.name[0]}
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.92rem', lineHeight: 1.1 }}>{r.name}</div>
              <div style={{ fontSize: '.74rem', opacity: .75, marginTop: 2, letterSpacing: '.03em' }}>{r.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ctrlBtn(color) {
  return {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,.16)',
    WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,.28)',
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .2s, transform .2s',
  }
}

/* ─────────── Cinematic 3D carousel of review videos ─────────── */
export default function Testimonials() {
  const [active, setActive] = useState(0)
  const { isMobile } = useDevice()
  const total = REVIEWS.length
  const sectionRef = useRef(null)

  /* Auto-advance — paused on hover via the inner cards' play state */
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % total), 7500)
    return () => clearInterval(id)
  }, [total])

  /* Scroll-driven parallax — works on mobile too */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const headingY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const headingRot = useTransform(scrollYProgress, [0, 1], [4, -4])

  const visible = isMobile ? 1 : 3
  const cardW = isMobile ? '78%' : 320
  const offsetSpread = isMobile ? 100 : 85

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #0a0a18 0%, #14142a 50%, #0a0a18 100%)',
        padding: 'clamp(5rem, 8vw, 8rem) 0',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      {/* Decorative glow blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,57,70,.18), transparent 65%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '5%',  right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,93,229,.16), transparent 65%)', filter: 'blur(70px)' }} />

      {/* Subtle film-grain texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Heading with scroll parallax */}
        <motion.div
          style={{ y: headingY, rotateZ: headingRot, textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}
        >
          <span className="label" style={{
            justifyContent: 'center',
            color: '#FFD166',
            background: 'rgba(255,209,102,.08)',
            padding: '.4rem 1rem',
            borderRadius: 9999,
            border: '1px solid rgba(255,209,102,.22)',
          }}>
            <span style={{ display: 'inline-flex', gap: 2 }}>
              {[0,1,2,3,4].map(i => <StarIcon key={i} size={11} />)}
            </span>
            Loved by the bold
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            margin: '1rem 0 .8rem',
            color: '#fff',
            letterSpacing: '-0.025em',
          }}>
            Real People. <span style={{
              background: 'linear-gradient(135deg, #ffd166, #ff70a6, #9b5de5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Real Pop.</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,.62)', maxWidth: 540, margin: '0 auto',
            fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', lineHeight: 1.7,
          }}>
            Watch what taste-makers, chefs, distributors and creators have to say about IndiColas.
          </p>
        </motion.div>

        {/* 3D Carousel stage */}
        <div style={{
          position: 'relative',
          height: isMobile ? 540 : 640,
          perspective: 2000,
          transformStyle: 'preserve-3d',
        }}>
          {REVIEWS.map((r, i) => {
            let offset = i - active
            if (offset >  total / 2) offset -= total
            if (offset < -total / 2) offset += total
            const abs = Math.abs(offset)
            const isActive = offset === 0
            const isVisible = abs <= visible

            const translateX = isMobile
              ? `${offset * offsetSpread}%`
              : `${offset * offsetSpread}%`
            const scale = isActive ? 1 : abs === 1 ? 0.78 : 0.6
            const rotY = offset * -25
            const opacity = isVisible ? (isActive ? 1 : abs === 1 ? 0.55 : 0.2) : 0

            return (
              <div
                key={r.id}
                onClick={() => setActive(i)}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: cardW,
                  maxWidth: 360,
                  transform: `translate(-50%, -50%) translateX(${translateX}) scale(${scale}) rotateY(${rotY}deg)`,
                  opacity,
                  zIndex: 100 - abs,
                  transition: 'transform .9s cubic-bezier(.32,.72,.32,1.02), opacity .7s ease',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                }}
              >
                <ReviewCard r={r} isActive={isActive} onActivate={() => setActive(i)} isMobile={isMobile} />
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '1rem', marginTop: 'clamp(2rem, 4vw, 3rem)',
        }}>
          <button onClick={() => setActive(a => (a - 1 + total) % total)} aria-label="Previous"
            style={navBtn()}>
            <ArrowIcon direction="left" size={18} />
          </button>

          <div style={{ display: 'flex', gap: '.45rem' }}>
            {REVIEWS.map((r, i) => (
              <button key={r.id} onClick={() => setActive(i)} aria-label={`Show review ${i+1}`}
                style={{
                  width: i === active ? 30 : 9, height: 9, borderRadius: 9999,
                  background: i === active ? r.color : 'rgba(255,255,255,.22)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  boxShadow: i === active ? `0 0 16px ${r.glow}` : 'none',
                  transition: 'width .4s, background .4s, box-shadow .4s',
                }} />
            ))}
          </div>

          <button onClick={() => setActive(a => (a + 1) % total)} aria-label="Next"
            style={navBtn()}>
            <ArrowIcon direction="right" size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

function navBtn() {
  return {
    width: 48, height: 48, borderRadius: '50%',
    background: 'rgba(255,255,255,.08)',
    WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,.14)',
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .2s, transform .2s, border-color .2s',
  }
}
