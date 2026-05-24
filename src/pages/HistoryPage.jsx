import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useTilt, useDevice } from '../hooks/useTilt'
import { useScrollTilt, useParallax } from '../hooks/useScrollTilt'
import { ArrowIcon } from '../components/SocialIcons'
import SplitText      from '../components/SplitText'
import ScrollProgress from '../components/ScrollProgress'
import CountUp        from '../components/CountUp'
import MarqueeStrip   from '../components/MarqueeStrip'

const TIMELINE = [
  {
    year: 1872, era: '1872 — United Kingdom', sub: 'The Birth',
    title: 'Invented in Victorian England',
    color: '#9b5de5', bg: '#f3e8ff',
    img: '/images/history1.jpeg',
    facts: [
      'Patented in 1872 by Hiram Codd',
      'Naturally seals carbonation using a glass marble',
      'Known as the Codd-neck bottle',
      'A packaging revolution of the Victorian era',
    ],
  },
  {
    year: 1890, era: 'Late 1800s — Japan', sub: 'The Adoption',
    title: "Japan's Cultural Twist",
    color: '#e63946', bg: '#ffe4e6',
    img: '/images/history2.jpeg',
    facts: [
      'Reached Japan in the late 19th century',
      'Became iconic through the drink Ramune',
      'Turned into an interactive beverage ritual',
      'The "push-the-marble" gesture entered pop culture',
    ],
  },
  {
    year: 1947, era: 'British India Era', sub: 'The Emotion',
    title: "India's Goli Soda Era",
    color: '#f77f00', bg: '#fff3e0',
    img: '/images/history3.jpeg',
    facts: [
      'Introduced during British rule',
      'Famous as Goli Soda / Banta / Goti Soda',
      'The iconic "POP" sound defined Indian summers',
      'Sold at street stalls, railway stations, local markets',
    ],
  },
  {
    year: 2025, era: 'Today — USA', sub: 'The Revival',
    title: "IndiColas' Modern Movement",
    color: '#06d6a0', bg: '#d1fae5',
    img: '/images/history4.jpeg',
    facts: [
      'Refined bottle engineering & premium branding',
      'Hygienic, scalable, eco-friendly production',
      'Bursting, innovative flavors',
      'Designed for global markets — India & USA',
    ],
  },
]

/* ─────────── Floating decorative SVG icons (parallax) ─────────── */
function Floater({ children, x, y, size, delay = 0, speed = 0.15, axis = 'y' }) {
  const ref = useParallax({ speed, axis })
  return (
    <div ref={ref} style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      zIndex: 0, pointerEvents: 'none', opacity: 0.45,
      animation: `floatSoft 6s ease-in-out ${delay}s infinite`,
    }}>{children}</div>
  )
}

function FizzCircle({ color = '#e63946', size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 6" />
      <circle cx="40" cy="40" r="6" fill={color} />
    </svg>
  )
}

function BottleSilhouette({ color = '#9b5de5', size = 90 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 100" fill="none">
      <path d="M22 6 h16 v8 q0 4 -3 6 l-2 2 v8 q8 4 8 16 v40 q0 8 -8 8 h-6 q-8 0 -8 -8 v-40 q0 -12 8 -16 v-8 l-2 -2 q-3 -2 -3 -6 v-8 z"
        stroke={color} strokeWidth="2" fill={color + '10'} strokeLinejoin="round" />
      <circle cx="30" cy="22" r="3" fill={color} opacity=".6" />
    </svg>
  )
}

/* ─────────── Animated spine + traveling glow ─────────── */
function TimelineSpine({ sectionRef }) {
  const fillRef = useRef(null)
  const dotRef  = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    let raf = null
    const update = () => {
      raf = null
      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      /* Progress: 0 when section top hits center, 1 when section bottom hits center */
      const start = (vh * 0.5) - rect.top
      const total = rect.height
      const prog = Math.max(0, Math.min(1, start / total))
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${prog})`
      if (dotRef.current)  dotRef.current.style.top = `${prog * 100}%`
      setP(prog)
    }
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [sectionRef])

  /* Glow color shifts based on progress through the eras */
  const COLORS = ['#9b5de5', '#e63946', '#f77f00', '#06d6a0']
  const idx    = Math.min(COLORS.length - 1, Math.floor(p * COLORS.length))
  const color  = COLORS[idx]

  return (
    <>
      {/* Track (faded background line) */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 'calc(50% - 1px)',
        width: 2, background: 'rgba(26,26,46,.08)', borderRadius: 2,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Fill (gradient line scaling from top) */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 'calc(50% - 1.5px)',
        width: 3, borderRadius: 3,
        background: 'linear-gradient(to bottom,#9b5de5,#e63946,#f77f00,#06d6a0)',
        transformOrigin: 'top',
        pointerEvents: 'none', zIndex: 1,
        boxShadow: `0 0 12px ${color}88`,
        transition: 'box-shadow .6s ease',
      }}>
        <div ref={fillRef} style={{
          position: 'absolute', inset: 0,
          background: 'inherit', borderRadius: 'inherit',
          transformOrigin: 'top', transform: 'scaleY(0)',
          willChange: 'transform',
        }} />
      </div>

      {/* Traveling glow dot */}
      <div ref={dotRef} style={{
        position: 'absolute', left: '50%',
        top: '0%', width: 0, height: 0,
        transform: 'translateX(-50%)',
        zIndex: 2, pointerEvents: 'none',
        transition: 'top .15s ease-out',
      }}>
        <div style={{
          position: 'absolute', left: -16, top: -16,
          width: 32, height: 32, borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 0 0 4px ${color}44, 0 0 40px 6px ${color}, 0 0 80px ${color}88`,
          transition: 'box-shadow .8s ease',
        }} />
        <div style={{
          position: 'absolute', left: -6, top: -6,
          width: 12, height: 12, borderRadius: '50%',
          background: color,
          transition: 'background .8s ease',
        }} />
      </div>
    </>
  )
}

