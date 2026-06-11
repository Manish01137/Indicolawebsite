import { useEffect, useRef } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

import { getFlavorBySlug, getRelated, FLAVORS } from '../data/flavors'
import { useTilt, useDevice } from '../hooks/useTilt'
import { useScrollTilt } from '../hooks/useScrollTilt'
import { ArrowIcon, MapPinIcon, StarIcon } from '../components/SocialIcons'
import MagneticButton from '../components/MagneticButton'
import SplitText from '../components/SplitText'
import ScrollProgress from '../components/ScrollProgress'
import { playClick } from '../hooks/useAudio'

/* ─────────── HERO ─────────── */
function FlavorHero({ f }) {
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 14, scale: 1.04 })
  const scrollRef = useScrollTilt({ amount: 4, axis: 'x' })

  return (
    <section style={{
      minHeight: '92vh', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      paddingTop: 'calc(var(--nav-h) + 2rem)',
      background: `linear-gradient(140deg, #fff8f0 0%, ${f.light} 55%, #fff5f8 100%)`,
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', width: 620, height: 620,
        top: '-22%', right: '-12%', borderRadius: '50%',
        background: `radial-gradient(circle, ${f.glow}, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 380, height: 380,
        bottom: '-15%', left: '-10%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,93,229,.18), transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none',
      }} />

      {/* Floating decorative dots */}
      {!isMobile && [0,1,2,3,4].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -22, 0], rotate: [0, 16, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          style={{
            position: 'absolute',
            width: 14 + i*4, height: 14 + i*4, borderRadius: '50%',
            background: f.color,
            top: ['12%','18%','62%','38%','78%'][i],
            left: ['8%','85%','12%','82%','45%'][i],
            opacity: 0.18, pointerEvents: 'none',
          }}
        />
      ))}

      <div className="container detail-hero-grid" style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '3rem',
        alignItems: 'center', width: '100%',
      }}>
        {/* Left: text */}
        <div className="detail-hero-text">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '1.4rem' }}
          >
            <Link to="/flavors" onClick={() => playClick()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.45rem',
                fontFamily: "'Sora',sans-serif",
                fontSize: '.75rem', fontWeight: 700,
                letterSpacing: '.16em', textTransform: 'uppercase',
                color: f.color,
                padding: '.45rem .9rem', borderRadius: 9999,
                background: '#fff',
                boxShadow: `0 6px 20px ${f.color}22`,
                transition: 'transform .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}40` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${f.color}22` }}
            >
              <ArrowIcon size={12} direction="left" />
              All Flavors
            </Link>
          </motion.div>

          {/* Eyebrow with tag */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              padding: '.4rem 1rem', borderRadius: 9999,
              background: f.color, color: '#fff',
              fontFamily: "'Sora',sans-serif",
              fontSize: '.7rem', fontWeight: 800,
              letterSpacing: '.18em', textTransform: 'uppercase',
              boxShadow: `0 10px 26px ${f.color}55`,
              marginBottom: '1.2rem',
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#fff',
              animation: 'pulse 1.6s ease-in-out infinite',
            }} />
            IndiColas · {f.tag}
          </motion.div>

          {/* Name */}
          <h1 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
            fontWeight: 800, lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: 0, marginBottom: '1.2rem',
            color: '#1a1a2e',
          }}>
            <SplitText text={f.name} delay={0.15} />
          </h1>

          {/* Premium accent stripe — animates in below the name */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.2, 0.7, 0.3, 1] }}
            style={{
              width: 96, height: 5,
              background: `linear-gradient(90deg, ${f.color}, #f77f00)`,
              borderRadius: 9999,
              transformOrigin: 'left center',
              marginBottom: '1.6rem',
              boxShadow: `0 4px 14px ${f.color}55`,
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
              color: '#4a4a5e', fontWeight: 500,
              lineHeight: 1.45, maxWidth: 500,
              marginBottom: '2.2rem',
            }}
          >
            {f.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            style={{ display: 'flex', gap: '.85rem', flexWrap: 'wrap', marginBottom: '2.8rem' }}
          >
            <Link to="/outlets" style={{ textDecoration: 'none' }} onClick={() => playClick()}>
              <MagneticButton className="btn btn-primary" style={{ fontSize: '.98rem', padding: '1rem 2rem' }}>
                <MapPinIcon size={15} /> Find a Store
              </MagneticButton>
            </Link>
            <Link to="/contact" onClick={() => playClick()}
              className="btn btn-outline" style={{ fontSize: '.98rem', padding: '1rem 2rem' }}>
              Bulk Inquiry
            </Link>
          </motion.div>

          {/* Mini rating row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.7rem',
              padding: '.75rem 1.1rem', borderRadius: 9999,
              background: 'rgba(255,255,255,.86)',
              WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
              backdropFilter: 'blur(14px) saturate(1.4)',
              boxShadow: '0 10px 28px rgba(26,26,46,.08)',
              border: '1px solid rgba(255,255,255,.6)',
            }}
          >
            <div style={{ display: 'flex', gap: 2, color: f.color }}>
              {[0,1,2,3,4].map(i => <StarIcon key={i} size={13} />)}
            </div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '.78rem', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.01em' }}>
              Premium Quality · Crafted in USA
            </div>
          </motion.div>
        </div>

        {/* Right: product image with tilt + glow */}
        <div ref={scrollRef} style={{ perspective: 1300, position: 'relative' }}>
          {/* Glow halo */}
          <div style={{
            position: 'absolute', inset: '5%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${f.glow}, transparent 65%)`,
            filter: 'blur(45px)', pointerEvents: 'none',
          }} />

          {/* Floating tilt image */}
          <motion.div
            ref={isMobile ? null : tiltRef}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', transformStyle: 'preserve-3d' }}
          >
            <img src={f.img} alt={f.name}
              style={{
                width: '100%', height: 'auto', display: 'block',
                borderRadius: 24,
                filter: `drop-shadow(0 28px 56px ${f.color}55) drop-shadow(0 8px 22px rgba(26,26,46,.18))`,
              }}
            />
          </motion.div>

          {/* Single refined Best Seller badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6, ease: [0.2, 0.7, 0.3, 1.05] }}
            style={{
              position: 'absolute', top: '6%', left: '-3%',
              padding: '.55rem .95rem',
              borderRadius: 9999,
              background: 'rgba(255,255,255,.95)',
              WebkitBackdropFilter: 'blur(14px)',
              backdropFilter: 'blur(14px)',
              color: '#1a1a2e',
              fontFamily: "'Sora',sans-serif",
              fontWeight: 700,
              fontSize: '.72rem',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              boxShadow: `0 16px 40px ${f.color}33, 0 2px 8px rgba(26,26,46,.08)`,
              border: `1px solid ${f.color}33`,
              display: 'inline-flex', alignItems: 'center', gap: '.45rem',
              zIndex: 3,
            }}
          >
            <span style={{ color: f.color, fontSize: '.95rem', lineHeight: 1 }}>★</span>
            Best Seller
          </motion.div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media(max-width: 900px){
          .detail-hero-grid{ grid-template-columns: 1fr !important; gap: 2rem !important; padding-top: 1rem; }
          .detail-hero-text{ text-align: center; }
          .detail-hero-text > * { margin-left: auto; margin-right: auto; }
          .detail-hero-text p, .detail-hero-text > div > p { margin-left: auto; margin-right: auto; }
        }
      `}</style>

      {/* Wave divider */}
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 70, fill: '#fff', pointerEvents: 'none', zIndex: 3 }}>
        <path d="M0,35 C480,75 960,5 1440,35 L1440,70 L0,70 Z" />
      </svg>
    </section>
  )
}

