import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTilt, useDevice } from '../hooks/useTilt'
import { useScrollTilt } from '../hooks/useScrollTilt'
import { ArrowIcon } from '../components/SocialIcons'

const TIMELINE = [
  {
    era: '1872 — United Kingdom',
    icon: '🧪',
    title: 'The Birth',
    sub: 'Invented in the UK',
    color: '#9b5de5',
    bg: '#f3e8ff',
    img: '/images/history1.jpeg',
    facts: [
      'Invented in 1872 by Hiram Codd',
      'Designed to naturally seal carbonation using a glass marble',
      'Known as the Codd-neck bottle',
      'A revolutionary packaging innovation of the Victorian era',
    ],
  },
  {
    era: 'Late 1800s — Japan',
    icon: '🗾',
    title: "Japan's Cultural Twist",
    sub: 'The Adoption',
    color: '#e63946',
    bg: '#ffe4e6',
    img: '/images/history2.jpeg',
    facts: [
      'The marble bottle reached Japan in the late 19th century',
      'Became iconic through the drink Ramune',
      'Turned into a fun, interactive beverage experience',
      'The "push-the-marble" ritual became part of pop culture',
    ],
  },
  {
    era: 'British India Era',
    icon: '🇮🇳',
    title: "India's Goli Soda Era",
    sub: 'The Emotion',
    color: '#f77f00',
    bg: '#fff3e0',
    img: '/images/history3.jpeg',
    facts: [
      'Introduced during British rule',
      'Became famous as Goli Soda / Banta / Goti Soda',
      'The iconic "POP" sound defined Indian summers',
      'Sold at street stalls, railway stations & local markets',
    ],
  },
  {
    era: 'Today — USA',
    icon: '🇺🇸',
    title: "IndiCola's Modern Movement",
    sub: 'The Revival',
    color: '#06d6a0',
    bg: '#d1fae5',
    img: '/images/history4.jpeg',
    facts: [
      'Stronger, refined bottle engineering',
      'Premium branding & contemporary aesthetics',
      'Hygienic, scalable production',
      'Bursting, innovative flavors',
      'Designed for global markets including India & USA',
    ],
  },
]

