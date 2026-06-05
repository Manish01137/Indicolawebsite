import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  InstagramIcon, FacebookIcon, TwitterIcon, YouTubeIcon,
  MapPinIcon, PhoneIcon, MailIcon,
} from './SocialIcons'

const FLAVORS = [
  'Berry Magma','Pinachi','Coco Berry','Americano Ice Cream',
  'Cotton Candy','Green Twister','Cherry Cola','Citrus Blast',
  'Strawberry Margarita','Ginger Lime','Peach Punch','Fruitbeer With Malt',
]

const SOCIALS = [
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com', color: '#E1306C' },
  { Icon: FacebookIcon,  label: 'Facebook',  href: 'https://facebook.com',  color: '#1877F2' },
  { Icon: TwitterIcon,   label: 'Twitter',   href: 'https://twitter.com',   color: '#1a1a1a' },
  { Icon: YouTubeIcon,   label: 'YouTube',   href: 'https://youtube.com',   color: '#FF0033' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0a0a18 0%, #0f0f1e 60%, #050510 100%)',
      color: '#fff',
      padding: '5rem 0 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Rainbow top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg,#e63946,#f77f00,#ffd166,#06d6a0,#00b4d8,#9b5de5,#ff70a6)',
        boxShadow: '0 0 20px rgba(230,57,70,.4)',
      }} />

      {/* Glow accents */}
      <div style={{
        position: 'absolute', top: 100, left: '-10%', width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(230,57,70,.08), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -200, right: -100, width: 550, height: 550,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,93,229,.06), transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Subtle noise grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04, mixBlendMode: 'overlay', pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid" style={{
          display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.8fr', gap: '3.5rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1.2rem' }}>
              <img src="/images/logo.png" alt="IndiColas"
                style={{ height: 50, filter: 'brightness(10)' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,.55)', lineHeight: 1.8, fontSize: '.92rem', maxWidth: 320, marginBottom: '1.8rem' }}>
              Heritage-inspired sodas bringing India's iconic Goli Soda culture to the USA — crafted with premium ingredients and 12 vibrant, bold flavors.
            </p>

            {/* Premium social icons */}
            <div style={{ display: 'flex', gap: '.7rem' }}>
              {SOCIALS.map(({ Icon, label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,.78)',
                    transition: 'background .25s, color .25s, transform .25s, box-shadow .25s, border-color .25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = color
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.06)'
                    e.currentTarget.style.boxShadow = `0 12px 28px ${color}66`
                    e.currentTarget.style.borderColor = color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,.06)'
                    e.currentTarget.style.color = 'rgba(255,255,255,.78)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: .1 }}
          >
            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '1.4rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
              {[
                { label: 'Home',        to: '/' },
                { label: 'About',       to: '/about' },
                { label: 'History',     to: '/history' },
                { label: 'Our Flavors', to: '/flavors' },
                { label: 'Outlets',     to: '/outlets' },
                { label: 'Contact',     to: '/contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={{
                    color: 'rgba(255,255,255,.6)',
                    fontSize: '.94rem',
                    transition: 'color .2s, letter-spacing .2s',
                    display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f77f00'; e.currentTarget.style.letterSpacing = '.02em' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.6)'; e.currentTarget.style.letterSpacing = '0' }}
                  >
                    <span style={{ width: 8, height: 1, background: 'currentColor' }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Flavors + Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: .2 }}
          >
            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '1.4rem' }}>
              Our 12 Flavors
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem .9rem', marginBottom: '2.2rem' }}>
              {FLAVORS.map(f => (
                <Link key={f} to="/flavors"
                  style={{ color: 'rgba(255,255,255,.45)', fontSize: '.82rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}
                >
                  {f}
                </Link>
              ))}
            </div>

            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '1rem' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', color: 'rgba(255,255,255,.55)', fontSize: '.85rem', lineHeight: 1.55 }}>
                <span style={{ color: '#f77f00', marginTop: 2, flexShrink: 0 }}><MapPinIcon size={15} /></span>
                <span>790 Chamberlin Dr., Beaumont, TX 77707</span>
              </div>
              <a href="tel:8653353884" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'rgba(255,255,255,.55)', fontSize: '.85rem', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f77f00'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
              >
                <span style={{ color: '#f77f00', flexShrink: 0 }}><PhoneIcon size={15} /></span>
                (865) 335-3884
              </a>
              <a href="mailto:indicolasus@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'rgba(255,255,255,.55)', fontSize: '.85rem', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f77f00'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
              >
                <span style={{ color: '#f77f00', flexShrink: 0 }}><MailIcon size={15} /></span>
                indicolasus@gmail.com
              </a>
            </div>
          </motion.div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,.06)',
          padding: '1.6rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem' }}>
            © {new Date().getFullYear()} IndiColas / Indicola Beverages LLC. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Crafted with <span style={{ color: '#e63946' }}>♥</span> in the USA
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important;gap:2.5rem!important}}
      `}</style>
    </footer>
  )
}