/* ─────────── STORY ─────────── */
function StorySection({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section ref={ref} style={{ background: '#fff', padding: 'clamp(4rem,7vw,6rem) 0' }}>
      <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
        <motion.span className="label"
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ justifyContent: 'center', color: f.color }}
        >
          The Story
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            marginBottom: '1.4rem',
            letterSpacing: '-0.03em',
          }}
        >
          What Makes <span style={{ color: f.color }}>{f.name}</span> Different
        </motion.h2>

        {f.story.map((para, i) => (
          <motion.p key={i}
            initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 + i * 0.15 }}
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.12rem)',
              color: '#4b5563', lineHeight: 1.8,
              marginBottom: i === f.story.length - 1 ? 0 : '1.2rem',
              maxWidth: 680, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

/* ─────────── TASTING NOTES ─────────── */
function TastingNotes({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} style={{
      padding: 'clamp(4rem,7vw,6rem) 0',
      background: `linear-gradient(180deg, #fff 0%, ${f.light} 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.span className="label"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ justifyContent: 'center', color: f.color }}
          >
            Tasting Notes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            The <span style={{ color: f.color }}>Flavor Profile</span>
          </motion.h2>
        </div>

        <div className="tasting-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.4rem',
          maxWidth: 1000, margin: '0 auto',
        }}>
          {f.tastingNotes.map((n, i) => (
            <motion.div key={n.label}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              whileHover={{ y: -6 }}
              style={{
                background: '#fff', borderRadius: 22,
                padding: '1.8rem 1.6rem',
                border: `1px solid ${f.color}22`,
                boxShadow: `0 14px 36px ${f.color}16`,
                position: 'relative', overflow: 'hidden',
                transition: 'transform .35s, box-shadow .35s',
              }}
            >
              {/* Big number watermark */}
              <span style={{
                position: 'absolute', top: -10, right: -10,
                fontFamily: "'Sora',sans-serif",
                fontSize: '7rem', fontWeight: 900,
                color: f.color, opacity: 0.07,
                lineHeight: 1, pointerEvents: 'none',
              }}>
                0{i + 1}
              </span>

              {/* Color chip */}
              <div style={{
                width: 44, height: 6, borderRadius: 9999,
                background: `linear-gradient(90deg, ${f.color}, ${f.color}66)`,
                marginBottom: '1rem',
              }} />

              <div style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: '.72rem', fontWeight: 800,
                letterSpacing: '.18em', textTransform: 'uppercase',
                color: f.color, marginBottom: '.4rem',
              }}>
                {n.label} Note
              </div>
              <div style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: '1.1rem', fontWeight: 700,
                color: '#1a1a2e', lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}>
                {n.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 768px){ .tasting-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ─────────── FEATURES ─────────── */
function FeaturesSection({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} style={{ background: '#fff', padding: 'clamp(4rem,7vw,6rem) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="label" style={{ justifyContent: 'center', color: f.color }}>
            Why You'll Love It
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em' }}>
            Crafted With <span style={{ color: f.color }}>Intention</span>
          </h2>
        </div>

        <div className="feature-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem',
          maxWidth: 1100, margin: '0 auto',
        }}>
          {f.features.map((feature, i) => (
            <motion.div key={feature}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -5 }}
              style={{
                background: `linear-gradient(160deg, ${f.bg}, #fff)`,
                borderRadius: 18, padding: '1.6rem 1.3rem',
                border: `1px solid ${f.color}1f`,
                boxShadow: `0 10px 28px ${f.color}14`,
                position: 'relative',
                transition: 'transform .3s, box-shadow .3s',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '.9rem',
                marginBottom: '.9rem',
                boxShadow: `0 6px 16px ${f.color}55`,
              }}>0{i + 1}</div>
              <p style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: '.95rem', fontWeight: 600,
                color: '#1a1a2e', lineHeight: 1.45,
              }}>
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 900px){ .feature-grid{ grid-template-columns: repeat(2, 1fr) !important; } }
        @media(max-width: 500px){ .feature-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ─────────── PAIRINGS ─────────── */
function PairingsSection({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} style={{
      padding: 'clamp(4rem,7vw,6rem) 0',
      background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      {/* Bubbles */}
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{
          position: 'absolute',
          width: 30 + Math.random() * 80, height: 30 + Math.random() * 80,
          borderRadius: '50%', background: 'rgba(255,255,255,.06)',
          top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%`,
          pointerEvents: 'none',
        }} />
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 850 }}>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'Sora',sans-serif", fontSize: '.7rem',
            letterSpacing: '.22em', textTransform: 'uppercase',
            fontWeight: 700, opacity: 0.85, marginBottom: '1rem',
          }}
        >
          Pairs Perfectly With
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            marginBottom: '2.5rem',
            letterSpacing: '-0.03em', color: '#fff',
          }}
        >
          When Should You Open One?
        </motion.h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.7rem' }}>
          {f.pairings.map((p, i) => (
            <motion.div key={p}
              initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
              whileHover={{ y: -4, scale: 1.04 }}
              style={{
                padding: '.85rem 1.4rem', borderRadius: 9999,
                background: 'rgba(255,255,255,.18)',
                border: '1px solid rgba(255,255,255,.4)',
                WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)',
                fontFamily: "'Sora',sans-serif",
                fontSize: '.95rem', fontWeight: 700,
                color: '#fff', letterSpacing: '.01em',
                boxShadow: '0 8px 22px rgba(0,0,0,.12)',
                transition: 'transform .25s, background .25s',
              }}
            >
              {p}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── NUTRITION ─────────── */
function NutritionSection({ f }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  if (!f.nutrient) return null
  return (
    <section ref={ref} style={{
      padding: 'clamp(4rem,7vw,6rem) 0',
      background: '#fffdf5',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Soft accent blobs */}
      <div style={{
        position: 'absolute', width: 380, height: 380, borderRadius: '50%',
        background: `radial-gradient(circle, ${f.color}1a, transparent 70%)`,
        top: '-10%', right: '-8%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, ${f.color}14, transparent 70%)`,
        bottom: '-10%', left: '-6%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 720 }}>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="label" style={{ justifyContent: 'center', color: f.color, marginBottom: '1rem' }}
        >
          Nutrition Facts
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            marginBottom: '.8rem',
            letterSpacing: '-0.03em', color: '#1a1a2e',
          }}
        >
          What's <span style={{ color: f.color }}>Inside</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}
        >
          Full ingredient panel and nutrition information — exactly what you're sipping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: 'clamp(1rem, 2.5vw, 1.8rem)',
            border: `1px solid ${f.color}1f`,
            boxShadow: `0 24px 60px ${f.color}1a, 0 4px 14px rgba(26,26,46,.06)`,
            display: 'inline-block', maxWidth: '100%',
          }}
        >
          <img
            src={f.nutrient}
            alt={`${f.name} nutrition facts`}
            loading="lazy"
            style={{
              display: 'block',
              maxWidth: '100%', width: 'auto', height: 'auto',
              maxHeight: 360,
              borderRadius: 12,
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── RELATED ─────────── */
function RelatedFlavors({ f }) {
  const related = getRelated(f.related).slice(0, 4)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ background: '#fffdf5', padding: 'clamp(4rem,7vw,6rem) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="label" style={{ justifyContent: 'center', color: f.color }}>
            You Might Also Love
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em' }}>
            More <span style={{ color: f.color }}>Bold Flavors</span>
          </h2>
        </div>

        <div className="related-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.4rem',
        }}>
          {related.map((r, i) => (
            <motion.div key={r.slug}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08 }}
            >
              <Link to={`/flavor/${r.slug}`} onClick={() => playClick()} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ y: -8 }}
                  style={{
                    background: '#fff', borderRadius: 22, overflow: 'hidden',
                    border: `1px solid ${r.color}1f`,
                    boxShadow: `0 12px 30px ${r.color}1a`,
                    transition: 'box-shadow .35s',
                  }}
                >
                  {(() => {
                    const isPhoto = /\.(jpe?g|webp)$/i.test(r.img)
                    return (
                      <div style={{
                        height: 240, position: 'relative', overflow: 'hidden',
                        background: `linear-gradient(160deg, ${r.bg}, #fff)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: isPhoto ? 0 : '1rem',
                      }}>
                        {!isPhoto && (
                          <div style={{
                            position: 'absolute', width: 160, height: 160, borderRadius: '50%',
                            background: `radial-gradient(circle, ${r.color}33, transparent 70%)`,
                            filter: 'blur(28px)', pointerEvents: 'none',
                          }} />
                        )}
                        <img src={r.img} alt={r.name}
                          style={isPhoto ? {
                            width: '100%', height: '100%', objectFit: 'cover',
                          } : {
                            position: 'relative', zIndex: 1,
                            maxWidth: '100%', maxHeight: '100%',
                            width: 'auto', height: 'auto',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 14px 22px ${r.color}40)`,
                          }} loading="lazy"
                        />
                      </div>
                    )
                  })()}
                  <div style={{ padding: '1.1rem 1.3rem 1.3rem' }}>
                    <span className="tag" style={{ background: r.color, color: '#fff', marginBottom: '.5rem', display: 'inline-block' }}>
                      {r.tag}
                    </span>
                    <h3 style={{
                      fontFamily: "'Sora',sans-serif", fontSize: '1.05rem', fontWeight: 700,
                      marginBottom: '.45rem', color: '#1a1a2e',
                    }}>{r.name}</h3>
                    <div style={{
                      fontSize: '.82rem', fontWeight: 700, color: r.color,
                      fontFamily: "'Sora',sans-serif",
                      display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                    }}>
                      Discover <ArrowIcon size={12} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 900px){ .related-grid{ grid-template-columns: repeat(2, 1fr) !important; } }
        @media(max-width: 500px){ .related-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

/* ─────────── BOTTOM CTA ─────────── */
function BottomCTA({ f }) {
  return (
    <section style={{
      padding: 'clamp(4rem,7vw,6rem) 0',
      background: '#fff', textAlign: 'center', position: 'relative',
    }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            letterSpacing: '-0.03em', marginBottom: '1rem',
          }}
        >
          Ready to <span style={{ color: f.color }}>Pop the Fizz?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.75,
            marginBottom: '2rem', maxWidth: 540, margin: '0 auto 2rem',
          }}
        >
          {f.name} is available across our growing network of retail partners — or get in touch for bulk and wholesale enquiries.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '.85rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/outlets" onClick={() => playClick()} style={{ textDecoration: 'none' }}>
            <MagneticButton className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.4rem' }}>
              <MapPinIcon size={15} /> Find a Store
            </MagneticButton>
          </Link>
          <Link to="/contact" className="btn btn-outline" onClick={() => playClick()}
            style={{ fontSize: '1rem', padding: '1rem 2.4rem' }}>
            Contact Us
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <p style={{
          marginTop: '3rem',
          fontSize: '.75rem', color: '#9ca3af',
          letterSpacing: '.06em',
          fontStyle: 'italic',
        }}>
          Contains no fruit. Product image for illustration purposes only.
        </p>
      </div>
    </section>
  )
}

