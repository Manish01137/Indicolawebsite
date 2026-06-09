import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTilt, useDevice } from '../hooks/useTilt'
import { useScrollTilt } from '../hooks/useScrollTilt'

/* Inline SVG glyphs for each value — premium, monochrome, currentColor */
const Q = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2 14.85 8.78 22 9.5l-5.4 4.86L18.2 22 12 18.34 5.8 22l1.6-7.64L2 9.5l7.15-.72L12 2z"/></svg>
const I = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
const S = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5 7-12 7-12s7 7 7 12a7 7 0 0 1-7 7z"/><path d="M11 13a4 4 0 0 0-4-4"/></svg>
const N = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4.5 16.5 3 22l5.5-1.5"/><path d="M21 2s-5.5 1-9.5 5-5 9-5 9 5 0 9-4 5.5-10 5.5-10z"/><path d="M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>

const VALUES = [
  { Icon: Q, title: 'Quality',       color: '#f77f00', bg: '#fff3e0', desc: 'Premium ingredients, uncompromised production standards — the finest soda experience in every bottle.' },
  { Icon: I, title: 'Integrity',     color: '#9b5de5', bg: '#f3e8ff', desc: 'Transparent, honest practices in everything we do — sourcing, bottling, delivery.' },
  { Icon: S, title: 'Sustainability',color: '#06d6a0', bg: '#d1fae5', desc: 'Eco-friendly packaging and responsibly sourced ingredients for a better tomorrow.' },
  { Icon: N, title: 'Innovation',    color: '#e63946', bg: '#ffe4e6', desc: 'Bold modern twists — constantly pushing the boundaries of flavor and experience.' },
]

const FAQS = [
  {
    q: 'What is a Codd neck Bottle?',
    a: 'The Codd-neck bottle, invented by Hiram Codd in 1872, is a glass bottle sealed with a marble held in place by carbonation pressure. To open it, you push the marble down into the neck — creating the iconic "pop" sound that defined Goli Soda culture across South Asia.',
  },
  {
    q: 'How is Indicolas Soda different from a Codd neck Bottle?',
    a: 'IndiColas is inspired by the Codd-neck bottle experience but uses modern, eco-friendly packaging that maintains freshness without the traditional glass marble inconvenience. We keep the bold flavors and cultural spirit — just with contemporary convenience.',
  },
  {
    q: 'Is the taste of Indicolas similar to Codd neck Bottle?',
    a: 'Absolutely! IndiColas is formulated to capture the bold, tangy, refreshing taste of traditional Goli Soda while introducing exciting new flavor combinations that take the experience further.',
  },
  {
    q: 'Why choose Indicolas over Codd neck Bottle?',
    a: 'IndiColas offers the same cultural nostalgia with the benefits of modern production — premium quality control, consistent flavor, eco-friendly materials, and 12 vibrant flavor options you simply cannot get from traditional Goli Soda vendors.',
  },
]