/* ─────────── Timeline card with huge year watermark + counter ─────────── */
function TimelineItem({ t, i }) {
  const ref     = useRef()
  const inView  = useInView(ref, { once: true, margin: '-80px' })
  const isEven  = i % 2 === 0
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 12, scale: 1.03 })
  const stRef   = useScrollTilt({ amount: 5, axis: 'x', invert: !isEven })

  return (
    <div ref={ref} className="timeline-row" style={{
      display: 'grid', gridTemplateColumns: '1fr 60px 1fr',
      gap: 0, marginBottom: '4.5rem', alignItems: 'start',
      position: 'relative',
    }}>
      {/* Giant background year watermark — opposite side from card */}
      <div className="year-watermark" style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [isEven ? 'right' : 'left']: '4%',
        fontFamily: "'Sora',sans-serif",
        fontSize: 'clamp(7rem, 16vw, 16rem)',
        fontWeight: 900,
        letterSpacing: '-0.06em',
        color: t.color,
        opacity: inView ? 0.08 : 0,
        lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none',
        zIndex: 0,
        transition: 'opacity 1.4s ease 0.3s',
        whiteSpace: 'nowrap',
      }}>
        {t.year}
      </div>

      {/* Card column */}
      <div style={{ paddingRight: '2rem', ...(isEven ? {} : { gridColumn: '3' }), zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: .8, delay: i * .1 }}
          style={{ perspective: 1200 }}
        >
          <div ref={stRef}>
            <div
              ref={isMobile ? null : tiltRef}
              style={{
                background: '#fff', borderRadius: 24, overflow: 'hidden',
                boxShadow: `0 22px 56px ${t.color}26, 0 4px 14px ${t.color}14`,
                border: `1px solid ${t.color}28`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                position: 'relative',
              }}
            >
              {/* Image with parallax + reveal */}
              <div style={{ height: 250, overflow: 'hidden', position: 'relative' }}>
                <motion.img
                  src={t.img} alt={t.title}
                  initial={{ scale: 1.2 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 1.6, ease: [0.2, 0.7, 0.3, 1] }}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                  }}
                />
                {/* Color overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, ${t.color}cc 0%, ${t.color}44 40%, transparent 75%)`,
                }} />
                {/* Era pill */}
                <div className="tag" style={{
                  position: 'absolute', top: '1.1rem', left: '1.1rem',
                  background: t.color, color: '#fff',
                  boxShadow: `0 6px 18px ${t.color}80, inset 0 1px 0 rgba(255,255,255,.3)`,
                }}>{t.era}</div>
                {/* Sub eyebrow */}
                <div style={{
                  position: 'absolute', bottom: '1rem', left: '1.1rem',
                  color: '#fff', fontFamily: "'Sora',sans-serif",
                  fontSize: '.72rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase',
                  textShadow: '0 2px 12px rgba(0,0,0,.4)',
                }}>{t.sub}</div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.75rem 1.7rem 1.85rem' }}>
                {/* Year counter — premium animated number */}
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: '2.4rem', fontWeight: 800, lineHeight: 1,
                  marginBottom: '.5rem',
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  letterSpacing: '-0.03em',
                }}>
                  <CountUp end={t.year} startFrom={Math.max(0, t.year - 80)} duration={1600} />
                </div>

                <h3 style={{
                  fontFamily: "'Sora',sans-serif", fontSize: '1.4rem',
                  fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em',
                }}>{t.title}</h3>

                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {t.facts.map((f, fi) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 + 0.4 + fi * 0.08, duration: 0.5 }}
                      style={{
                        display: 'flex', gap: '.7rem', alignItems: 'flex-start',
                        fontSize: '.92rem', color: '#4b5563', lineHeight: 1.55,
                      }}
                    >
                      <span style={{ color: t.color, flexShrink: 0, marginTop: 2 }}>
                        <ArrowIcon size={14} />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spine column (sits in middle) — actual line is handled by TimelineSpine */}
      <div className="timeline-spine" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '7rem', position: 'relative', zIndex: 3 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: .5, delay: i * .1 + .2, ease: [0.2, 0.7, 0.3, 1.3] }}
          style={{
            width: 18, height: 18, borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
            boxShadow: `0 0 0 5px ${t.color}24, 0 0 24px ${t.color}66, 0 4px 12px rgba(0,0,0,.1)`,
            zIndex: 2,
          }}
        />
      </div>

      {/* Placeholder for grid balance */}
      {!isEven && <div style={{ gridColumn: 1, gridRow: 1 }} />}
      {isEven  && <div />}
    </div>
  )
}

