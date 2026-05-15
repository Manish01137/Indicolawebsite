import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTilt, useOnScreen, useDevice } from '../hooks/useTilt'
import VideoLightbox from '../components/VideoLightbox'

const ALL_FLAVORS = [
  { name: 'Cherry Cola',          img: '/images/cherry-cola.png',          color: '#e63946', bg: '#ffe4e6', tag: 'Classic',  video: '/videos/cherrycola.mp4',   desc: 'Classic cola meets cherry — bold & unforgettable' },
  { name: 'Coco Berry',           img: '/images/coco-berry.png',           color: '#ff70a6', bg: '#fce7f3', tag: 'Exotic',   video: '/videos/cocaberry.mp4',    desc: 'Coconut meets berry — pure tropical magic' },
  { name: 'Ginger Lime',          img: '/images/ginger-lime.png',          color: '#06d6a0', bg: '#d1fae5', tag: 'Fresh',    video: '/videos/gingerlime.mp4',   desc: 'Bold zing & cool freshness — premium & clean' },
  { name: 'Cotton Candy',         img: '/images/cotton-candy.png',         color: '#9b5de5', bg: '#f3e8ff', tag: 'Sweet',    video: '/videos/cottoncanday.mp4', desc: 'Sweet carnival in every sip — playful & fun' },
  { name: 'Berry Magma',          img: '/images/berry-magma.png',          color: '#7c3aed', bg: '#ede9fe', tag: 'Fan Favorite', desc: 'Wild berry explosion in every bottle' },
  { name: 'Pinachi',              img: '/images/pinachi.png',              color: '#f77f00', bg: '#fff3e0', tag: 'Tropical', desc: 'Tropical pineapple — fiery & sweet' },
  { name: 'Americano Ice Cream',  img: '/images/americano-icecream.png',   color: '#ffd166', bg: '#fffde7', tag: 'Sweet',    desc: 'Sweet cream soda dream' },
  { name: 'Fruitbeer With Malt',  img: '/images/peach-punch.png',          color: '#e9c46a', bg: '#fdf6e3', tag: 'Unique',   desc: 'Fruity malt euphoria' },
  { name: 'Green Twister',        img: '/images/green-twister.png',        color: '#06d6a0', bg: '#d1fae5', tag: 'Refreshing', desc: 'Cool green rush' },
  { name: 'Citrus Blast',         img: '/images/citrus-blast.png',         color: '#f4a261', bg: '#fff3e0', tag: 'Zesty',    desc: 'Zesty citrus explosion' },
  { name: 'Strawberry Margarita', img: '/images/strawberry.png',           color: '#ff4d6d', bg: '#ffe4e6', tag: 'Bold',     desc: 'Fiesta in every bubble' },
  { name: 'Peach Punch',          img: '/images/peach-punch.png',          color: '#ffb347', bg: '#fff8e1', tag: 'Summer',   desc: 'Peachy summer punch' },
]

const TAGS = ['All', 'With Video', 'Fan Favorite', 'Classic', 'Tropical', 'Sweet', 'Refreshing', 'Zesty', 'Bold', 'Fresh', 'Exotic', 'Unique', 'Summer']

