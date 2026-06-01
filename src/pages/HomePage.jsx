import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import VideoCard       from '../components/VideoCard'
import VideoLightbox   from '../components/VideoLightbox'
import MagneticButton  from '../components/MagneticButton'
import PopParticles    from '../components/PopParticles'
import Testimonials    from '../components/Testimonials'
import { useTilt, useDevice } from '../hooks/useTilt'
import { useScrollTilt, useParallax } from '../hooks/useScrollTilt'
import { playPop, playFizz, playClick } from '../hooks/useAudio'
import { VIDEO_FLAVORS } from '../data/videos'

gsap.registerPlugin(ScrollTrigger)

/* ─────────── CSS bubbles (no WebGL) ─────────── */
function Bubbles({ count = 18 }) {
  const bubbles = Array.from({ length: count }, (_, i) => ({
    size: 8 + Math.random() * 30,
    left: `${4 + Math.random() * 92}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${7 + Math.random() * 10}s`,
    color: ['#e63946','#f77f00','#06d6a0','#9b5de5','#00b4d8','#ffb347','#ff70a6'][i % 7],
  }))
  return (
    <div className="bubble-wrap" aria-hidden>
      {bubbles.map((b, i) => (
        <div key={i} className="bubble" style={{
          width: b.size, height: b.size, left: b.left,
          background: b.color, animationDuration: b.duration, animationDelay: b.delay,
        }} />
      ))}
    </div>
  )
}

function TiltImage({ src, mt = 0 }) {
  const tiltRef = useTilt({ intensity: 9, scale: 1.03 })
  const scrollRef = useScrollTilt({ amount: 7, axis: 'x', invert: true })
  return (
    <div ref={scrollRef} style={{ marginTop: mt, perspective: 1000 }}>
      <div ref={tiltRef} style={{ transformStyle: 'preserve-3d' }}>
        <img src={src} alt="" loading="lazy"
          style={{
            width:'100%', borderRadius:20, objectFit:'cover',
            aspectRatio:'1',
            boxShadow:'0 18px 48px rgba(26,26,46,.18), 0 4px 16px rgba(26,26,46,.08)',
          }} />
      </div>
    </div>
  )
}

/* ─────────── BACKGROUND VIDEOS — seamless crossfade between two slots ─────────── */
function BackgroundVideos({ activeIdx, isMobile, fallbackBg }) {
  const refA = useRef(null)
  const refB = useRef(null)
  const [primary, setPrimary] = useState(0)
  const prevIdx = useRef(-1)

  useEffect(() => {
    if (isMobile) return
    if (activeIdx === prevIdx.current) return

    const isFirst = prevIdx.current === -1
    const nextSlot = isFirst ? 0 : 1 - primary
    const nextVideo = nextSlot === 0 ? refA.current : refB.current

    if (nextVideo) {
      nextVideo.src = VIDEO_FLAVORS[activeIdx].video
      nextVideo.load()
      const p = nextVideo.play()
      if (p && p.catch) p.catch(() => {})
    }

    if (isFirst) {
      setPrimary(0)
    } else {
      /* small delay lets browser draw 1st frame before fade-in */
      const t = setTimeout(() => setPrimary(nextSlot), 80)
      return () => clearTimeout(t)
    }
    prevIdx.current = activeIdx
  }, [activeIdx, isMobile])

  /* Mobile: skip video, return null so section's CSS gradient shows through */
  if (isMobile) return null

  const baseStyle = {
    position: 'absolute',
    top: '-4%', left: '-4%',
    width: '108%', height: '108%',
    objectFit: 'cover',
    filter: 'blur(3px) saturate(1.18) brightness(1.04)',
    transition: 'opacity 1.4s ease',
    pointerEvents: 'none',
    transformOrigin: 'center',
    zIndex: 0,
  }

  return (
    <>
      {/* Solid fallback while videos load */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: fallbackBg, transition: 'background 1s ease',
      }} />

      <video ref={refA} muted loop playsInline preload="auto" aria-hidden
        style={{ ...baseStyle, opacity: primary === 0 ? 1 : 0 }} />
      <video ref={refB} muted loop playsInline preload="auto" aria-hidden
        style={{ ...baseStyle, opacity: primary === 1 ? 1 : 0 }} />
    </>
  )
}