/* ─────────── PAGE ─────────── */
export default function FlavorDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const flavor = getFlavorBySlug(slug)

  /* Scroll to top whenever slug changes */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [slug])

  /* Unknown slug → bounce back to /flavors */
  if (!flavor) return <Navigate to="/flavors" replace />

  /* Next/prev flavor */
  const idx = FLAVORS.findIndex(f => f.slug === slug)
  const next = FLAVORS[(idx + 1) % FLAVORS.length]
  const prev = FLAVORS[(idx - 1 + FLAVORS.length) % FLAVORS.length]

  return (
    <>
      <ScrollProgress />

      <FlavorHero      f={flavor} />
      <StorySection    f={flavor} />
      <TastingNotes    f={flavor} />
      <FeaturesSection f={flavor} />
      <PairingsSection f={flavor} />
      <NutritionSection f={flavor} />
      <RelatedFlavors  f={flavor} />
      <BottomCTA       f={flavor} />

      {/* Prev / Next nav */}
      <section style={{
        background: '#fffdf5',
        borderTop: '1px solid rgba(26,26,46,.06)',
        padding: '2rem 0',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
        }}>
          <Link to={`/flavor/${prev.slug}`} onClick={() => playClick()}
            style={{
              display: 'flex', alignItems: 'center', gap: '.75rem',
              padding: '.85rem 1.2rem', borderRadius: 14,
              background: '#fff',
              boxShadow: `0 6px 18px ${prev.color}1a`,
              border: `1px solid ${prev.color}1f`,
              transition: 'transform .25s, box-shadow .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-4px)'; e.currentTarget.style.boxShadow = `0 10px 24px ${prev.color}30` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = `0 6px 18px ${prev.color}1a` }}
          >
            <ArrowIcon size={14} direction="left" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Previous</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: prev.color, fontSize: '.92rem' }}>{prev.name}</div>
            </div>
          </Link>

          <Link to={`/flavor/${next.slug}`} onClick={() => playClick()}
            style={{
              display: 'flex', alignItems: 'center', gap: '.75rem',
              padding: '.85rem 1.2rem', borderRadius: 14,
              background: '#fff',
              boxShadow: `0 6px 18px ${next.color}1a`,
              border: `1px solid ${next.color}1f`,
              transition: 'transform .25s, box-shadow .25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 10px 24px ${next.color}30` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = `0 6px 18px ${next.color}1a` }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Next</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: next.color, fontSize: '.92rem' }}>{next.name}</div>
            </div>
            <ArrowIcon size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
