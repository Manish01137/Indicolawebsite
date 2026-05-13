import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* CSS Bubbles rendered inline — no WebGL */
function Bubbles({ count = 18 }) {
  const bubbles = Array.from({ length: count }, (_, i) => ({
    size: 10 + Math.random() * 28,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 10}s`,
    color: ['#e63946','#f77f00','#06d6a0','#9b5de5','#00b4d8','#ffb347','#ff70a6'][i % 7],
  }))
  return (
    <div className="bubble-wrap" aria-hidden>
      {bubbles.map((b, i) => (
        <div key={i} className="bubble" style={{
          width: b.size, height: b.size, left: b.left,
          background: b.color, opacity: 0,
          animationDuration: b.duration,
          animationDelay: b.delay,
        }} />
      ))}
    </div>
  )
}

/* Animated counter */
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(end / 40)
    const id = setInterval(() => {
      start = Math.min(start + step, end)
      setVal(start)
      if (start >= end) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [inView, end])
  return <span ref={ref}>{val}{suffix}</span>
}

const FEATURED = [
  { name: 'Berry Magma',          img: '/images/berry-magma.png',       color: '#9b5de5', bg: '#f3e8ff' },
  { name: 'Citrus Blast',         img: '/images/citrus-blast-tall.png', color: '#f77f00', bg: '#fff3e0' },
  { name: 'Cherry Cola',          img: '/images/cherry-cola.png',       color: '#e63946', bg: '#ffe4e6' },
  { name: 'Ginger Lime',          img: '/images/ginger-lime-alt.png',   color: '#06d6a0', bg: '#d1fae5' },
]

export default function HomePage() {
  const heroRef   = useRef()
  const headRef   = useRef()
  const imgRef    = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero text entrance */
      const els = headRef.current?.querySelectorAll('.anim')
      if (els) gsap.from(els, { y: 70, opacity: 0, stagger: .1, duration: 1.1, ease: 'power4.out', delay: .15 })

      /* Hero image entrance */
      gsap.from(imgRef.current, { x: 80, opacity: 0, duration: 1.3, ease: 'power3.out', delay: .3 })

      /* Parallax on bottle image while scrolling */
      gsap.to(imgRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════ HERO ═══ */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg,#fff8f0 0%,#fff0e8 40%,#fdf4ff 100%)',
        paddingTop: 'var(--nav-h)',
      }}>
        {/* Ambient blobs */}
        <div className="blob" style={{ width: 550, height: 550, top: '-15%', right: '-5%', background: 'rgba(230,57,70,.18)', animationDelay: '0s' }} />
        <div className="blob" style={{ width: 380, height: 380, bottom: '-10%', left: '5%',  background: 'rgba(247,127,0,.18)',  animationDelay: '-3s' }} />
        <div className="blob" style={{ width: 260, height: 260, top: '30%',  left: '20%',  background: 'rgba(155,93,229,.15)', animationDelay: '-6s' }} />

        {/* CSS bubble field */}
        <Bubbles count={22} />

        {/* Banner image faint background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/banner.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: .06, zIndex: 0,
        }} />

        <div className="container" style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '2rem', alignItems: 'center', minHeight: '90vh',
        }}>
          {/* ── Left text ── */}
          <div ref={headRef} style={{ paddingRight: '1rem' }}>
            <span className="label anim">Born From Banta Culture</span>

            <h1 className="anim" style={{ fontSize: 'clamp(3.2rem,7vw,5.8rem)', marginBottom: '1.2rem' }}>
              Pop The<br />
              <span className="grad">Fizz.</span>
            </h1>

            <p className="anim" style={{
              fontSize: 'clamp(1rem,2vw,1.18rem)', color: '#6b7280',
              lineHeight: 1.75, maxWidth: 460, marginBottom: '2.5rem',
            }}>
              Heritage-inspired sodas bringing India's iconic Goli Soda culture to the USA —
              12 bold, vibrant flavors crafted for a new generation.
            </p>

            <div className="anim" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link to="/flavors" className="btn btn-primary" style={{ fontSize: '1.02rem', padding: '1rem 2.2rem' }}>
                Explore Flavors →
              </Link>
              <Link to="/about" className="btn btn-outline" style={{ fontSize: '1.02rem', padding: '1rem 2.2rem' }}>
                Our Story
              </Link>
            </div>

            {/* Stats */}
            <div className="anim" style={{
              display: 'flex', gap: '2.5rem',
              paddingTop: '2rem', borderTop: '1px solid rgba(26,26,46,.08)',
            }}>
              {[['12','Bold Flavors'],['100%','Premium Craft'],['1','Iconic Heritage']].map(([n,l]) => (
                <div key={l}>
                  <div style={{
                    fontFamily: "'Sora',sans-serif", fontSize: '2rem', fontWeight: 800,
                    background: 'linear-gradient(135deg,#e63946,#f77f00)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{n}</div>
                  <div style={{ fontSize: '.77rem', color: '#9ca3af', fontWeight: 500, marginTop: 2, letterSpacing: '.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: real product image ── */}
          <div ref={imgRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {/* Glow halo */}
            <div style={{
              position: 'absolute', width: '75%', height: '75%', borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(230,57,70,.22) 0%,rgba(247,127,0,.12) 50%,transparent 70%)',
              filter: 'blur(30px)',
            }} />
            <motion.img
              src="/images/bottles-sky.png"
              alt="IndiColas Goli Soda Bottles"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '92%', maxWidth: 560, position: 'relative', zIndex: 1,
                filter: 'drop-shadow(0 40px 70px rgba(230,57,70,.28)) drop-shadow(0 10px 30px rgba(0,0,0,.12))',
              }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-ind">
          <div className="scroll-ind__mouse"><div className="scroll-ind__dot" /></div>
          <span>Scroll</span>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 80, fill: '#fff', pointerEvents: 'none' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>

        <style>{`@media(max-width:768px){#hero-grid{grid-template-columns:1fr!important}#hero-grid > div:last-child{display:none!important}}`}</style>
      </section>

      {/* ══════════════════════════════════ WHAT IS INDICOLA ═══ */}
      <section style={{ background: '#fff', padding: '6rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
          }}>
            {/* Images collage */}
            <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}
              style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <img src="/images/lifestyle1.jpeg" alt="IndiColas lifestyle"
                  style={{ width:'100%', borderRadius:20, objectFit:'cover', aspectRatio:'1', boxShadow:'0 8px 32px rgba(26,26,46,.1)' }} />
                <img src="/images/lifestyle2.jpeg" alt="IndiColas lifestyle"
                  style={{ width:'100%', borderRadius:20, objectFit:'cover', aspectRatio:'1', marginTop:'2rem', boxShadow:'0 8px 32px rgba(26,26,46,.1)' }} />
                <img src="/images/lifestyle3.jpeg" alt="IndiColas lifestyle"
                  style={{ width:'100%', borderRadius:20, objectFit:'cover', aspectRatio:'1', boxShadow:'0 8px 32px rgba(26,26,46,.1)' }} />
                <img src="/images/lifestyle4.jpeg" alt="IndiColas lifestyle"
                  style={{ width:'100%', borderRadius:20, objectFit:'cover', aspectRatio:'1', marginTop:'-2rem', boxShadow:'0 8px 32px rgba(26,26,46,.1)' }} />
              </div>
              {/* Floating badge */}
              <div style={{
                position:'absolute', bottom:-20, right:-20,
                background:'linear-gradient(135deg,#e63946,#f77f00)',
                color:'#fff', borderRadius:16, padding:'1rem 1.5rem',
                boxShadow:'0 12px 36px rgba(230,57,70,.35)',
                fontFamily:"'Sora',sans-serif",
              }}>
                <div style={{ fontSize:'2rem', fontWeight:800, lineHeight:1 }}>12</div>
                <div style={{ fontSize:'.78rem', fontWeight:600 }}>Bold Flavors</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}>
              <span className="label">What is IndiColas</span>
              <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.2rem)', marginBottom:'1.2rem' }}>
                Where Every Sip<br /><span className="grad">Sparks Adventure!</span>
              </h2>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem', fontSize:'1.05rem' }}>
                IndiColas is the newest sensation shaking up America's beverage scene — blending cherished soda traditions with modern innovation and bold flavors.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'2rem', fontSize:'1.05rem' }}>
                Inspired by the iconic Codd-neck Goli Soda bottle that defined Indian summers for generations, we've reinvented the experience with premium ingredients and eco-friendly packaging.
              </p>
              <div style={{ display:'flex', gap:'1.5rem', marginBottom:'2.5rem' }}>
                {[['Quality','Premium ingredients & craft'],['Heritage','Born from Banta culture'],['Innovation','12 bold modern flavors']].map(([t,d]) => (
                  <div key={t}>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'.95rem', color:'#e63946', marginBottom:'.25rem' }}>{t}</div>
                    <div style={{ fontSize:'.8rem', color:'#9ca3af' }}>{d}</div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ BANNER FULL-WIDTH ═══ */}
      <section style={{ position:'relative', overflow:'hidden', height:420 }}>
        <img src="/images/banner.jpg" alt="IndiColas banner"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(135deg,rgba(230,57,70,.7) 0%,rgba(247,127,0,.5) 100%)',
          display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
          textAlign:'center', color:'#fff', padding:'2rem',
        }}>
          <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ fontSize:'clamp(2rem,5vw,3.5rem)', marginBottom:'1rem', textShadow:'0 4px 20px rgba(0,0,0,.3)' }}>
            "More than a drink — it's a <em>vibe</em> in every bottle."
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ duration:.8, delay:.2 }}
            style={{ fontSize:'1.1rem', opacity:.9, marginBottom:'2rem' }}>
            Crafted with bold desi flavors, IndiColas brings a fizzy twist to every moment.
          </motion.p>
          <Link to="/flavors" className="btn btn-white">Explore All Flavors →</Link>
        </div>
      </section>

      {/* ══════════════════════════════════ FEATURED FLAVORS ═══ */}
      <section style={{ background:'linear-gradient(180deg,#fffdf5 0%,#fff 100%)', padding:'6rem 0' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-80px' }} transition={{ duration:.8 }}
            style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <span className="label" style={{ justifyContent:'center' }}>Enjoy Our Range</span>
            <h2 style={{ fontSize:'clamp(2.2rem,4vw,3.2rem)', marginBottom:'1rem' }}>
              Enjoy Indicola's Exciting<br /><span className="grad">Range of Flavors</span>
            </h2>
            <p style={{ color:'#6b7280', maxWidth:500, margin:'0 auto', fontSize:'1.05rem', lineHeight:1.7 }}>
              Discover the refreshing flavor of your favorite drink, made with high-quality ingredients to satisfy your thirst.
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1.5rem' }}>
            {FEATURED.map((f, i) => (
              <motion.div key={f.name}
                initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-50px' }}
                transition={{ duration:.65, delay: i * .1 }}
                whileHover={{ y:-8, boxShadow:`0 24px 56px ${f.color}28` }}
                style={{
                  background: f.bg, borderRadius: 24, overflow:'hidden',
                  boxShadow: '0 4px 24px rgba(26,26,46,.07)',
                  transition: 'box-shadow .3s',
                }}
              >
                <div style={{
                  height: 260, display:'flex', alignItems:'center', justifyContent:'center',
                  padding:'1.5rem', background:`linear-gradient(160deg,${f.bg},white)`,
                }}>
                  <motion.img src={f.img} alt={f.name}
                    animate={{ y:[0,-8,0] }} transition={{ duration:3+i*.3, repeat:Infinity, ease:'easeInOut' }}
                    style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain',
                      filter:`drop-shadow(0 16px 32px ${f.color}44)` }}
                  />
                </div>
                <div style={{ padding:'1.2rem 1.5rem 1.5rem' }}>
                  <div className="tag" style={{ background:f.color, color:'#fff', marginBottom:'.6rem' }}>
                    New Flavor
                  </div>
                  <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:'1.1rem', fontWeight:700, marginBottom:'.3rem' }}>{f.name}</h3>
                  <Link to="/contact" style={{ fontSize:'.85rem', color:f.color, fontWeight:700, fontFamily:"'Sora',sans-serif" }}>
                    Contact Us →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <Link to="/flavors" className="btn btn-primary" style={{ fontSize:'1rem', padding:'1rem 2.5rem' }}>
              View All 12 Flavors
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ STATS BAND ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#e63946 0%,#f77f00 60%,#ff70a6 100%)',
        padding:'4rem 0', color:'#fff',
      }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:'2.5rem', textAlign:'center' }}>
            {[
              { n: 12, s: '+', l: 'Bold Flavors' },
              { n: 100, s: '%', l: 'Premium Quality' },
              { n: 1,  s: '', l: 'Legendary Heritage' },
              { n: 2,  s: '', l: 'US Locations' },
            ].map(({ n, s, l }) => (
              <div key={l}>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:'3.2rem', fontWeight:800, lineHeight:1 }}>
                  <Counter end={n} suffix={s} />
                </div>
                <div style={{ fontSize:'.9rem', opacity:.85, marginTop:'.4rem', fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ GEMINI VISUAL / PRODUCT SHOT ═══ */}
      <section style={{ background:'#fff', padding:'6rem 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
            <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:.9 }}>
              <span className="label">Always Refreshing</span>
              <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', marginBottom:'1.2rem' }}>
                Always Refreshing,<br /><span className="grad">Always IndiColas</span>
              </h2>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem' }}>
                Crafted with bold desi flavors, IndiColas brings a fizzy twist to every moment. More than a drink — it's a vibe in every bottle.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'2rem' }}>
                Whether it's a summer afternoon, a celebration, or just a Tuesday — every sip unlocks that golden Goli Soda feeling.
              </p>
              <Link to="/history" className="btn btn-primary">Discover Our Heritage</Link>
            </motion.div>

            <motion.div initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ duration:1 }}
              style={{ borderRadius:28, overflow:'hidden', boxShadow:'0 20px 60px rgba(26,26,46,.12)' }}>
              <img src="/images/chatgpt-visual.png" alt="IndiColas product visual"
                style={{ width:'100%', display:'block', objectFit:'cover' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ NEWSLETTER ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#e63946 0%,#f77f00 50%,#ff70a6 100%)',
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
            <form onSubmit={e => e.preventDefault()} style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', justifyContent:'center' }}>
              <input type="email" placeholder="your@email.com" style={{
                flex:'1 1 260px', padding:'.9rem 1.4rem', borderRadius:9999, border:'none',
                fontSize:'1rem', fontFamily:"'Inter',sans-serif", outline:'none',
                boxShadow:'0 4px 20px rgba(0,0,0,.12)',
              }} />
              <button type="submit" className="btn btn-white">Pop the Fizz →</button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
