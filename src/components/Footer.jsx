import { Link } from 'react-router-dom'

const FLAVORS = [
  'Berry Magma','Pinachi','Coco Berry','Americano Ice Cream',
  'Cotton Candy','Green Twister','Cherry Cola','Citrus Blast',
  'Strawberry Margarita','Ginger Lime','Peach Punch','Fruitbeer With Malt',
]

export default function Footer() {
  return (
    <footer style={{ background: '#0f0f1e', color: '#fff', padding: '4.5rem 0 0', position: 'relative', overflow: 'hidden' }}>
      {/* Rainbow top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg,#e63946,#f77f00,#ffd166,#06d6a0,#00b4d8,#9b5de5,#ff70a6)',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', bottom: -200, right: -100, width: 550, height: 550,
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,.07),transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.8fr', gap: '3.5rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand */}
          <div>
            <img src="/images/logo.png" alt="IndiColas" style={{ height: 50, marginBottom: '1.2rem', filter: 'brightness(10)' }} />
            <p style={{ color: 'rgba(255,255,255,.5)', lineHeight: 1.75, fontSize: '.9rem', maxWidth: 280, marginBottom: '1.5rem' }}>
              Heritage-inspired sodas bringing India's iconic Goli Soda culture to the USA with 12 vibrant, bold flavors.
            </p>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              {[
                { label: 'Facebook',  href: 'https://facebook.com',  icon: '𝔽' },
                { label: 'Instagram', href: 'https://instagram.com', icon: '📸' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', transition: 'background .2s,transform .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e63946'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.transform = 'none' }}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '1.2rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {[
                { label: 'Home',        to: '/' },
                { label: 'About',       to: '/about' },
                { label: 'History',     to: '/history' },
                { label: 'Our Flavors', to: '/flavors' },
                { label: 'Contact',     to: '/contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={{ color: 'rgba(255,255,255,.55)', fontSize: '.92rem', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f77f00'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Flavors + Contact */}
          <div>
            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '1.2rem' }}>
              Our Flavors
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem .75rem', marginBottom: '2rem' }}>
              {FLAVORS.map(f => (
                <Link key={f} to="/flavors" style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}
                >
                  {f}
                </Link>
              ))}
            </div>

            <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '.8rem' }}>
              Contact
            </h4>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.82rem', lineHeight: 1.7 }}>
              📍 790 Chamberlin Dr., Beaumont, TX 77707<br />
              📞 (865) 335-3884<br />
              ✉️ indicolasus@gmail.com
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,.07)',
          padding: '1.4rem 0', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>
            © {new Date().getFullYear()} IndiColas / Indicola Beverages LLC. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>Made with ❤️ in the USA</p>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){footer .container > div:first-child{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  )
}