/* ─────────── Card with video preview ─────────── */
function VideoFlavorCard({ f, onWatch, isMobile }) {
  const tiltRef = useTilt({ intensity: 16, scale: 1.04 })
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
      <div
        ref={isMobile ? null : tiltRef}
        onMouseEnter={isMobile ? null : handleEnter}
        onMouseLeave={isMobile ? null : handleLeave}
        style={{
          background:'#fff', borderRadius:24, overflow:'hidden',
          boxShadow: hovered ? `0 28px 60px ${f.color}38` : '0 4px 24px rgba(26,26,46,.07)',
          transition: 'box-shadow .4s, transform .5s',
          cursor: 'pointer',
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
              width: 44, height: 44, borderRadius: '50%',
              background: f.color, color: '#fff',
              border: 'none', cursor: 'pointer',
              boxShadow: `0 6px 20px ${f.color}66`,
              fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = `0 8px 28px ${f.color}88` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 6px 20px ${f.color}66` }}
            aria-label={`Watch ${f.name}`}
          >▶</button>
        </div>

        {/* Info */}
        <div style={{ padding: '1.25rem 1.5rem 1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
            <span className="tag" style={{ background: f.color, color: '#fff' }}>▶ Has Video</span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
          </div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem' }}>
            {f.name}
          </h3>
          <p style={{ fontSize: '.85rem', color: '#6b7280', marginBottom: '.85rem', lineHeight: 1.55 }}>{f.desc}</p>
          <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); onWatch(f) }}
              style={{
                fontSize: '.85rem', fontWeight: 700, color: f.color, cursor: 'pointer',
                fontFamily: "'Sora',sans-serif", background: 'none', border: 'none', padding: 0,
              }}
            >▶ Watch Video</button>
            <Link to="/contact" style={{
              fontSize: '.85rem', fontWeight: 700, color: '#1a1a2e',
              fontFamily: "'Sora',sans-serif",
            }}>· Order →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Card without video (static) ─────────── */
function StaticFlavorCard({ f, isMobile }) {
  const tiltRef = useTilt({ intensity: 14, scale: 1.03 })
  return (
    <div style={{ perspective: 1100 }}>
      <div
        ref={isMobile ? null : tiltRef}
        style={{
          background:'#fff', borderRadius:24, overflow:'hidden',
          boxShadow:'0 4px 24px rgba(26,26,46,.07)',
          transition: 'box-shadow .4s, transform .5s',
        }}
      >
        <div style={{
          background: `linear-gradient(160deg,${f.bg},white)`,
          padding: '2rem 2rem 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 250, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '60%', height: '60%', borderRadius: '50%',
            background: `radial-gradient(circle,${f.color}28,transparent)`, filter: 'blur(20px)',
          }} />
          <motion.img
            src={f.img} alt={f.name} loading="lazy"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              maxHeight: '100%', maxWidth: '80%', objectFit: 'contain', position: 'relative', zIndex: 1,
              filter: `drop-shadow(0 16px 28px ${f.color}40)`,
            }}
          />
        </div>
        <div style={{ padding: '1.25rem 1.5rem 1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
            <span className="tag" style={{ background: f.color, color: '#fff' }}>{f.tag}</span>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
          </div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem' }}>{f.name}</h3>
          <p style={{ fontSize: '.85rem', color: '#6b7280', marginBottom: '.85rem', lineHeight: 1.55 }}>{f.desc}</p>
          <Link to="/contact"
            style={{ fontSize: '.85rem', fontWeight: 700, color: f.color, fontFamily: "'Sora',sans-serif" }}
          >
            Contact Us →
          </Link>
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
    active === 'All'        ? ALL_FLAVORS :
    active === 'With Video' ? ALL_FLAVORS.filter(f => f.video) :
                              ALL_FLAVORS.filter(f => f.tag === active)

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="blob" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(155,93,229,.18)' }} />
        <div className="blob" style={{ width: 280, height: 280, bottom: '-10%', left: '5%', background: 'rgba(230,57,70,.15)', animationDelay: '-3s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ justifyContent: 'center' }}>12 Bold Flavors · 4 Video Stories</span>
          <h1>Find Your <span className="grad">Perfect Fizz</span></h1>
          <p>Hover the video cards to watch each flavor come alive — or tap to open in cinematic fullscreen.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', fill: '#fffdf5', pointerEvents: 'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* All flavors banner */}
      <section style={{ background: '#fffdf5', padding: '3rem 0 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .8 }}
            style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(26,26,46,.1)' }}>
            <img src="/images/all-flavors.png" alt="All IndiColas flavors" loading="lazy"
              style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 380 }} />
          </motion.div>
        </div>
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
                {tag === 'With Video' ? '▶ With Video' : tag}
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
                {f.video
                  ? <VideoFlavorCard  f={f} isMobile={isMobile} onWatch={() => setLightbox(f)} />
                  : <StaticFlavorCard f={f} isMobile={isMobile} />}
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
