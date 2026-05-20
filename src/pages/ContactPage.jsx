import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FactoryIcon, PhoneIcon, MailIcon, TruckIcon,
  InstagramIcon, FacebookIcon, TwitterIcon, YouTubeIcon,
  ArrowIcon,
} from '../components/SocialIcons'
import { useScrollTilt, useParallax } from '../hooks/useScrollTilt'

const INFO = [
  {
    Icon: FactoryIcon, title: 'Factory',
    lines: ['Indicola Beverages LLC', '790 Chamberlin Dr.', 'Beaumont, Texas 77707, USA'],
    color: '#e63946', bg: '#ffe4e6',
  },
  {
    Icon: PhoneIcon, title: 'Factory Phone',
    lines: ['(865) 335-3884'],
    color: '#f77f00', bg: '#fff3e0',
    link: 'tel:8653353884',
  },
  {
    Icon: MailIcon, title: 'Factory Email',
    lines: ['indicolasus@gmail.com'],
    color: '#9b5de5', bg: '#f3e8ff',
    link: 'mailto:indicolasus@gmail.com',
  },
  {
    Icon: TruckIcon, title: 'Distributor',
    lines: ['Liberty Smoke and Novelties LLC', '3863 Stagg Dr.', 'Beaumont, TX 77701, USA'],
    color: '#06d6a0', bg: '#d1fae5',
  },
  {
    Icon: PhoneIcon, title: 'Distributor Phone',
    lines: ['(832) 552-5072'],
    color: '#00b4d8', bg: '#e0f7fa',
    link: 'tel:8325525072',
  },
  {
    Icon: MailIcon, title: 'Distributor Email',
    lines: ['libertysn3863@gmail.com'],
    color: '#ffb347', bg: '#fff8e1',
    link: 'mailto:libertysn3863@gmail.com',
  },
]

const SOCIALS = [
  { Icon: InstagramIcon, name:'Instagram', handle:'@indicolas',  href:'https://instagram.com', color:'#E1306C' },
  { Icon: FacebookIcon,  name:'Facebook',  handle:'IndiColas',   href:'https://facebook.com',  color:'#1877F2' },
  { Icon: TwitterIcon,   name:'X',         handle:'@indicolas',  href:'https://twitter.com',   color:'#0f172a' },
  { Icon: YouTubeIcon,   name:'YouTube',   handle:'IndiColas',   href:'https://youtube.com',   color:'#FF0033' },
]

