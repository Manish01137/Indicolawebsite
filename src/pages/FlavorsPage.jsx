import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTilt, useOnScreen, useDevice } from '../hooks/useTilt'
import { useScrollTilt } from '../hooks/useScrollTilt'
import VideoLightbox from '../components/VideoLightbox'
import { PlayIcon, ArrowIcon } from '../components/SocialIcons'

/* ─────────── PREMIUM FLAVORS BANNER — crossfades through all 14 splash images ─────────── */
const BANNER_IMAGES = [
  '/images/flaoverpage/cherrryCola.png',
  '/images/flaoverpage/cocoberry.png',
  '/images/flaoverpage/gingerlime.png',
  '/images/flaoverpage/cottonCanday.png',
  '/images/flaoverpage/berrymagma.png',
  '/images/flaoverpage/pinachicola.png',
  '/images/flaoverpage/AmericanIcecream.png',
  '/images/flaoverpage/fruitbeer.png',
  '/images/flaoverpage/Berrypunch.png',
  '/images/flaoverpage/citrusBlast.png',
  '/images/flaoverpage/strawberry.png',
  '/images/flaoverpage/peachpunch.png',
]

function FlavorsBanner({ isMobile }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    /* Preload the next image so swap is instant */
    const next = (active + 1) % BANNER_IMAGES.length
    const img = new Image()
    img.src = BANNER_IMAGES[next]
  }, [active])
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % BANNER_IMAGES.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      position: 'relative', width: '100%',
      height: isMobile ? '42vh' : '64vh',
      minHeight: isMobile ? 320 : 420,
      overflow: 'hidden',
      background: '#0d0d18',
    }}>
      {/* Image layers crossfading */}
      {BANNER_IMAGES.map((src, i) => (
        <div key={src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: i === active ? 1 : 0,
          transform: i === active ? 'scale(1)' : 'scale(1.08)',
          transition: 'opacity 1.4s ease, transform 6s ease-out',
          willChange: 'opacity, transform',
        }} />
      ))}

      {/* Soft cinematic vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,.25) 0%, transparent 30%, transparent 60%, rgba(0,0,0,.5) 100%)',
      }} />

      {/* Bottom overlay with text */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)',
        color: '#fff',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap',
      }}>
        <div>
          <span style={{
            display: 'inline-block',
            fontFamily: "'Sora',sans-serif",
            fontSize: '.72rem', fontWeight: 700,
            letterSpacing: '.18em', textTransform: 'uppercase',
            color: '#fff',
            background: 'rgba(230,57,70,.92)',
            padding: '.35rem .9rem',
            borderRadius: 9999,
            marginBottom: '.8rem',
            boxShadow: '0 6px 18px rgba(230,57,70,.45)',
          }}>
            12 Bold Flavors
          </span>
          <h2 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: 0,
            color: '#fff',
            textShadow: '0 4px 18px rgba(0,0,0,.5)',
            maxWidth: 700,
            lineHeight: 1.1,
          }}>
            Crafted in motion. Captured in colour.
          </h2>
        </div>

        {/* Indicator dots */}
        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
          {BANNER_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              aria-label={`Show banner ${i+1}`}
              style={{
                width: i === active ? 28 : 8, height: 8, borderRadius: 9999,
                background: i === active ? '#fff' : 'rgba(255,255,255,.45)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width .4s, background .4s',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const ALL_FLAVORS = [
  { name: 'Cherry Cola',          img: '/images/flaoverpage/cherrryCola.png',     color: '#e63946', bg: '#ffe4e6', tag: 'Classic',  video: '/videos/cherrycola.mp4',   desc: 'Classic cola meets cherry — bold & unforgettable' },
  { name: 'Coco Berry',           img: '/images/flaoverpage/cocoberry.png',       color: '#ff70a6', bg: '#fce7f3', tag: 'Exotic',   video: '/videos/cocaberry.mp4',    desc: 'Coconut meets berry — pure tropical magic' },
  { name: 'Ginger Lime',          img: '/images/flaoverpage/gingerlime.png',      color: '#06d6a0', bg: '#d1fae5', tag: 'Fresh',    video: '/videos/gingerlime.mp4',   desc: 'Bold zing & cool freshness — premium & clean' },
  { name: 'Cotton Candy',         img: '/images/flaoverpage/cottonCanday.png',    color: '#9b5de5', bg: '#f3e8ff', tag: 'Sweet',    video: '/videos/cottoncanday.mp4', desc: 'Sweet carnival in every sip — playful & fun' },
  { name: 'Berry Magma',          img: '/images/flaoverpage/berrymagma.png',      color: '#7c3aed', bg: '#ede9fe', tag: 'Fan Favorite', desc: 'Wild berry explosion in every bottle' },
  { name: 'Pinachi',              img: '/images/flaoverpage/pinachicola.png',     color: '#f77f00', bg: '#fff3e0', tag: 'Tropical', desc: 'Tropical pineapple — fiery & sweet' },
  { name: 'Americano Ice Cream',  img: '/images/flaoverpage/AmericanIcecream.png',color: '#ffd166', bg: '#fffde7', tag: 'Sweet',    desc: 'Sweet cream soda dream' },
  { name: 'Fruitbeer With Malt',  img: '/images/flaoverpage/fruitbeer.png',       color: '#e9c46a', bg: '#fdf6e3', tag: 'Unique',   desc: 'Fruity malt euphoria' },
  { name: 'Berry Punch',          img: '/images/flaoverpage/Berrypunch.png',      color: '#06d6a0', bg: '#d1fae5', tag: 'Refreshing', desc: 'Wild berries with a fizzy punch' },
  { name: 'Citrus Blast',         img: '/images/flaoverpage/citrusBlast.png',     color: '#f4a261', bg: '#fff3e0', tag: 'Zesty',    desc: 'Zesty citrus explosion' },
  { name: 'Strawberry Margarita', img: '/images/flaoverpage/strawberry.png',      color: '#ff4d6d', bg: '#ffe4e6', tag: 'Bold',     desc: 'Fiesta in every bubble' },
  { name: 'Peach Punch',          img: '/images/flaoverpage/peachpunch.png',      color: '#ffb347', bg: '#fff8e1', tag: 'Summer',   desc: 'Peachy summer punch' },
]

const TAGS = ['All', 'Fan Favorite', 'Classic', 'Tropical', 'Sweet', 'Refreshing', 'Zesty', 'Bold', 'Fresh', 'Exotic', 'Unique', 'Summer']

/* ─────────── Card with video preview ─────────── */
function VideoFlavorCard({ f, onWatch, isMobile, index }) {
  const tiltRef = useTilt({ intensity: 16, scale: 1.04 })
  const scrollRef = useScrollTilt({ amount: 5, axis: 'x', invert: index % 2 === 0 })
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [screenRef, onScreen] = useOnScreen({ threshold: 0.3 })

  /* On mobile: autoplay when in view. On desktop: play on hover. */
  const handleEnter = () => {
    setHovered(true)
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }
  const handleLeave = () => {
    setHovered(false)
    if (videoRef.current) videoRef.current.pause()
  }

  return (
    <div ref={screenRef} style={{ perspective: 1100 }}>
      <div ref={scrollRef}>
      <div
        ref={isMobile ? null : tiltRef}
        onMouseEnter={isMobile ? null : handleEnter}
        onMouseLeave={isMobile ? null : handleLeave}
        style={{
          background:'#fff', borderRadius:26, overflow:'hidden',
          boxShadow: hovered ? `0 28px 60px ${f.color}38, 0 4px 16px ${f.color}1f` : '0 8px 28px rgba(26,26,46,.09), 0 1px 4px rgba(26,26,46,.04)',
          border: `1px solid ${f.color}1a`,
          transition: 'box-shadow .4s, transform .5s',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Media area */}
        <div style={{
          height: 270, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(160deg, ${f.bg}, #fff)`,
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', width: '70%', height: '70%',
            left: '15%', top: '15%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${f.color}30, transparent)`,
            filter: 'blur(20px)',
          }} />

          {/* Video layer (hidden until hover on desktop, or always in view on mobile) */}
          <video
            ref={videoRef}
            src={f.video}
            poster={f.img}
            muted loop playsInline preload="metadata"
            autoPlay={isMobile && onScreen}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: hovered || isMobile ? 1 : 0,
              transition: 'opacity .5s ease',
              zIndex: 1,
            }}
          />

          {/* Static image fallback */}
          <img src={f.img} alt={f.name} loading="lazy"
            style={{
              position: 'absolute', inset: 0, margin: 'auto',
              maxHeight: '85%', maxWidth: '70%', objectFit: 'contain',
              filter: `drop-shadow(0 16px 28px ${f.color}40)`,
              opacity: hovered || isMobile ? 0 : 1,
              transition: 'opacity .5s ease',
              zIndex: 0,
            }}
          />

          {/* Video play badge */}
          <button
            onClick={(e) => { e.stopPropagation(); onWatch(f) }}
            style={{
              position: 'absolute', top: 14, right: 14, zIndex: 5,
              width: 46, height: 46, borderRadius: '50%',
              background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`, color: '#fff',
              border: 'none', cursor: 'pointer',
              boxShadow: `0 8px 22px ${f.color}80, inset 0 1px 0 rgba(255,255,255,.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}aa, inset 0 1px 0 rgba(255,255,255,.3)` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 22px ${f.color}80, inset 0 1px 0 rgba(255,255,255,.3)` }}
            aria-label={`Watch ${f.name}`}
          ><PlayIcon size={16} /></button>
        </div>

        {/* Info */}
        <div style={{ padding: '1.25rem 1.5rem 1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
            <span className="tag" style={{ background: f.color, color: '#fff', display:'inline-flex', alignItems:'center', gap:'.35rem' }}>
              <PlayIcon size={10} /> Has Video
            </span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
          </div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem' }}>
            {f.name}
          </h3>
          <p style={{ fontSize: '.85rem', color: '#6b7280', marginBottom: '.85rem', lineHeight: 1.55 }}>{f.desc}</p>
          <div style={{ display: 'flex', gap: '.85rem', alignItems: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); onWatch(f) }}
              style={{
                fontSize: '.85rem', fontWeight: 700, color: f.color, cursor: 'pointer',
                fontFamily: "'Sora',sans-serif", background: 'none', border: 'none', padding: 0,
                display:'inline-flex', alignItems:'center', gap:'.35rem',
              }}
            ><PlayIcon size={11} /> Watch Video</button>
            <Link to="/contact" style={{
              fontSize: '.85rem', fontWeight: 700, color: '#1a1a2e',
              fontFamily: "'Sora',sans-serif",
              display:'inline-flex', alignItems:'center', gap:'.3rem',
            }}>· Order <ArrowIcon size={12} /></Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

/* ─────────── Card without video (static) ─────────── */
function StaticFlavorCard({ f, isMobile, index = 0 }) {
  const tiltRef = useTilt({ intensity: 14, scale: 1.03 })
  const scrollRef = useScrollTilt({ amount: 5, axis: 'x', invert: index % 2 === 0 })
  return (
    <div style={{ perspective: 1100, height: '100%' }}>
      <div ref={scrollRef} style={{ height: '100%' }}>
      <div
        ref={isMobile ? null : tiltRef}
        style={{
          background:'#fff', borderRadius:26, overflow:'hidden',
          boxShadow: `0 12px 32px ${f.color}1a, 0 2px 8px rgba(26,26,46,.05)`,
          border: `1px solid ${f.color}1a`,
          transition: 'box-shadow .4s, transform .5s',
          transformStyle: 'preserve-3d',
          height: '100%',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Uniform image area — all cards exactly the same height */}
        <div style={{
          background: `linear-gradient(160deg,${f.bg},#fff)`,
          height: 320, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '70%', height: '70%',
            left: '15%', top: '15%',
            borderRadius: '50%',
            background: `radial-gradient(circle,${f.color}28,transparent)`, filter: 'blur(22px)',
          }} />
          <img
            src={f.img} alt={f.name} loading="lazy"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block', zIndex: 1,
            }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem 1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
            <span className="tag" style={{ background: f.color, color: '#fff' }}>{f.tag}</span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
          </div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem' }}>{f.name}</h3>
          <p style={{ fontSize: '.85rem', color: '#6b7280', marginBottom: '.85rem', lineHeight: 1.55, flex: 1 }}>{f.desc}</p>
          <Link to="/contact"
            style={{ fontSize: '.85rem', fontWeight: 700, color: f.color, fontFamily: "'Sora',sans-serif", display:'inline-flex', alignItems:'center', gap:'.35rem', marginTop: 'auto' }}
          >
            Contact Us <ArrowIcon size={13} />
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}

export default function FlavorsPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const { isMobile } = useDevice()

  const filtered =
    active === 'All' ? ALL_FLAVORS : ALL_FLAVORS.filter(f => f.tag === active)

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="blob" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(155,93,229,.18)' }} />
        <div className="blob" style={{ width: 280, height: 280, bottom: '-10%', left: '5%', background: 'rgba(230,57,70,.15)', animationDelay: '-3s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ justifyContent: 'center' }}>12 Bold Flavors</span>
          <h1>Find Your <span className="grad">Perfect Fizz</span></h1>
          <p>Explore our premium range of bold, globally-inspired flavors — each crafted around the iconic Codd-neck bottle.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', fill: '#fffdf5', pointerEvents: 'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Filter + grid */}
      <section style={{ background: '#fffdf5', padding: '4rem 0 6rem' }}>
        <div className="container">

          {/* Filter chips */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '.5rem',
            justifyContent: 'center', marginBottom: '3rem',
          }}>
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActive(tag)}
                style={{
                  padding: '.5rem 1.1rem', borderRadius: 9999,
                  fontFamily: "'Sora',sans-serif", fontSize: '.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all .2s', border: 'none',
                  background: active === tag ? '#e63946' : 'rgba(26,26,46,.06)',
                  color: active === tag ? '#fff' : '#6b7280',
                  boxShadow: active === tag ? '0 4px 16px rgba(230,57,70,.35)' : 'none',
                  transform: active === tag ? 'translateY(-1px)' : 'none',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((f, i) => (
              <motion.div key={f.name}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: .55, delay: (i % 4) * .07 }}
              >
                <StaticFlavorCard f={f} isMobile={isMobile} index={i} />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .7 }}
            style={{
              textAlign: 'center', marginTop: '4rem',
              padding: '3rem', borderRadius: 24,
              background: 'linear-gradient(135deg, #fff5e6, #fff0f5)',
              border: '1px solid rgba(230,57,70,.1)',
            }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.6rem', fontWeight: 700, marginBottom: '.75rem' }}>
              Ready to Order?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.75rem', fontSize: '1rem' }}>
              Contact us to find IndiColas near you or inquire about wholesale distribution.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Get In Touch
            </Link>
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
    </>
  )
}