/* 3D value card — desktop pointer tilt + universal scroll tilt for mobile */
function ValueCard({ v, i }) {
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 13, scale: 1.04 })
  const scrollRef = useScrollTilt({ amount: 5, axis: 'x', invert: i % 2 === 0 })
  return (
    <motion.div
      initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-50px' }} transition={{ duration:.65, delay:i*.1 }}
      style={{ perspective: 1100, transformStyle: 'preserve-3d' }}
    >
      <div ref={scrollRef}>
        <div
          ref={isMobile ? null : tiltRef}
          style={{
            background:`linear-gradient(160deg, ${v.bg}, #fff 130%)`,
            borderRadius:22,
            padding:'2rem',
            position:'relative',
            overflow:'hidden',
            border:`1px solid ${v.color}22`,
            boxShadow:`0 14px 36px ${v.color}1a, 0 2px 8px ${v.color}0d`,
            transition:'box-shadow .35s',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Faded background glyph */}
          <span style={{
            position:'absolute', bottom:-22, right:-12,
            opacity:.07, color:v.color, lineHeight:1,
            transform: 'translateZ(-10px)',
          }}>
            <v.Icon width={130} height={130} />
          </span>

          {/* Icon chip */}
          <div style={{
            width:56, height:56, borderRadius:16,
            background:`linear-gradient(135deg, ${v.color}, ${v.color}cc)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', marginBottom:'1.2rem',
            boxShadow:`0 10px 24px ${v.color}55, inset 0 1px 0 rgba(255,255,255,.3)`,
            transform: 'translateZ(28px)',
          }}>
            <v.Icon width={24} height={24} />
          </div>

          <h3 style={{
            fontFamily:"'Sora',sans-serif", fontWeight:700,
            marginBottom:'.55rem', color:'#1a1a2e',
            transform: 'translateZ(18px)',
          }}>{v.title}</h3>
          <p style={{
            fontSize:'.9rem', color:'#6b7280', lineHeight:1.7,
            transform: 'translateZ(8px)',
          }}>{v.desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* 3D bottle image with both hover-tilt (desktop) and scroll-tilt (universal) */
function BottleImage({ src, alt, color, delay = 0, mt = 0 }) {
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 12, scale: 1.05 })
  const scrollRef = useScrollTilt({ amount: 9, axis: 'x', invert: delay > 0 })
  return (
    <div ref={scrollRef} style={{ perspective: 1200, marginTop: mt }}>
      <motion.div
        ref={isMobile ? null : tiltRef}
        animate={{ y:[0,-12,0] }}
        transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img src={src} alt={alt}
          style={{
            width:'100%', borderRadius:24, objectFit:'contain',
            filter:`drop-shadow(0 22px 44px ${color}55) drop-shadow(0 6px 16px ${color}30)`,
          }} />
      </motion.div>
    </div>
  )
}

/* Premium bottle showcase card with 3D tilt + scroll-driven rotation */
function PremiumBottleCard({ b, i }) {
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 14, scale: 1.04 })
  const scrollRef = useScrollTilt({ amount: 6, axis: 'y', invert: i % 2 === 1 })
  return (
    <motion.div
      initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:.7, delay:i*.12 }}
      style={{ perspective: 1200 }}
    >
      <div ref={scrollRef}>
        <div
          ref={isMobile ? null : tiltRef}
          style={{
            background: `linear-gradient(160deg, ${b.bg}, #fff 140%)`,
            borderRadius:26, padding:'2.4rem 1.5rem 1.6rem', textAlign:'center',
            boxShadow:`0 22px 48px ${b.color}22, 0 4px 14px ${b.color}10`,
            border: `1px solid ${b.color}1f`,
            display:'flex', flexDirection:'column', alignItems:'center',
            position: 'relative', overflow: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top glow */}
          <div style={{
            position:'absolute', top:'-30%', left:'15%', width:'70%', height:'60%',
            background: `radial-gradient(circle, ${b.color}30, transparent 65%)`,
            filter: 'blur(20px)', pointerEvents:'none',
          }} />
          <motion.img src={b.img} alt={b.name}
            animate={{ y:[0,-14,0] }} transition={{ duration:3+i*.4, repeat:Infinity, ease:'easeInOut' }}
            style={{
              height:280, objectFit:'contain', marginBottom:'1rem',
              filter:`drop-shadow(0 24px 44px ${b.color}55) drop-shadow(0 6px 14px ${b.color}30)`,
              transform: 'translateZ(40px)',
              position:'relative', zIndex:1,
            }} />
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, color:b.color, transform:'translateZ(20px)' }}>{b.name}</h3>
        </div>
      </div>
    </motion.div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(26,26,46,.08)', padding: '1.4rem 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', fontFamily: "'Sora',sans-serif", fontWeight: 700,
        fontSize: '1rem', color: '#1a1a2e', cursor: 'pointer', background: 'none', border: 'none',
      }}>
        {q}
        <span style={{
          width: 28, height: 28, borderRadius: '50%', background: open ? '#e63946' : '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          color: open ? '#fff' : '#6b7280', fontSize: '1.1rem', transition: 'background .2s,transform .3s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      {open && (
        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          style={{ color: '#6b7280', lineHeight: 1.75, paddingTop: '.75rem', fontSize: '.95rem' }}>
          {a}
        </motion.p>
      )}
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="blob" style={{ width:400, height:400, top:'-20%', right:'-5%', background:'rgba(230,57,70,.15)' }} />
        <div className="blob" style={{ width:280, height:280, bottom:'-10%', left:'5%', background:'rgba(247,127,0,.15)', animationDelay:'-3s' }} />
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="label" style={{ justifyContent:'center' }}>Who We Are</span>
          <h1>About <span className="grad">IndiColas</span></h1>
          <p>The newest sensation shaking up America's beverage scene — heritage-inspired, premium-crafted, boldly flavored.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position:'absolute', bottom:-1, left:0, width:'100%', fill:'#fff', pointerEvents:'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Brand story */}
      <section style={{ background:'#fff', padding:'5.5rem 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
            <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}>
              <span className="label">Our Process</span>
              <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', marginBottom:'1.2rem' }}>
                Experience Soda<br /><span className="grad">Like Never Before</span>
              </h2>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem' }}>
                Indicola is bringing a fresh twist to America's soda scene with bold flavors, premium ingredients, and an unforgettable drinking experience.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem' }}>
                Built around the iconic Codd Neck Bottle, every sip combines playful nostalgia with modern refreshment — creating a beverage that's as fun to open as it is to enjoy.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'2rem' }}>
                From tropical favorites to candy-inspired creations, our growing collection of flavors is crafted for adventurous taste buds looking for something beyond ordinary soda.
              </p>

              {/* Mission / Vision */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem', marginBottom:'2rem' }}>
                {[
                  { t:'Our Mission', c:'#e63946', bg:'#ffe4e6', d:'To create exciting, high-quality beverages that turn everyday moments into memorable experiences through bold flavors, innovation, and refreshment.' },
                  { t:'Our Vision',  c:'#9b5de5', bg:'#f3e8ff', d:"To become America's most recognizable Codd Neck Bottle beverage brand, delivering unique flavors and unforgettable experiences to soda lovers everywhere." },
                ].map(({ t, c, bg, d }) => (
                  <div key={t} style={{ background: bg, borderRadius: 16, padding: '1.2rem' }}>
                    <h4 style={{ fontFamily:"'Sora',sans-serif", color: c, fontWeight: 700, fontSize: '.9rem', marginBottom: '.5rem' }}>{t}</h4>
                    <p style={{ color:'#6b7280', fontSize:'.85rem', lineHeight:1.65 }}>{d}</p>
                  </div>
                ))}
              </div>

              <Link to="/history" className="btn btn-primary">Explore Our History</Link>
            </motion.div>

            {/* Tall bottle images — 3D tilt + float (works on mobile via scroll-tilt) */}
            <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <BottleImage src="/images/berry-punch-tall.png" alt="Berry Punch" color="#9b5de5" />
              <BottleImage src="/images/coco-berry-tall.png"  alt="Coco Berry"  color="#ff70a6" delay={0.6} mt="2.5rem" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* More product images */}
      <section style={{ background:'linear-gradient(180deg,#fffdf5,#fff5e8)', padding:'4rem 0' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ textAlign:'center', marginBottom:'3rem' }}>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              Premium Quality, <span className="grad">Every Bottle</span>
            </h2>
          </motion.div>
          <div className="bottle-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {[
              { img:'/images/citrus-blast-tall.png', name:'Citrus Blast',  color:'#f77f00', bg:'#fff3e0' },
              { img:'/images/peach-punch-alt.png',   name:'Peach Punch',   color:'#ffb347', bg:'#fff8e1' },
              { img:'/images/ginger-lime-alt.png',   name:'Ginger Lime',   color:'#06d6a0', bg:'#d1fae5' },
            ].map((b, i) => <PremiumBottleCard key={b.name} b={b} i={i} />)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background:'#fff', padding:'5.5rem 0' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="label" style={{ justifyContent:'center' }}>The Heart of IndiColas</span>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>Our <span className="grad">Core Values</span></h2>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' }}>
            {VALUES.map((v, i) => <ValueCard key={v.title} v={v} i={i} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background:'linear-gradient(180deg,#fffdf5,#fff)', padding:'5.5rem 0' }}>
        <div className="container" style={{ maxWidth:780 }}>
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="label" style={{ justifyContent:'center' }}>FAQs</span>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>Frequently Asked <span className="grad">Questions</span></h2>
          </motion.div>
          {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background:'linear-gradient(135deg,#e63946,#f77f00,#ff70a6)',
        padding:'5rem 0', textAlign:'center', color:'#fff',
      }}>
        <div className="container" style={{ maxWidth:640 }}>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', marginBottom:'1rem' }}>Ready to Pop the Fizz?</h2>
          <p style={{ opacity:.9, marginBottom:'2rem', fontSize:'1.05rem' }}>
            Explore our full range of 12 bold flavors and find your perfect sip.
          </p>
          <Link to="/flavors" className="btn btn-white" style={{ fontSize:'1rem', padding:'1rem 2.5rem' }}>
            View All Flavors →
          </Link>
        </div>
      </section>
    </>
  )
}