function InfoCard({ c, i }) {
  const tiltRef = useScrollTilt({ amount: 6, axis: 'x', invert: i % 2 === 0 })
  return (
    <motion.div
      initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }} transition={{ duration:.6, delay:i*.08 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <div ref={tiltRef}>
        <motion.div
          whileHover={{ y:-6, boxShadow:`0 24px 56px ${c.color}30, 0 4px 16px ${c.color}18` }}
          style={{
            background:`linear-gradient(160deg, ${c.bg}, #fff)`,
            borderRadius:22, padding:'1.8rem 1.6rem',
            border:`1px solid ${c.color}1f`,
            boxShadow:`0 12px 32px ${c.color}14`,
            transition:'box-shadow .3s',
            transformStyle: 'preserve-3d',
          }}
        >
          <div style={{
            width:54, height:54, borderRadius:16,
            background:`linear-gradient(135deg, ${c.color}, ${c.color}cc)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', marginBottom:'1.1rem',
            boxShadow:`0 10px 24px ${c.color}55, inset 0 1px 0 rgba(255,255,255,.25)`,
            transform: 'translateZ(20px)',
          }}><c.Icon size={24} /></div>
          <h4 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:'.98rem', marginBottom:'.6rem', color:'#1a1a2e' }}>
            {c.title}
          </h4>
          {c.link ? (
            <a href={c.link} style={{ color:c.color, fontWeight:600, fontSize:'.95rem', transition:'opacity .2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity='.7'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              {c.lines[0]}
            </a>
          ) : (
            c.lines.map(l => (
              <p key={l} style={{ fontSize:'.88rem', color:'#6b7280', lineHeight:1.6 }}>{l}</p>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function ContactPage() {
  const [form, setForm]     = useState({ name:'', phone:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState(null)
  const [loading, setLoad]  = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setStatus('error'); return }
    setLoad(true)
    setTimeout(() => { setLoad(false); setStatus('success'); setForm({ name:'', phone:'', email:'', subject:'', message:'' }) }, 1200)
  }

  const inputStyle = {
    width: '100%', padding: '.9rem 1.2rem', borderRadius: 12,
    border: '1.5px solid rgba(26,26,46,.12)', fontSize: '.95rem',
    fontFamily: "'Inter',sans-serif", color: '#1a1a2e',
    background: '#fff', outline: 'none', transition: 'border-color .2s, box-shadow .2s',
  }

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="blob" style={{ width:380, height:380, top:'-15%', right:'-5%', background:'rgba(0,180,216,.18)' }} />
        <div className="blob" style={{ width:250, height:250, bottom:'-8%', left:'8%', background:'rgba(230,57,70,.15)', animationDelay:'-4s' }} />
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <span className="label" style={{ justifyContent:'center' }}>Get In Touch</span>
          <h1>Contact <span className="grad">IndiColas</span></h1>
          <p>Find us at our factory, reach our distributor, or just drop us a message. We'd love to hear from you!</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position:'absolute', bottom:-1, left:0, width:'100%', fill:'#fff', pointerEvents:'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Info cards */}
      <section style={{ background:'#fff', padding:'5rem 0' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:.8 }}
            style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="label" style={{ justifyContent:'center' }}>Our Locations</span>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>Where To <span className="grad">Find Us</span></h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.4rem', marginBottom:'5rem' }}>
            {INFO.map((c, i) => <InfoCard key={c.title} c={c} i={i} />)}
          </div>

          {/* Contact form + image */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'start' }}>

            {/* Form */}
            <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.4rem)', marginBottom:'.75rem' }}>
                Send Us a <span className="grad">Message</span>
              </h2>
              <p style={{ color:'#6b7280', marginBottom:'2rem', lineHeight:1.7 }}>
                Whether it's a bulk order, a partnership, or just a question about our flavors — we're here.
              </p>

              {status === 'success' && (
                <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
                  style={{ background:'#d1fae5', border:'1px solid #06d6a0', borderRadius:12,
                    padding:'1rem 1.2rem', marginBottom:'1.5rem', color:'#065f46', fontWeight:600, fontSize:'.95rem' }}>
                  ✅ Message sent! We'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <div style={{ background:'#ffe4e6', border:'1px solid #e63946', borderRadius:12,
                  padding:'1rem 1.2rem', marginBottom:'1.5rem', color:'#9f1239', fontSize:'.92rem' }}>
                  Please fill in your name, email, and message.
                </div>
              )}

              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label style={{ display:'block', fontWeight:600, fontSize:'.85rem', marginBottom:'.4rem', color:'#374151' }}>Name *</label>
                    <input style={inputStyle} placeholder="Your name" value={form.name} onChange={set('name')}
                      onFocus={e => { e.target.style.borderColor='#e63946'; e.target.style.boxShadow='0 0 0 3px rgba(230,57,70,.12)' }}
                      onBlur={e => { e.target.style.borderColor='rgba(26,26,46,.12)'; e.target.style.boxShadow='none' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontWeight:600, fontSize:'.85rem', marginBottom:'.4rem', color:'#374151' }}>Phone</label>
                    <input style={inputStyle} type="tel" placeholder="Your phone" value={form.phone} onChange={set('phone')}
                      onFocus={e => { e.target.style.borderColor='#e63946'; e.target.style.boxShadow='0 0 0 3px rgba(230,57,70,.12)' }}
                      onBlur={e => { e.target.style.borderColor='rgba(26,26,46,.12)'; e.target.style.boxShadow='none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:600, fontSize:'.85rem', marginBottom:'.4rem', color:'#374151' }}>Email *</label>
                  <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')}
                    onFocus={e => { e.target.style.borderColor='#e63946'; e.target.style.boxShadow='0 0 0 3px rgba(230,57,70,.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(26,26,46,.12)'; e.target.style.boxShadow='none' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:600, fontSize:'.85rem', marginBottom:'.4rem', color:'#374151' }}>Subject</label>
                  <input style={inputStyle} placeholder="How can we help?" value={form.subject} onChange={set('subject')}
                    onFocus={e => { e.target.style.borderColor='#e63946'; e.target.style.boxShadow='0 0 0 3px rgba(230,57,70,.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(26,26,46,.12)'; e.target.style.boxShadow='none' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:600, fontSize:'.85rem', marginBottom:'.4rem', color:'#374151' }}>Message *</label>
                  <textarea style={{ ...inputStyle, minHeight:140, resize:'vertical' }}
                    placeholder="Tell us more..." value={form.message} onChange={set('message')}
                    onFocus={e => { e.target.style.borderColor='#e63946'; e.target.style.boxShadow='0 0 0 3px rgba(230,57,70,.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(26,26,46,.12)'; e.target.style.boxShadow='none' }} />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary"
                  style={{ alignSelf:'flex-start', fontSize:'1rem', padding:'1rem 2.4rem', opacity: loading ? .7 : 1 }}>
                  {loading ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            </motion.div>

            {/* Right: product image + social */}
            <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, margin:'-80px' }} transition={{ duration:.9 }}>
              <div style={{
                borderRadius:28, overflow:'hidden', marginBottom:'2rem',
                boxShadow:'0 20px 60px rgba(26,26,46,.1)',
              }}>
                <img src="/images/gemini-visual.png" alt="IndiColas"
                  style={{ width:'100%', display:'block', objectFit:'cover', maxHeight:360 }} />
              </div>

              {/* Premium social grid */}
              <div style={{
                background:'linear-gradient(135deg,#fff5e6,#fff0f5)',
                borderRadius:24, padding:'1.8rem',
                border:'1px solid rgba(230,57,70,.08)',
                boxShadow:'0 10px 30px rgba(230,57,70,.06)',
              }}>
                <h4 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, marginBottom:'1.2rem', fontSize:'1rem' }}>Follow Us</h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                  {SOCIALS.map(s => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        display:'flex', alignItems:'center', gap:'.75rem',
                        padding:'1rem',
                        background:'#fff', borderRadius:14,
                        transition:'transform .25s, box-shadow .25s, background .25s, color .25s',
                        boxShadow:'0 2px 12px rgba(26,26,46,.06)',
                        color: '#1a1a2e',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform='translateY(-3px) scale(1.02)'
                        e.currentTarget.style.boxShadow=`0 14px 32px ${s.color}30`
                        e.currentTarget.style.background = `linear-gradient(135deg, ${s.color}, ${s.color}cc)`
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform='none'
                        e.currentTarget.style.boxShadow='0 2px 12px rgba(26,26,46,.06)'
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.color = '#1a1a2e'
                      }}
                    >
                      <span style={{ display:'flex', alignItems:'center', color:'inherit' }}>
                        <s.Icon size={20} />
                      </span>
                      <div style={{ overflow:'hidden' }}>
                        <div style={{ fontWeight:700, fontSize:'.88rem', lineHeight:1.1 }}>{s.name}</div>
                        <div style={{ fontSize:'.74rem', opacity:.65, marginTop:2 }}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          .contact-grid{grid-template-columns:1fr!important}
          .contact-form-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  )
}