/* ─────────── Chapter intro between hero and timeline ─────────── */
function ChapterIntro() {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '5rem 0 3rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.4, y: 60 }}
        animate={inView ? { opacity: 0.06, scale: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.2, 0.7, 0.3, 1] }}
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: 'clamp(8rem, 20vw, 22rem)',
          fontWeight: 900, lineHeight: 0.85,
          letterSpacing: '-0.06em',
          background: 'linear-gradient(135deg,#e63946,#f77f00,#06d6a0,#9b5de5)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          position: 'absolute', top: 0, left: 0, right: 0,
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        150 YRS
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            display: 'inline-block',
            fontFamily: "'Sora',sans-serif",
            fontSize: '.78rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase', color: '#e63946',
            background: '#fff', padding: '.55rem 1.4rem', borderRadius: 9999,
            boxShadow: '0 4px 18px rgba(230,57,70,.18)',
            marginBottom: '1.2rem',
          }}
        >Chapter 01 · The Journey</motion.div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', maxWidth: 700, margin: '0 auto' }}>
          <SplitText text="One bottle." delay={0} />
          <br />
          <SplitText text="Four eras." delay={0.4} />
          <br />
          <SplitText text="A global icon." delay={0.8} className="grad" />
        </h2>
      </div>
    </div>
  )
}

