import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'Home',        to: '/' },
  { label: 'About',       to: '/about' },
  { label: 'History',     to: '/history' },
  { label: 'Our Flavors', to: '/flavors' },
  { label: 'Outlets',     to: '/outlets' },
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

  /* Close drawer on route change */
  useEffect(() => { setOpen(false) }, [pathname])

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isHome = pathname === '/'

  return (
    <>
      <nav
        className="navbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 'var(--nav-h)',
          display: 'flex', alignItems: 'center',
          padding: '0 clamp(1rem, 2.5vw, 2.5rem)',
          transition: 'background .35s, box-shadow .35s, -webkit-backdrop-filter .35s, backdrop-filter .35s',
          background: scrolled || !isHome ? 'rgba(255,253,245,.92)' : 'rgba(255,253,245,0)',
          WebkitBackdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
          backdropFilter:        scrolled || !isHome ? 'blur(20px)' : 'none',
          boxShadow: scrolled || !isHome ? '0 1px 28px rgba(26,26,46,.07)' : 'none',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexShrink: 0 }}>
          <img
            src="/images/logo.png"
            alt="IndiColas"
            style={{ height: 'clamp(36px, 5vw, 44px)', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', margin: '0 auto' }}>
          {NAV.map(n => {
            const active = pathname === n.to
            return (
              <Link
                key={n.to}
                to={n.to}
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 600, fontSize: '.88rem',
                  color: active ? '#e63946' : '#1a1a2e',
                  letterSpacing: '.01em', position: 'relative', paddingBottom: 3,
                  transition: 'color .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#e63946'}
                onMouseLeave={e => e.currentTarget.style.color = active ? '#e63946' : '#1a1a2e'}
              >
                {n.label}
                {active && (
                  <motion.div
                    layoutId="nav-ul"
                    style={{
                      position: 'absolute', bottom: -2, left: 0, right: 0,
                      height: 2, background: '#e63946', borderRadius: 2,
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <Link
          to="/contact"
          className="nav-cta btn btn-primary"
          style={{ fontSize: '.84rem', padding: '.6rem 1.4rem' }}
        >
          Find A Store
        </Link>

        {/* Mobile hamburger — proper 44x44 tap target */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{
            marginLeft: 'auto',
            width: 44, height: 44, padding: 0,
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'none',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'relative',
            width: 26, height: 18,
            display: 'inline-block',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                position: 'absolute', left: 0, right: 0,
                top: open ? '50%' : `${i * 8}px`,
                height: 2, background: '#1a1a2e',
                borderRadius: 2,
                transformOrigin: 'center',
                transition: 'top .25s ease, transform .25s ease .05s, opacity .15s ease',
                transform: open
                  ? i === 0 ? 'translateY(-50%) rotate(45deg)'
                  : i === 1 ? 'translateY(-50%) scaleX(0)'
                  : 'translateY(-50%) rotate(-45deg)'
                  : 'translateY(0) rotate(0)',
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 998,
                background: 'rgba(26,26,46,.45)',
                WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(86%, 360px)',
                zIndex: 999, background: '#fffdf5',
                boxShadow: '-8px 0 40px rgba(26,26,46,.18)',
                padding: 'calc(var(--nav-h) + 1.5rem) 1.75rem 2rem',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                overflowY: 'auto',
              }}
            >
              {NAV.map((n, i) => {
                const active = pathname === n.to
                return (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        color: active ? '#e63946' : '#1a1a2e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 0',
                        borderBottom: '1px solid rgba(26,26,46,.06)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      <span>{n.label}</span>
                      <span style={{
                        color: active ? '#e63946' : '#cbd5e1',
                        fontSize: '1.1rem',
                      }}>→</span>
                    </Link>
                  </motion.div>
                )
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                style={{ marginTop: 'auto', paddingTop: '1.5rem' }}
              >
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '.95rem',
                    padding: '1rem 1.5rem',
                  }}
                >
                  Find A Store →
                </Link>
                <p style={{
                  marginTop: '1.2rem',
                  fontSize: '.72rem',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#9ca3af',
                  textAlign: 'center',
                  fontWeight: 700,
                }}>
                  Pop The Fizz ★
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Breakpoint: desktop ≥ 900px, mobile drawer < 900px */}
      <style>{`
        @media(max-width: 899px){
          .nav-links{ display: none !important; }
          .nav-cta{ display: none !important; }
          .nav-hamburger{ display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
