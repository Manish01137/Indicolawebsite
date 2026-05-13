import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'Home',        to: '/' },
  { label: 'About',       to: '/about' },
  { label: 'History',     to: '/history' },
  { label: 'Our Flavors', to: '/flavors' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { pathname }            = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const isHome = pathname === '/'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
        padding: '0 2.5rem',
        transition: 'background .35s, box-shadow .35s, -webkit-backdrop-filter .35s, backdrop-filter .35s',
        background: scrolled || !isHome ? 'rgba(255,253,245,.92)' : 'rgba(255,253,245,0)',
        WebkitBackdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
        backdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
        boxShadow: scrolled || !isHome ? '0 1px 28px rgba(26,26,46,.07)' : 'none',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0 }}>
          <img src="/images/logo.png" alt="IndiColas" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2rem', margin: '0 auto' }} className="hide-sm">
          {NAV.map(n => {
            const active = pathname === n.to
            return (
              <Link key={n.to} to={n.to} style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: '.88rem',
                color: active ? '#e63946' : '#1a1a2e',
                letterSpacing: '.01em', position: 'relative', paddingBottom: 3,
                transition: 'color .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
                onMouseLeave={e => e.currentTarget.style.color = active ? '#e63946' : '#1a1a2e'}
              >
                {n.label}
                {active && (
                  <motion.div layoutId="nav-ul" style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0,
                    height: 2, background: '#e63946', borderRadius: 2,
                  }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <Link to="/contact" className="btn btn-primary hide-sm"
          style={{ fontSize: '.84rem', padding: '.6rem 1.4rem' }}>
          Find A Store
        </Link>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)}
          style={{ marginLeft: 'auto', padding: 4, display: 'none' }}
          className="show-sm" aria-label="menu">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 25, height: 2, background: '#1a1a2e',
              borderRadius: 2, marginBottom: i < 2 ? 5 : 0,
              transformOrigin: 'center', transition: 'transform .3s,opacity .3s',
              transform: open
                ? i===0 ? 'rotate(45deg) translate(5px,5px)'
                : i===1 ? 'scaleX(0)' : 'rotate(-45deg) translate(5px,-5px)'
                : 'none',
              opacity: open && i===1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: 340,
              zIndex: 999, background: '#fffdf5',
              boxShadow: '-8px 0 40px rgba(26,26,46,.12)',
              padding: '6rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
            }}>
            {NAV.map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={n.to} style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '1.4rem',
                  color: pathname === n.to ? '#e63946' : '#1a1a2e',
                  display: 'block', borderBottom: '1px solid rgba(26,26,46,.06)', paddingBottom: '1rem',
                }}>
                  {n.label}
                </Link>
              </motion.div>
            ))}
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              Find A Store
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(26,26,46,.35)',
        }} />
      )}

      <style>{`@media(max-width:768px){.hide-sm{display:none!important}.show-sm{display:flex!important}}`}</style>
    </>
  )
}