function TimelineItem({ t, i }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isEven = i % 2 === 0
  const { isMobile } = useDevice()
  const tiltRef = useTilt({ intensity: 10, scale: 1.025 })
  const scrollRef = useScrollTilt({ amount: 6, axis: 'x', invert: !isEven })

  return (
    <div ref={ref} className="timeline-row" style={{ display:'grid', gridTemplateColumns:'1fr 60px 1fr', gap:0, marginBottom:'3rem', alignItems:'start' }}>
      {/* Left */}
      <div style={{ paddingRight:'2rem', ...(isEven ? {} : { gridColumn:'3' }) }}>
        <motion.div
          initial={{ opacity:0, x: isEven ? -60 : 60 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:.8, delay:i*.1 }}
          style={{ perspective: 1200 }}
        >
          <div ref={scrollRef}>
            <div
              ref={isMobile ? null : tiltRef}
              style={{
                background:'#fff', borderRadius:24, overflow:'hidden',
                boxShadow:`0 18px 48px ${t.color}22, 0 2px 10px ${t.color}12`,
                border:`1px solid ${t.color}24`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <div style={{ height:240, overflow:'hidden', position:'relative' }}>
                <img src={t.img} alt={t.title}
                  style={{
                    width:'100%', height:'100%',
                    objectFit:'cover', objectPosition:'center',
                    transition:'transform .8s cubic-bezier(.2,.7,.3,1)',
                    transform: 'translateZ(20px)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateZ(20px) scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateZ(20px) scale(1)'}
                />
                <div style={{
                  position:'absolute', inset:0,
                  background:`linear-gradient(to top,${t.color}aa 0%, ${t.color}33 35%, transparent 70%)`,
                }} />
                <div className="tag" style={{
                  position:'absolute', top:'1rem', left:'1rem',
                  background: t.color, color:'#fff',
                  boxShadow:`0 6px 16px ${t.color}66`,
                  transform: 'translateZ(35px)',
                }}>{t.era}</div>
              </div>
              <div style={{ padding:'1.75rem 1.6rem' }}>
                <div style={{ color:t.color, fontSize:'.78rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:'.5rem' }}>{t.sub}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:'1.4rem', fontWeight:700, marginBottom:'.9rem', letterSpacing:'-0.02em' }}>{t.title}</h3>
                <ul style={{ paddingLeft:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'.55rem' }}>
                  {t.facts.map(f => (
                    <li key={f} style={{ display:'flex', gap:'.7rem', alignItems:'flex-start', fontSize:'.9rem', color:'#4b5563', lineHeight:1.55 }}>
                      <span style={{ color:t.color, flexShrink:0, marginTop:2 }}>
                        <ArrowIcon size={14} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center line + dot */}
      <div className="timeline-spine" style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2.5rem' }}>
        <motion.div
          initial={{ scale:0 }} animate={inView ? { scale:1 } : {}}
          transition={{ duration:.5, delay:i*.1+.2 }}
          style={{
            width:22, height:22, borderRadius:'50%',
            background:`linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
            boxShadow:`0 0 0 6px ${t.color}24, 0 6px 16px ${t.color}55`,
            zIndex:2,
          }} />
        <div style={{ flex:1, width:2, background:`linear-gradient(to bottom,${t.color}50,transparent)` }} />
      </div>

      {/* Right (placeholder if odd) */}
      {!isEven && <div style={{ gridColumn:1, gridRow:1 }} />}
      {isEven  && <div />}
    </div>
  )
}

export default function HistoryPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" style={{ background:'linear-gradient(135deg,#fff8f0,#fff3f8,#f0fffe)' }}>
        <div className="blob" style={{ width:350, height:350, top:'-15%', right:'-5%', background:'rgba(247,127,0,.18)' }} />
        <div className="blob" style={{ width:250, height:250, bottom:'-10%', left:'5%', background:'rgba(6,214,160,.18)', animationDelay:'-3s' }} />
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="label" style={{ justifyContent:'center' }}>From Victorian Innovation to Modern Revival</span>
          <h1>The Global Journey of<br /><span className="grad">the Goli Soda Bottle</span></h1>
          <p>From a Victorian inventor's lab in England to the streets of India and now to the USA — the Codd-neck bottle has traveled the world, carrying joy in every pop.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position:'absolute', bottom:-1, left:0, width:'100%', fill:'#fff', pointerEvents:'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Timeline */}
      <section style={{ background:'#fff', padding:'5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth:1000, position:'relative' }}>
          {/* Vertical spine */}
          <div style={{
            position:'absolute', top:0, bottom:0, left:'calc(50% - 1px)',
            width:2, background:'linear-gradient(to bottom,#e63946,#f77f00,#06d6a0,#9b5de5)',
            opacity:.2, pointerEvents:'none',
          }} />

          {TIMELINE.map((t, i) => <TimelineItem key={t.era} t={t} i={i} />)}
        </div>
      </section>

      {/* Quote banner */}
      <section style={{
        background:'linear-gradient(135deg,#e63946,#f77f00,#ff70a6)',
        padding:'5rem 0', textAlign:'center', color:'#fff', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,.05)' }} />
        <div className="container" style={{ position:'relative', zIndex:1, maxWidth:700 }}>
          <p style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontFamily:"'Sora',sans-serif", fontWeight:700, lineHeight:1.35, marginBottom:'1.2rem' }}>
            "Crafted with bold desi flavors, IndiColas brings a fizzy twist to every moment. More than a drink — it's a vibe in every bottle."
          </p>
          <p style={{ opacity:.85, marginBottom:'2.5rem' }}>Inspired by generations of joy. Crafted for today.</p>
          <Link to="/flavors" className="btn btn-white" style={{ fontSize:'1rem', padding:'1rem 2.5rem' }}>
            Explore Our Flavors
          </Link>
        </div>
      </section>

      {/* Mobile timeline stack */}
      <style>{`
        @media(max-width:768px){
          .timeline-row{grid-template-columns:30px 1fr!important;gap:1rem!important}
          .timeline-row > div:first-child{padding-right:0!important;grid-column:2!important}
          .timeline-row > div:last-child{display:none!important}
          .timeline-spine{grid-column:1!important;grid-row:1!important;padding-top:1.5rem!important}
        }
      `}</style>
    </>
  )
}