function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let s = 0; const step = Math.max(1, Math.ceil(end / 40))
    const id = setInterval(() => {
      s = Math.min(s + step, end); setVal(s)
      if (s >= end) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [inView, end])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─────────── NOW PLAYING PILL — floating glass card with live indicator ─────────── */
function NowPlayingPill({ activeIdx, setActiveIdx, onOpenLightbox }) {
  const v = VIDEO_FLAVORS[activeIdx]
  return (
    <div style={{
      position: 'absolute',
      bottom: 'clamp(2rem, 4vw, 3rem)',
      right: 'clamp(1.5rem, 4vw, 3rem)',
      zIndex: 10,
      padding: '1.1rem 1.4rem',
      background: 'rgba(255,255,255,.78)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      backdropFilter: 'blur(24px) saturate(1.4)',
      borderRadius: 22,
      boxShadow: `0 20px 50px ${v.glow}, 0 6px 18px rgba(26,26,46,.08)`,
      border: `1px solid ${v.color}28`,
      display: 'flex', flexDirection: 'column', gap: '.45rem',
      minWidth: 230, maxWidth: 280,
      transition: 'box-shadow 1s ease, border 1s ease',
    }}>
      {/* Live indicator + label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.45rem',
        fontSize: '.62rem', fontWeight: 700, letterSpacing: '.16em',
        textTransform: 'uppercase', color: v.color,
        transition: 'color 1s',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: v.color,
          boxShadow: `0 0 10px ${v.color}`,
          animation: 'pulse 1.5s ease-in-out infinite',
          transition: 'background 1s, box-shadow 1s',
        }} />
        Now Playing
      </div>

      {/* Flavor name */}
      <div style={{
        fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 800,
        color: '#1a1a2e', lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>
        {v.name}
      </div>
      <div style={{ fontSize: '.78rem', color: '#6b7280', fontWeight: 500, lineHeight: 1.4 }}>
        {v.tagline}
      </div>

      {/* Dots + watch button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.4rem', gap: '.6rem' }}>
        <div style={{ display: 'flex', gap: '.32rem' }}>
          {VIDEO_FLAVORS.map((f, i) => (
            <button key={f.name}
              onClick={() => { playClick(); setActiveIdx(i) }}
              aria-label={`Switch to ${f.name}`}
              style={{
                width: i === activeIdx ? 22 : 8, height: 8, borderRadius: 9999,
                background: i === activeIdx ? f.color : 'rgba(26,26,46,.18)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width .4s, background .4s',
              }} />
          ))}
        </div>
        <button
          onClick={() => { playClick(); onOpenLightbox(v) }}
          aria-label="Watch full screen"
          data-cursor="video"
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: v.color, color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: '.8rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 16px ${v.color}66`,
            transition: 'transform .2s, box-shadow .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >▶</button>
      </div>
    </div>
  )
}

/* ─────────── MARQUEE STRIP — infinite scrolling tagline band ─────────── */
function MarqueeStrip({ items, speed = 30, reverse = false, color = '#e63946', textColor = '#fff' }) {
  return (
    <div style={{
      overflow: 'hidden',
      background: color,
      padding: 'clamp(1rem, 1.8vw, 1.4rem) 0',
      whiteSpace: 'nowrap',
      transform: 'rotate(-1.4deg)',
      margin: 'clamp(3rem, 6vw, 5rem) 0',
      boxShadow: '0 16px 40px rgba(26,26,46,.08)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
      }}>
        {[0, 1, 2].map(rep => items.map((item, i) => (
          <span key={`${rep}-${i}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '1.2rem', padding: '0 1.6rem',
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
            fontWeight: 800, color: textColor, letterSpacing: '-0.01em',
          }}>
            {item}
            <span style={{ fontSize: '.7em', opacity: .6 }}>★</span>
          </span>
        )))}
      </div>
    </div>
  )
}

/* ─────────── HERO VIDEO PLAYER — clickable, pops on click ─────────── */
function HeroVideo({ activeIdx, setActiveIdx, onPop, onOpenLightbox, popping }) {
  const tiltRef = useTilt({ intensity: 11, scale: 1.02 })
  const videoRef = useRef(null)
  const { isTouch } = useDevice()
  const v = VIDEO_FLAVORS[activeIdx]

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.load()
    videoRef.current.play().catch(() => {})
  }, [activeIdx])

  return (
    <div style={{ perspective: 1400, position: 'relative' }}>
      {/* Glow halo */}
      <div style={{
        position: 'absolute', inset: '-10%',
        background: `radial-gradient(circle, ${v.glow} 0%, transparent 65%)`,
        filter: 'blur(40px)', opacity: .8, zIndex: 0,
        transition: 'background .8s ease',
      }} />

      <div
        ref={isTouch ? null : tiltRef}
        data-cursor="video"
        onClick={onPop}
        style={{
          position: 'relative', zIndex: 1,
          aspectRatio: '9 / 16', width: '100%', maxWidth: 380,
          margin: '0 auto',
          borderRadius: 32,
          boxShadow: `0 40px 80px ${v.glow}, 0 12px 32px rgba(0,0,0,.15)`,
          cursor: 'pointer',
          transform: popping ? 'scale(0.97) rotate(-1deg)' : undefined,
          transition: 'box-shadow .8s ease, transform .15s ease',
        }}
      >
        {/* Animated rainbow border */}
        <div style={{
          position: 'absolute', inset: -3, borderRadius: 35,
          background: `conic-gradient(from 0deg, ${v.color}, transparent 30%, ${v.color}80 60%, transparent 90%, ${v.color})`,
          animation: 'spin 6s linear infinite', zIndex: 0,
        }} />

        <div style={{
          position: 'absolute', inset: 3, borderRadius: 30,
          overflow: 'hidden', background: '#000', zIndex: 1,
        }}>
          <video
            ref={videoRef}
            key={v.video}
            src={v.video}
            poster={v.poster}
            muted loop autoPlay playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,.75), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Watch full screen */}
          <button
            onClick={(e) => { e.stopPropagation(); playClick(); onOpenLightbox(v) }}
            aria-label="Watch full screen"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,.2)',
              WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.3)',
              color: '#fff', fontSize: '.95rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5,
            }}
          >⤢</button>

          {/* Name plate */}
          <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
            <div style={{
              display: 'inline-block', padding: '.22rem .8rem',
              borderRadius: 9999, fontSize: '.7rem', fontWeight: 700,
              letterSpacing: '.1em', textTransform: 'uppercase',
              background: v.color, marginBottom: '.5rem',
            }}>Now playing</div>
            <h3 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 'clamp(1.2rem,2.5vw,1.6rem)',
              fontWeight: 800, lineHeight: 1.1,
            }}>{v.name}</h3>
            <p style={{ fontSize: '.8rem', opacity: .85, marginTop: 4 }}>{v.tagline}</p>
          </div>

          {/* Splash overlay */}
          <PopParticles active={popping} color={v.color} />

          {/* POP hint */}
          {!popping && (
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: 16, left: 16, zIndex: 4,
                padding: '.35rem .8rem', borderRadius: 9999,
                background: '#fff', color: v.color,
                fontFamily: "'Sora',sans-serif",
                fontSize: '.7rem', fontWeight: 800, letterSpacing: '.08em',
                textTransform: 'uppercase',
                boxShadow: '0 6px 20px rgba(0,0,0,.15)',
                transition: 'color .5s',
              }}
            >
              ▼ Click to Pop
            </motion.div>
          )}
        </div>
      </div>

      {/* Indicator dots */}
      <div style={{
        display: 'flex', gap: '.5rem', justifyContent: 'center',
        marginTop: '1.5rem', position: 'relative', zIndex: 2,
      }}>
        {VIDEO_FLAVORS.map((f, i) => (
          <button
            key={f.name}
            onClick={() => { playClick(); setActiveIdx(i) }}
            aria-label={`Play ${f.name}`}
            style={{
              width: i === activeIdx ? 32 : 9,
              height: 9, borderRadius: 9999,
              background: i === activeIdx ? f.color : 'rgba(26,26,46,.18)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width .4s ease, background .4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────── 3D CINEMATIC CAROUSEL ─────────── */
function VideoCarousel({ onCardClick }) {
  const [active, setActive] = useState(0)
  const { isMobile } = useDevice()
  const total = VIDEO_FLAVORS.length

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % total), 6500)
    return () => clearInterval(id)
  }, [total])

  return (
    <div data-cursor="drag" style={{
      position: 'relative',
      height: isMobile ? 460 : 580,
      perspective: 1800,
      transformStyle: 'preserve-3d',
      marginBottom: '2rem',
    }}>
      {VIDEO_FLAVORS.map((v, i) => {
        let offset = i - active
        if (offset >  total / 2) offset -= total
        if (offset < -total / 2) offset += total
        const abs = Math.abs(offset)
        const isActive = offset === 0
        const isAdjacent = abs === 1
        const visible = abs <= 1

        return (
          <div
            key={v.name}
            onClick={() => { playClick(); isActive ? onCardClick(v) : setActive(i) }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: isMobile ? 220 : 340,
              height: isMobile ? 400 : 540,
              transform: `translate(-50%,-50%) translateX(${offset * (isMobile ? 50 : 90)}%) scale(${isActive ? 1 : isAdjacent ? .72 : .5}) rotateY(${offset * -22}deg)`,
              opacity: visible ? (isActive ? 1 : .55) : 0,
              transition: 'transform .8s cubic-bezier(.32,.72,.32,1.02), opacity .6s ease',
              zIndex: 100 - abs,
              cursor: 'pointer',
              pointerEvents: visible ? 'auto' : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            <div style={{
              width: '100%', height: '100%',
              borderRadius: 24, overflow: 'hidden',
              boxShadow: isActive ? `0 40px 80px ${v.glow}, 0 12px 30px rgba(0,0,0,.18)` : `0 20px 40px rgba(0,0,0,.15)`,
              position: 'relative', background: '#000',
              transition: 'box-shadow .8s ease',
            }}>
              <video
                src={v.video} poster={v.poster}
                muted loop autoPlay playsInline preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,.85), transparent)',
              }} />
              <div style={{ position: 'absolute', left: 18, right: 18, bottom: 20, color: '#fff' }}>
                <span style={{
                  display: 'inline-block', padding: '.2rem .7rem',
                  borderRadius: 9999, background: v.color, fontSize: '.66rem',
                  fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                  marginBottom: '.5rem',
                }}>{v.tag}</span>
                <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.2rem', fontWeight: 800 }}>{v.name}</h4>
                <p style={{ fontSize: '.78rem', opacity: .85, marginTop: 2 }}>{v.tagline}</p>
              </div>
              {isActive && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,.2)',
                  WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1rem',
                }}>▶</div>
              )}
            </div>
          </div>
        )
      })}

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '.75rem', zIndex: 200,
      }}>
        <button onClick={() => { playClick(); setActive(a => (a - 1 + total) % total) }} aria-label="Previous"
          style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.1)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e63946', fontWeight: 700 }}>‹</button>
        <div style={{ display: 'flex', gap: '.4rem' }}>
          {VIDEO_FLAVORS.map((v, i) => (
            <button key={v.name} onClick={() => { playClick(); setActive(i) }} aria-label={`Slide ${i+1}`}
              style={{
                width: i === active ? 28 : 9, height: 9, borderRadius: 9999,
                background: i === active ? v.color : 'rgba(26,26,46,.2)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width .4s, background .4s',
              }} />
          ))}
        </div>
        <button onClick={() => { playClick(); setActive(a => (a + 1) % total) }} aria-label="Next"
          style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.1)', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e63946', fontWeight: 700 }}>›</button>
      </div>
    </div>
  )
}

/* ─────────── HOME PAGE ─────────── */
export default function HomePage() {
  const heroRef     = useRef()
  const headRef     = useRef()
  const heroBgRef   = useRef()
  const continueRef = useRef()

  const [activeHero, setActiveHero] = useState(0)
  const [lightbox, setLightbox]     = useState(null)
  const [popping, setPopping]       = useState(false)
  const { isMobile } = useDevice()

  /* Auto-rotate hero — paused while popping */
  useEffect(() => {
    if (popping) return
    const id = setInterval(() => setActiveHero(i => (i + 1) % VIDEO_FLAVORS.length), 7000)
    return () => clearInterval(id)
  }, [popping])

  /* GSAP entrance + scroll-driven hero (desktop only).
     Pinning is intentionally avoided: ScrollTrigger.pin wraps the trigger
     in a pin-spacer div that survives ctx.revert(), which then causes
     React to throw "Failed to execute 'removeChild'" on route change and
     blanks every subsequent page. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = headRef.current?.querySelectorAll('.anim')
      if (els) gsap.from(els, { y: 60, opacity: 0, stagger: .1, duration: 1, ease: 'power4.out', delay: .25 })

      if (typeof window !== 'undefined' && window.innerWidth >= 900) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            scrub: 1,
            start: 'top top',
            end: 'bottom top',
            invalidateOnRefresh: true,
          }
        })

        tl.to(headRef.current, { y: -120, scale: 0.88, opacity: 0.55 }, 0)
          .to(heroBgRef.current, { opacity: 1 }, 0.2)
          .from(continueRef.current, { opacity: 0, y: 80 }, 0.6)
          .to(continueRef.current, { y: 0 }, 0.6)
      }
    }, heroRef)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      ctx.revert()
    }
  }, [])

  const featured = VIDEO_FLAVORS[activeHero]

  /* Pop bottle handler */
  const handlePop = () => {
    if (popping) return
    setPopping(true)
    playPop()
    setTimeout(() => playFizz(), 120)
    setTimeout(() => {
      setPopping(false)
      /* After pop, open lightbox so user sees the full video experience */
      setLightbox(VIDEO_FLAVORS[activeHero])
    }, 1250)
  }

  return (
    <>
      {/* ════════════════════════════════════════════ HERO (PINNED) ════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: `linear-gradient(135deg, #fff8f0 0%, ${featured.light} 50%, #fdf4ff 100%)`,
        transition: 'background 1s ease',
        paddingTop: 'var(--nav-h)',
      }}>
        {/* Cinematic background videos — crossfade through all 4 flavors */}
        <BackgroundVideos
          activeIdx={activeHero}
          isMobile={isMobile}
          fallbackBg={`linear-gradient(135deg, #fff8f0 0%, ${featured.light} 50%, #fdf4ff 100%)`}
        />

        {/* Directional overlay — opaque on LEFT (text area), clear on RIGHT (video visible) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: isMobile
            ? `linear-gradient(180deg, rgba(255,253,245,.78) 0%, rgba(255,250,240,.65) 50%, rgba(255,250,240,.45) 100%)`
            : `linear-gradient(95deg, rgba(255,253,245,.96) 0%, rgba(255,250,240,.88) 28%, rgba(255,250,240,.45) 52%, rgba(255,250,240,.15) 76%, rgba(255,250,240,.22) 100%)`,
          transition: 'background .8s ease',
        }} />

        {/* Secondary background that fades in during pin scene 3 */}
        <div ref={heroBgRef} style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 70% 50%, ${featured.glow} 0%, transparent 55%)`,
          opacity: 0, zIndex: 1,
          transition: 'background 1s ease',
          pointerEvents: 'none',
        }} />

        {/* Film grain — subtle cinematic noise texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          opacity: 0.06, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }} />

        <div className="blob" style={{ width: 380, height: 380, bottom: '-10%', left: '5%',  background: 'rgba(247,127,0,.14)',  animationDelay: '-3s', zIndex: 1 }} />
        <div className="blob" style={{ width: 260, height: 260, top: '30%',  left: '20%',  background: 'rgba(155,93,229,.12)', animationDelay: '-6s', zIndex: 1 }} />

        <Bubbles count={22} />

        {/* Splash overlay — emanates from center of hero when Fizz is clicked */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none' }}>
          <PopParticles active={popping} color={featured.color} />
        </div>

        <div className="container" style={{
          position: 'relative', zIndex: 3,
          minHeight: '88vh', display: 'flex', alignItems: 'center',
        }}>
          {/* Text — constrained to left ~52% so video shows on right */}
          <div ref={headRef} style={{ maxWidth: '52%', minWidth: 320 }} className="hero-text">
            <span className="label anim">Born From Banta Culture</span>
            <h1 className="anim" style={{ fontSize: 'clamp(3rem,7vw,5.8rem)', marginBottom: '1.2rem', letterSpacing: '-0.03em' }}>
              Pop The<br />
              <span
                onClick={handlePop}
                data-cursor="video"
                className="grad fizz-clickable"
                style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
                title="Click to Pop!"
              >
                Fizz.
                <span style={{
                  position: 'absolute', top: -8, right: -42,
                  fontSize: '.85rem', fontWeight: 700, padding: '.25rem .55rem',
                  borderRadius: 9999, background: featured.color, color: '#fff',
                  WebkitTextFillColor: '#fff', backgroundImage: 'none',
                  letterSpacing: '.05em', boxShadow: `0 4px 14px ${featured.glow}`,
                  fontFamily: "'Sora',sans-serif",
                  animation: 'wiggle 2.4s ease-in-out infinite',
                  transition: 'background 1s, box-shadow 1s',
                }}>POP!</span>
              </span>
            </h1>
            <p className="anim" style={{
              fontSize: 'clamp(1rem,2vw,1.18rem)', color: '#4a4a5e',
              lineHeight: 1.75, maxWidth: 460, marginBottom: '2.2rem',
              textShadow: '0 1px 12px rgba(255,253,245,.9)',
            }}>
              Heritage-inspired sodas with a bold modern twist — bringing India's iconic Goli Soda culture to the USA in 12 vibrant flavors.
            </p>
            <div className="anim" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/flavors" style={{ textDecoration: 'none' }} onClick={() => playClick()}>
                <MagneticButton className="btn btn-primary" style={{ fontSize: '1.02rem', padding: '1rem 2.2rem' }}>
                  Explore Flavors →
                </MagneticButton>
              </Link>
              <Link to="/about" className="btn btn-outline" style={{ fontSize: '1.02rem', padding: '1rem 2.2rem' }} onClick={() => playClick()}>
                Our Story
              </Link>
            </div>
            <div className="anim" style={{
              display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
              paddingTop: '2rem', borderTop: '1px solid rgba(26,26,46,.1)',
            }}>
              {[['12','Bold Flavors'],['4','Video Stories'],['1','Iconic Heritage']].map(([n,l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: "'Sora',sans-serif", fontSize: '2rem', fontWeight: 800,
                    background: `linear-gradient(135deg, ${featured.color}, #f77f00)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    transition: 'background 1s',
                  }}>{n}</div>
                  <div style={{ fontSize: '.77rem', color: '#6b7280', fontWeight: 500, marginTop: 2, letterSpacing: '.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Now Playing pill — bottom-right glass card */}
        {!isMobile && (
          <NowPlayingPill
            activeIdx={activeHero}
            setActiveIdx={setActiveHero}
            onOpenLightbox={(v) => setLightbox(v)}
          />
        )}

        {/* Continue text (appears during scene 3 of pin) */}
        <div ref={continueRef} style={{
          position: 'absolute', bottom: '8%', left: 0, right: 0,
          textAlign: 'center', zIndex: 3, pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(.78rem,1.1vw,.88rem)',
            fontWeight: 700, letterSpacing: '.18em',
            textTransform: 'uppercase', color: '#9ca3af',
          }}>
            Watch The Fizz ↓
          </div>
        </div>

        <div className="scroll-ind">
          <div className="scroll-ind__mouse"><div className="scroll-ind__dot" /></div>
          <span>Scroll</span>
        </div>

        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 80, fill: '#fff', pointerEvents: 'none' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* ═══════════════════════════════════════ MARQUEE STRIP ════ */}
      <MarqueeStrip
        items={['POP THE FIZZ', 'BOLD DESI FLAVORS', 'BORN FROM BANTA', '12 VIBRANT FLAVORS', 'CRAFTED FOR THE BOLD']}
        speed={32}
        color="#e63946"
        textColor="#fff"
      />

      {/* ═══════════════════════════════════════ WATCH THE FIZZ — 3D VIDEO WALL ════ */}
      <section style={{ background: '#fff', padding: '4rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="blob" style={{ width: 400, height: 400, top: '5%', left: '-10%', background: 'rgba(230,57,70,.1)' }} />
        <div className="blob" style={{ width: 350, height: 350, bottom: '0', right: '-5%', background: 'rgba(155,93,229,.1)', animationDelay: '-3s' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:.8 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label" style={{ justifyContent: 'center' }}>The IndiColas Experience</span>
            <h2 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', marginBottom: '1rem' }}>
              Watch The <span className="grad">Fizz</span>
            </h2>
            <p style={{ color: '#6b7280', maxWidth: 520, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Tilt, hover, click. Experience each flavor as a cinematic moment. Bold flavors deserve bold stories.
            </p>
          </motion.div>

          <div className="video-wall" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}>
            {VIDEO_FLAVORS.map((v, i) => (
              <motion.div key={v.name}
                initial={{ opacity:0, y:60 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-50px' }}
                transition={{ duration:.7, delay: i * .1 }}
                data-cursor="video"
                onClick={() => playClick()}
              >
                <VideoCard
                  src={v.video}
                  poster={v.poster}
                  name={v.name}
                  tagline={v.tagline}
                  color={v.color}
                  glow={v.glow}
                  height={isMobile ? 380 : 460}
                  tiltIntensity={18}
                  onClick={() => { playClick(); setLightbox(v) }}
                />
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/flavors" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }} onClick={() => playClick()}>
              View All 12 Flavors →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CINEMATIC CAROUSEL ════ */}
      <section style={{
        background: 'linear-gradient(180deg, #fffdf5 0%, #fff8f0 50%, #fff5f8 100%)',
        padding: '5rem 0 6rem', position: 'relative', overflow: 'hidden',
      }}>
        <div className="blob" style={{ width: 500, height: 500, top: '10%', right: '0%', background: 'rgba(247,127,0,.12)' }} />
        <div className="blob" style={{ width: 400, height: 400, bottom: '5%', left: '5%', background: 'rgba(6,214,160,.12)', animationDelay: '-4s' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="label" style={{ justifyContent: 'center' }}>On Demand</span>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,3.4rem)', marginBottom: '1rem' }}>
              Step Into The <span className="grad">Cinema</span>
            </h2>
            <p style={{ color: '#6b7280', maxWidth: 500, margin: '0 auto', fontSize: '1.02rem', lineHeight: 1.7 }}>
              Browse our flavor stories on a cinematic carousel. Click the active video to play full-screen.
            </p>
          </motion.div>

          <VideoCarousel onCardClick={(v) => setLightbox(v)} />
        </div>
      </section>

      {/* ══════════════════════════════════ WHAT IS INDICOLA — LIFESTYLE COLLAGE ═══ */}
      <section style={{ background: '#fff', padding: '6rem 0' }}>
        <div className="container">
          <div className="lifestyle-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
          }}>
            <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}
              style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <TiltImage src="/images/lifestyle1.jpeg" mt={0} />
                <TiltImage src="/images/lifestyle2.jpeg" mt="2.5rem" />
                <TiltImage src="/images/lifestyle3.jpeg" mt={0} />
                <TiltImage src="/images/lifestyle4.jpeg" mt="-2rem" />
              </div>
              <div style={{
                position:'absolute', bottom:-20, right:-20,
                background:'linear-gradient(135deg,#e63946,#f77f00)', color:'#fff',
                borderRadius:16, padding:'1rem 1.5rem',
                boxShadow:'0 12px 36px rgba(230,57,70,.35)', fontFamily:"'Sora',sans-serif",
                zIndex: 2,
              }}>
                <div style={{ fontSize:'2rem', fontWeight:800, lineHeight:1 }}>12</div>
                <div style={{ fontSize:'.78rem', fontWeight:600 }}>Bold Flavors</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}>
              <span className="label">What is IndiColas</span>
              <h2 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', marginBottom:'1.2rem' }}>
                Where Every Sip<br /><span className="grad">Sparks Adventure!</span>
              </h2>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem', fontSize:'1.05rem' }}>
                IndiColas is the newest sensation shaking up America's beverage scene — blending cherished soda traditions with modern innovation.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'2rem', fontSize:'1.05rem' }}>
                Inspired by the iconic Codd-neck Goli Soda bottle, we've reinvented the experience with premium ingredients and eco-friendly packaging.
              </p>
              <div style={{ display:'flex', gap:'1.5rem', marginBottom:'2.5rem', flexWrap: 'wrap' }}>
                {[['Quality','Premium ingredients & craft'],['Heritage','Born from Banta culture'],['Innovation','12 bold modern flavors']].map(([t,d]) => (
                  <div key={t}>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#e63946', marginBottom:'.25rem' }}>{t}</div>
                    <div style={{ fontSize:'.8rem', color:'#9ca3af', maxWidth: 180 }}>{d}</div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary" onClick={() => playClick()}>Learn More About Us</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ BANNER ═══ */}
      <section style={{ position:'relative', overflow:'hidden', height: isMobile ? 320 : 440 }}>
        <img src="/images/banner.jpg" alt=""
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(230,57,70,.78) 0%,rgba(247,127,0,.5) 100%)',
          display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
          textAlign:'center', color:'#fff', padding:'2rem',
        }}>
          <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ fontSize:'clamp(1.8rem,5vw,3.5rem)', marginBottom:'1rem', textShadow:'0 4px 20px rgba(0,0,0,.3)' }}>
            "More than a drink — it's a <em>vibe</em> in every bottle."
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ duration:.8, delay:.2 }}
            style={{ fontSize:'1.05rem', opacity:.9, marginBottom:'1.5rem', maxWidth: 520 }}>
            Crafted with bold desi flavors, IndiColas brings a fizzy twist to every moment.
          </motion.p>
          <Link to="/flavors" className="btn btn-white" onClick={() => playClick()}>Explore All Flavors →</Link>
        </div>
      </section>

      {/* ══════════════════════════════════ TESTIMONIALS — REAL REVIEW VIDEOS ═══ */}
      <Testimonials />

      {/* ══════════════════════════════════ STATS ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#e63946 0%,#f77f00 60%,#ff70a6 100%)',
        padding:'4.5rem 0', color:'#fff', position: 'relative', overflow: 'hidden',
      }}>
        <Bubbles count={10} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:'2.5rem', textAlign:'center' }}>
            {[{ n: 12, s: '+', l: 'Bold Flavors' },{ n: 100, s: '%', l: 'Premium Quality' },{ n: 4,  s: '', l: 'Video Stories' },{ n: 2,  s: '', l: 'US Locations' }].map(({ n, s, l }) => (
              <div key={l}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(2.5rem,5vw,3.5rem)', fontWeight:800, lineHeight:1 }}>
                  <Counter end={n} suffix={s} />
                </div>
                <div style={{ fontSize:'.92rem', opacity:.9, marginTop:'.4rem', fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ NEWSLETTER ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#9b5de5 0%,#e63946 50%,#f77f00 100%)',
        padding:'6rem 0', position:'relative', overflow:'hidden',
      }}>
        <Bubbles count={14} />
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:640, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', color:'#fff', marginBottom:'1rem' }}>
              Don't Just Drink It… <em>Join It!</em>
            </h2>
            <p style={{ color:'rgba(255,255,255,.85)', marginBottom:'2.5rem', fontSize:'1.05rem', lineHeight:1.7 }}>
              Unlock fizzy offers, new flavor drops, and insider perks delivered to your inbox.
            </p>
            <form onSubmit={e => { e.preventDefault(); playFizz() }} style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', justifyContent:'center' }}>
              <input type="email" placeholder="your@email.com" data-cursor="text" style={{
                flex:'1 1 260px', padding:'.95rem 1.4rem', borderRadius:9999, border:'none',
                fontSize:'1rem', fontFamily:"'Inter',sans-serif", outline:'none',
                boxShadow:'0 4px 20px rgba(0,0,0,.12)',
              }} />
              <button type="submit" className="btn btn-white">Pop the Fizz →</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <VideoLightbox
        open={!!lightbox}
        onClose={() => setLightbox(null)}
        video={lightbox?.video}
        name={lightbox?.name}
        color={lightbox?.color}
      />

      <style>{`
        @media(max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-grid > div:last-child { order: -1; }
          .lifestyle-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </>
  )
}
