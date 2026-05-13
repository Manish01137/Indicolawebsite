import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const FLAVORS = [
  { name: 'Berry Magma',          img: '/images/berry-magma.png',         color: '#9b5de5', bg: '#f3e8ff', tag: 'Fan Favorite' },
  { name: 'Pinachi',              img: '/images/pinachi.png',              color: '#f77f00', bg: '#fff3e0', tag: 'Tropical' },
  { name: 'Coco Berry',           img: '/images/coco-berry.png',           color: '#ff70a6', bg: '#fce7f3', tag: 'Exotic' },
  { name: 'Americano Ice Cream',  img: '/images/americano-icecream.png',   color: '#ffd166', bg: '#fffde7', tag: 'Sweet' },
  { name: 'Fruitbeer With Malt',  img: '/images/peach-punch.png',          color: '#e9c46a', bg: '#fdf6e3', tag: 'Unique' },
  { name: 'Cotton Candy',         img: '/images/cotton-candy.png',         color: '#ff70a6', bg: '#fce7f3', tag: 'Sweet' },
  { name: 'Green Twister',        img: '/images/green-twister.png',        color: '#06d6a0', bg: '#d1fae5', tag: 'Refreshing' },
  { name: 'Cherry Cola',          img: '/images/cherry-cola.png',          color: '#e63946', bg: '#ffe4e6', tag: 'Classic' },
  { name: 'Citrus Blast',         img: '/images/citrus-blast.png',         color: '#f4a261', bg: '#fff3e0', tag: 'Zesty' },
  { name: 'Strawberry Margarita', img: '/images/strawberry.png',           color: '#ff4d6d', bg: '#ffe4e6', tag: 'Bold' },
  { name: 'Ginger Lime',          img: '/images/ginger-lime.png',          color: '#b5e48c', bg: '#f0fdf4', tag: 'Fresh' },
  { name: 'Peach Punch',          img: '/images/peach-punch.png',          color: '#ffb347', bg: '#fff8e1', tag: 'Summer' },
]

const TAGS = ['All', 'Fan Favorite', 'Classic', 'Tropical', 'Sweet', 'Refreshing', 'Zesty', 'Bold', 'Fresh', 'Exotic', 'Unique', 'Summer']

function FlavorCard({ f, i }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .6, delay: (i % 4) * .07 }}
      whileHover={{ y: -10, boxShadow: `0 28px 60px ${f.color}30` }}
      style={{
        background: '#fff', borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(26,26,46,.07)',
        transition: 'box-shadow .3s', cursor: 'default',
      }}
    >
      {/* Image area */}
      <div style={{
        background: `linear-gradient(160deg,${f.bg},white)`,
        padding: '2rem 2rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 240, position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', width: '60%', height: '60%', borderRadius: '50%',
          background: `radial-gradient(circle,${f.color}28,transparent)`,
          filter: 'blur(20px)',
        }} />
        <motion.img
          src={f.img} alt={f.name}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * .15 }}
          style={{
            maxHeight: '100%', maxWidth: '80%', objectFit: 'contain', position: 'relative', zIndex: 1,
            filter: `drop-shadow(0 16px 28px ${f.color}40)`,
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem 1.5rem 1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.6rem' }}>
          <span className="tag" style={{ background: f.color, color: '#fff' }}>{f.tag}</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
        </div>
        <h3 style={{
          fontFamily: "'Sora',sans-serif", fontSize: '1.08rem', fontWeight: 700,
          marginBottom: '.75rem', color: '#1a1a2e',
        }}>{f.name}</h3>
        <Link to="/contact"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '.35rem',
            fontSize: '.82rem', fontWeight: 700, color: f.color,
            fontFamily: "'Sora',sans-serif", transition: 'gap .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.gap = '.6rem'}
          onMouseLeave={e => e.currentTarget.style.gap = '.35rem'}
        >
          Contact Us →
        </Link>
      </div>
    </motion.div>
  )
}

export default function FlavorsPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? FLAVORS : FLAVORS.filter(f => f.tag === active)

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="blob" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(155,93,229,.18)' }} />
        <div className="blob" style={{ width: 280, height: 280, bottom: '-10%', left: '5%', background: 'rgba(230,57,70,.15)', animationDelay: '-3s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ justifyContent: 'center' }}>12 Bold Flavors</span>
          <h1>Find Your <span className="grad">Perfect Fizz</span></h1>
          <p>Discover the refreshing flavor of your favorite drink, made with high-quality ingredients to satisfy your thirst and brighten your day.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', fill: '#fffdf5', pointerEvents: 'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* All flavors banner image */}
      <section style={{ background: '#fffdf5', padding: '3rem 0 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .8 }}
            style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(26,26,46,.1)' }}>
            <img src="/images/all-flavors.png" alt="All IndiColas flavors"
              style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 380 }} />
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section style={{ background: '#fffdf5', padding: '4rem 0 6rem' }}>
        <div className="container">

          {/* Filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActive(tag)}
                style={{
                  padding: '.5rem 1.2rem', borderRadius: 9999,
                  fontFamily: "'Sora',sans-serif", fontSize: '.82rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all .2s', border: 'none',
                  background: active === tag ? '#e63946' : 'rgba(26,26,46,.07)',
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
            gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((f, i) => <FlavorCard key={f.name} f={f} i={i} />)}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .7 }}
            style={{
              textAlign: 'center', marginTop: '4rem',
              padding: '3rem', borderRadius: 24,
              background: 'linear-gradient(135deg,#fff5e6,#fff0f5)',
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
    </>
  )
}