/* ─────────── HISTORY PAGE ─────────── */
export default function HistoryPage() {
  const timelineRef = useRef(null)
  const { isMobile } = useDevice()

  return (
    <>
      <ScrollProgress />

      {/* ═════════════════════════════════════════ PAGE HERO ════ */}
      <section className="page-hero" style={{
        background: 'linear-gradient(135deg,#fff8f0,#fff3f8,#f0fffe)',
        minHeight: '70vh',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="blob" style={{ width: 380, height: 380, top: '-15%', right: '-5%', background: 'rgba(247,127,0,.2)' }} />
        <div className="blob" style={{ width: 280, height: 280, bottom: '-10%', left: '5%',  background: 'rgba(6,214,160,.2)', animationDelay: '-3s' }} />
        <div className="blob" style={{ width: 200, height: 200, top: '20%', left: '15%', background: 'rgba(155,93,229,.18)', animationDelay: '-5s' }} />

        {/* Decorative floaters */}
        {!isMobile && (
          <>
            <Floater x="10%" y="22%" size={60} speed={0.18} delay={0}>
              <FizzCircle color="#e63946" />
            </Floater>
            <Floater x="85%" y="18%" size={84} speed={0.12} delay={1.3} axis="y">
              <BottleSilhouette color="#9b5de5" size={84} />
            </Floater>
            <Floater x="8%" y="70%" size={70} speed={0.22} delay={2.2}>
              <BottleSilhouette color="#06d6a0" size={70} />
            </Floater>
            <Floater x="90%" y="74%" size={56} speed={0.16} delay={0.9}>
              <FizzCircle color="#f77f00" size={56} />
            </Floater>
            <Floater x="78%" y="48%" size={42} speed={0.14} delay={1.8}>
              <FizzCircle color="#9b5de5" size={42} />
            </Floater>
          </>
        )}

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="label" style={{ justifyContent: 'center' }}>
              From Victorian Innovation to Modern Revival
            </span>
          </motion.div>

          <h1 style={{ fontSize: 'clamp(2.6rem,6vw,5rem)', marginBottom: '1rem' }}>
            <SplitText text="The Global Journey" delay={0.15} />
            <br />
            <SplitText text="of the Goli Soda" delay={0.55} />
            <br />
            <SplitText text="Bottle." delay={1.05} className="grad" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            style={{
              fontSize: '1.05rem', color: '#6b7280',
              maxWidth: 560, margin: '0 auto', lineHeight: 1.7,
            }}
          >
            From a Victorian inventor's lab in England to the streets of India and now to the USA — the Codd-neck bottle has traveled the world, carrying joy in every pop.
          </motion.p>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{
              display: 'inline-flex', gap: '2rem',
              padding: '1rem 2rem', marginTop: '2.2rem',
              borderRadius: 9999,
              background: 'rgba(255,255,255,.6)',
              WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(26,26,46,.06)',
              boxShadow: '0 8px 32px rgba(26,26,46,.08)',
              flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            {[
              { n: 150, suffix: '+ YRS', color: '#9b5de5' },
              { n: 4,   suffix: ' ERAS', color: '#e63946' },
              { n: 4,   suffix: ' CONTINENTS', color: '#f77f00' },
              { n: 1,   suffix: ' BOTTLE', color: '#06d6a0' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: '.3rem',
                fontFamily: "'Sora',sans-serif", fontWeight: 800,
                fontSize: '.9rem', letterSpacing: '-0.01em',
                color: s.color,
              }}>
                <CountUp end={s.n} duration={1400} startFrom={0} />
                <span style={{ opacity: .8 }}>{s.suffix}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <svg viewBox="0 0 1440 60" style={{
          position: 'absolute', bottom: -1, left: 0, width: '100%',
          fill: '#fff', pointerEvents: 'none', zIndex: 1,
        }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ═════════════════════════════════════════ MARQUEE ════ */}
      <MarqueeStrip
        items={['EST. 1872', '150+ YEARS OF FIZZ', '4 CONTINENTS', '1 ICONIC BOTTLE', 'POP THE FIZZ']}
        speed={36}
        color="#1a1a2e"
        textColor="#fff"
        tilt={-1}
        divider="◆"
      />

      {/* ═════════════════════════════════════════ CHAPTER INTRO ════ */}
      <section style={{ background: '#fff' }}>
        <div className="container">
          <ChapterIntro />
        </div>
      </section>

      {/* ═════════════════════════════════════════ TIMELINE ════ */}
      <section ref={timelineRef} style={{
        background: 'linear-gradient(180deg,#fff 0%,#fffdf5 50%,#fff 100%)',
        padding: '3rem 0 5rem', position: 'relative',
      }}>
        <div className="container" style={{ maxWidth: 1100, position: 'relative' }}>

          {/* Spine animation */}
          <TimelineSpine sectionRef={timelineRef} />

          {/* Items */}
          {TIMELINE.map((t, i) => <TimelineItem key={t.year} t={t} i={i} />)}
        </div>
      </section>

      {/* ═════════════════════════════════════════ SECOND MARQUEE ════ */}
      <MarqueeStrip
        items={['BORN FROM BANTA', 'CRAFTED FOR THE BOLD', 'POP THE FIZZ', 'GLOBAL HERITAGE']}
        speed={28}
        color="#e63946"
        textColor="#fff"
        tilt={1.2}
        reverse
        divider="★"
      />

      {/* ═════════════════════════════════════════ QUOTE BANNER ════ */}
      <section style={{
        background: 'linear-gradient(135deg,#e63946,#f77f00,#ff70a6)',
        padding: '6rem 0', textAlign: 'center', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, scale: .9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: '4rem', lineHeight: 1, marginBottom: '1.5rem',
              opacity: .35,
            }}
          >"</motion.div>

          <p style={{
            fontSize: 'clamp(1.4rem,3vw,2rem)',
            fontFamily: "'Sora',sans-serif",
            fontWeight: 700, lineHeight: 1.35, marginBottom: '1.4rem',
            letterSpacing: '-0.02em',
          }}>
            <SplitText text="Crafted with bold desi flavors," delay={0} />
            <br />
            <SplitText text="IndiColas brings a fizzy twist" delay={0.5} />
            <br />
            <SplitText text="to every moment." delay={1} />
          </p>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: .85 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 1.4 }}
            style={{ marginBottom: '2.5rem' }}
          >
            Inspired by generations of joy. Crafted for today.
          </motion.p>
          <Link to="/flavors" className="btn btn-white" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Explore Our Flavors →
          </Link>
        </div>
      </section>

      {/* Mobile + helper styles */}
      <style>{`
        @keyframes floatSoft {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%     { transform: translateY(-18px) rotate(2deg); }
        }
        @media(max-width:768px){
          .timeline-row{grid-template-columns:30px 1fr!important;gap:1rem!important}
          .timeline-row > div:first-child{padding-right:0!important;grid-column:2!important}
          .timeline-row > div:last-child{display:none!important}
          .timeline-spine{grid-column:1!important;grid-row:1!important;padding-top:1.5rem!important}
          .year-watermark{font-size:5rem!important;opacity:.04!important}
        }
      `}</style>
    </>
  )
}
