import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const VALUES = [
  { icon: '⭐', title: 'Quality',       color: '#f77f00', bg: '#fff3e0', desc: 'We use only premium ingredients with uncompromised production standards to deliver the finest soda experience.' },
  { icon: '🤝', title: 'Integrity',     color: '#9b5de5', bg: '#f3e8ff', desc: 'Transparency and honest practices in everything we do — from sourcing to bottling to delivery.' },
  { icon: '🌿', title: 'Sustainability',color: '#06d6a0', bg: '#d1fae5', desc: 'Eco-friendly packaging and responsibly sourced ingredients for a better tomorrow.' },
  { icon: '🚀', title: 'Innovation',    color: '#e63946', bg: '#ffe4e6', desc: 'Constantly pushing the boundaries of flavor and experience with bold, modern twists.' },
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
              <span className="label">Our Story</span>
              <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', marginBottom:'1.2rem' }}>
                Enjoy <span className="grad">IndiColas Soda</span><br />Many Flavors
              </h2>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'1.2rem' }}>
                IndiColas is the newest sensation shaking up America's beverage scene — blending cherished soda traditions with contemporary taste and delivering consistency and excellence in every sip.
              </p>
              <p style={{ color:'#6b7280', lineHeight:1.8, marginBottom:'2rem' }}>
                Inspired by the iconic Codd-neck Goli Soda bottle that defined Indian summers, railway platforms, and street corners for generations, we've modernized the experience without losing its soul.
              </p>

              {/* Mission / Vision */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem', marginBottom:'2rem' }}>
                {[
                  { t:'Our Mission', c:'#e63946', bg:'#ffe4e6', d:'To craft refreshing, high-quality beverages that combine nostalgia with contemporary taste, delivering consistency and excellence.' },
                  { t:'Our Vision',  c:'#9b5de5', bg:'#f3e8ff', d:'Building a globally recognized beverage brand blending traditional flavors with modern innovation while prioritizing quality and sustainability.' },
                ].map(({ t, c, bg, d }) => (
                  <div key={t} style={{ background: bg, borderRadius: 16, padding: '1.2rem' }}>
                    <h4 style={{ fontFamily:"'Sora',sans-serif", color: c, fontWeight: 700, fontSize: '.9rem', marginBottom: '.5rem' }}>{t}</h4>
                    <p style={{ color:'#6b7280', fontSize:'.85rem', lineHeight:1.65 }}>{d}</p>
                  </div>
                ))}
              </div>

              <Link to="/history" className="btn btn-primary">Explore Our History</Link>
            </motion.div>

            {/* Tall bottle images */}
            <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}
              style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <motion.img src="/images/berry-punch-tall.png" alt="Berry Punch"
                animate={{ y:[0,-10,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
                style={{ width:'100%', borderRadius:20, objectFit:'contain', filter:'drop-shadow(0 16px 32px rgba(155,93,229,.3))' }} />
              <motion.img src="/images/coco-berry-tall.png" alt="Coco Berry"
                animate={{ y:[0,-10,0] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut', delay:.6 }}
                style={{ width:'100%', borderRadius:20, objectFit:'contain', marginTop:'2.5rem', filter:'drop-shadow(0 16px 32px rgba(255,112,166,.3))' }} />
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
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {[
              { img:'/images/citrus-blast-tall.png', name:'Citrus Blast',  color:'#f77f00', bg:'#fff3e0' },
              { img:'/images/peach-punch-alt.png',   name:'Peach Punch',   color:'#ffb347', bg:'#fff8e1' },
              { img:'/images/ginger-lime-alt.png',   name:'Ginger Lime',   color:'#06d6a0', bg:'#d1fae5' },
            ].map((b, i) => (
              <motion.div key={b.name} initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:.7, delay:i*.12 }}
                style={{ background:b.bg, borderRadius:24, padding:'2rem 1.5rem', textAlign:'center',
                  boxShadow:`0 8px 32px ${b.color}22`, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <motion.img src={b.img} alt={b.name}
                  animate={{ y:[0,-12,0] }} transition={{ duration:3+i*.4, repeat:Infinity, ease:'easeInOut' }}
                  style={{ height:280, objectFit:'contain', filter:`drop-shadow(0 20px 40px ${b.color}44)`, marginBottom:'1rem' }} />
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, color:b.color }}>{b.name}</h3>
              </motion.div>
            ))}
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
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-50px' }} transition={{ duration:.65, delay:i*.1 }}
                whileHover={{ y:-8, boxShadow:`0 20px 48px ${v.color}28` }}
                style={{ background:v.bg, borderRadius:20, padding:'2rem', position:'relative', overflow:'hidden', transition:'box-shadow .3s' }}>
                <span style={{ position:'absolute', bottom:-10, right:-5, fontSize:'5.5rem', opacity:.1, lineHeight:1 }}>{v.icon}</span>
                <div style={{
                  width:50, height:50, borderRadius:14, background:v.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.5rem', marginBottom:'1.2rem', boxShadow:`0 8px 20px ${v.color}55`,
                }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, marginBottom:'.5rem' }}>{v.title}</h3>
                <p style={{ fontSize:'.9rem', color:'#6b7280', lineHeight:1.65 }}>{v.desc}</p>
              </motion.div>
            ))}
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
