import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { MapPinIcon, ArrowIcon } from '../components/SocialIcons'
import { useTilt, useDevice } from '../hooks/useTilt'

/* ─────────── OUTLET DATA — 23 retail locations from heylink.me/indicola001 ─────────── */
const OUTLETS = [
  { name: 'Butterflies (Sunshine)',              type: 'Convenience',  url: 'https://share.google/JaXjdZ2aVu8HccnJX' },
  { name: 'Conoco',                              type: 'Gas Station',  url: 'https://share.google/dhJbllkoFZBEPEf2n' },
  { name: 'The Plug Smoke Shop',                 type: 'Smoke Shop',   url: 'https://share.google/53eZ5gMPT17hTRRmG' },
  { name: 'Delta Food Mart',                     type: 'Convenience',  url: 'https://share.google/ktgVzZzGTLPMwI7ej' },
  { name: 'Orange County Star Stop',             type: 'Gas Station',  url: 'https://share.google/BzZbbDtwEwy1bcLOG' },
  { name: 'Chevron',                             type: 'Gas Station',  url: 'https://share.google/Mxwfv59izQAvCeJ6p' },
  { name: 'Stars',                               type: 'Convenience',  url: 'https://share.google/HHkNm1eCLCEIepJ7k' },
  { name: 'Smoke Shack',                         type: 'Smoke Shop',   url: 'https://share.google/RTgidmuDoX5AXCMhA' },
  { name: "Smoker's Club Smoke Shop",            type: 'Smoke Shop',   url: 'https://share.google/LGSFYxKCO494bCj4H' },
  { name: 'Desi Dhaba',                          type: 'Restaurant',   url: 'https://share.google/nNCqYgO4acy5dcaTx' },
  { name: 'Nederland Quick Stop — Vapor & CBD',  type: 'Convenience',  url: 'https://share.google/FQZaNw6VFmP3s66Ms' },
  { name: 'Tiger Speedy Stop',                   type: 'Convenience',  url: 'https://share.google/e8InL3vRsQrfI7QkR' },
  { name: 'Packo / EZ Food Mart',                type: 'Convenience',  url: 'https://share.google/U2XfmsPBgdJWoiiNZ' },
  { name: 'Needz Stop',                          type: 'Convenience',  url: 'https://share.google/pD8dQutXMTTNXduto' },
  { name: 'K-1',                                 type: 'Convenience',  url: 'https://share.google/22C90sMKNUqmQJ8ly' },
  { name: 'Everyday Shell',                      type: 'Gas Station',  url: 'https://share.google/pbf6LAe7fsj2pe3jp' },
  { name: 'Kajun Seafood and Wings',             type: 'Restaurant',   url: 'https://share.google/uKyXvmQQ9myOxV2dD' },
  { name: 'Mauriceville Fuel Stop',              type: 'Gas Station',  url: 'https://share.google/v38oZfY5kWAaOn8lr' },
  { name: 'Shop N Save',                         type: 'Grocery',      url: 'https://share.google/YQ31lgAXUZzZWqKYo' },
  { name: "Ali's Tobacco Plus",                  type: 'Smoke Shop',   url: 'https://share.google/cdKfbDTt5kKq7GgSk' },
  { name: 'Desi Mart Indo-Pak Groceries',        type: 'Grocery',      url: 'https://share.google/BR9BXZxnn9773mQ0W' },
  { name: 'Country Market',                      type: 'Grocery',      url: 'https://share.google/uE3aVN9spW1xWjAtY' },
  { name: 'Twin City Mart Liquor',               type: 'Liquor Store', url: 'https://share.google/7sbzfpnY17YCzxgTg' },
]

const TYPE_META = {
  'Convenience':  { color: '#f77f00', bg: '#fff3e0', icon: '🏪', desc: 'Quick stop — grab & go' },
  'Gas Station':  { color: '#e63946', bg: '#ffe4e6', icon: '⛽', desc: 'Fill up + fizz up' },
  'Smoke Shop':   { color: '#9b5de5', bg: '#f3e8ff', icon: '💨', desc: 'Specialty retail partner' },
  'Grocery':      { color: '#06d6a0', bg: '#d1fae5', icon: '🛒', desc: 'Pick up your weekly stash' },
  'Restaurant':   { color: '#ff70a6', bg: '#fce7f3', icon: '🍽️', desc: 'Pair it with great food' },
  'Liquor Store': { color: '#00b4d8', bg: '#e0f7fa', icon: '🍾', desc: 'Premium beverage destination' },
}

const TYPES = ['All', 'Convenience', 'Gas Station', 'Smoke Shop', 'Grocery', 'Restaurant', 'Liquor Store']

/* ─────────── OUTLET CARD with tilt ─────────── */
function OutletCard({ outlet, index, isMobile }) {
  const tiltRef = useTilt({ intensity: 11, scale: 1.03 })
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const meta = TYPE_META[outlet.type] || TYPE_META['Convenience']

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
      style={{ perspective: 1100 }}
    >
      <div
        ref={isMobile ? null : tiltRef}
        style={{
          background: '#fff', borderRadius: 22, overflow: 'hidden',
          border: `1px solid ${meta.color}22`,
          boxShadow: `0 12px 28px ${meta.color}14, 0 2px 8px rgba(26,26,46,.05)`,
          transition: 'box-shadow .35s, transform .4s',
          transformStyle: 'preserve-3d',
          height: '100%',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Top color band */}
        <div style={{
          height: 6,
          background: `linear-gradient(90deg, ${meta.color}, ${meta.color}cc)`,
        }} />

        <div style={{ padding: '1.5rem 1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '.8rem', flex: 1 }}>
          {/* Icon + type pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.6rem' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: `0 8px 20px ${meta.color}55, inset 0 1px 0 rgba(255,255,255,.25)`,
            }}>{meta.icon}</div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.35rem',
              padding: '.3rem .75rem',
              background: meta.bg,
              borderRadius: 9999,
              fontFamily: "'Sora',sans-serif",
              fontSize: '.7rem', fontWeight: 700,
              letterSpacing: '.08em', textTransform: 'uppercase',
              color: meta.color,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: meta.color,
                boxShadow: `0 0 8px ${meta.color}`,
              }} />
              {outlet.type}
            </div>
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: '1.05rem', fontWeight: 700,
            color: '#1a1a2e', lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}>{outlet.name}</h3>

          {/* Description */}
          <p style={{
            fontSize: '.84rem', color: '#6b7280',
            lineHeight: 1.55, marginTop: '-.2rem',
            flex: 1,
          }}>{meta.desc}</p>

          {/* CTA */}
          <a
            href={outlet.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '.5rem',
              marginTop: '.4rem',
              padding: '.75rem 1rem',
              background: meta.bg,
              color: meta.color,
              borderRadius: 12,
              fontFamily: "'Sora',sans-serif",
              fontSize: '.85rem', fontWeight: 700,
              transition: 'background .2s, color .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = meta.color
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = meta.bg
              e.currentTarget.style.color = meta.color
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
              <MapPinIcon size={14} /> Get Directions
            </span>
            <ArrowIcon size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────── OUTLETS PAGE ─────────── */
export default function OutletsPage() {
  const [active, setActive] = useState('All')
  const [query,  setQuery]  = useState('')
  const { isMobile } = useDevice()

  const counts = useMemo(() => {
    const out = { All: OUTLETS.length }
    OUTLETS.forEach(o => { out[o.type] = (out[o.type] || 0) + 1 })
    return out
  }, [])

  const filtered = useMemo(() => {
    return OUTLETS.filter(o => {
      if (active !== 'All' && o.type !== active) return false
      if (query && !o.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [active, query])

  return (
    <>
      {/* Page hero */}
      <section className="page-hero" style={{
        background: 'linear-gradient(135deg,#fff8f0,#fff3f8,#f0fffe)',
      }}>
        <div className="blob" style={{ width: 380, height: 380, top: '-15%', right: '-5%', background: 'rgba(247,127,0,.18)' }} />
        <div className="blob" style={{ width: 260, height: 260, bottom: '-10%', left: '5%', background: 'rgba(155,93,229,.18)', animationDelay: '-3s' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ justifyContent: 'center' }}>
            Where To Find Us · {OUTLETS.length} Retail Partners
          </span>
          <h1>Find IndiColas<br /><span className="grad">Near You.</span></h1>
          <p>
            From convenience stores to specialty retailers — our growing network of partners across Texas keeps the fizz flowing. Tap any location below to get directions on Google Maps.
          </p>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', fill: '#fff', pointerEvents: 'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* Filter + grid */}
      <section style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 7vw, 6rem)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">

          {/* Search input */}
          <div style={{
            maxWidth: 520, margin: '0 auto 2rem',
            position: 'relative',
          }}>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search outlets by name…"
              style={{
                width: '100%', padding: '.95rem 3rem .95rem 1.4rem',
                borderRadius: 9999, border: '1.5px solid rgba(26,26,46,.1)',
                fontSize: '.95rem', fontFamily: "'Inter',sans-serif",
                background: '#fff', outline: 'none',
                boxShadow: '0 4px 16px rgba(26,26,46,.05)',
                transition: 'border-color .2s, box-shadow .2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#e63946'
                e.target.style.boxShadow = '0 0 0 3px rgba(230,57,70,.12)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(26,26,46,.1)'
                e.target.style.boxShadow = '0 4px 16px rgba(26,26,46,.05)'
              }}
            />
            <span style={{
              position: 'absolute', right: '1.2rem', top: '50%',
              transform: 'translateY(-50%)', color: '#9ca3af',
              fontSize: '1rem', pointerEvents: 'none',
            }}>🔎</span>
          </div>

          {/* Filter chips */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '.5rem',
            justifyContent: 'center', marginBottom: '3rem',
          }}>
            {TYPES.map(t => {
              const m = TYPE_META[t]
              const isActive = active === t
              return (
                <button key={t} onClick={() => setActive(t)}
                  style={{
                    padding: '.55rem 1.1rem', borderRadius: 9999,
                    fontFamily: "'Sora',sans-serif", fontSize: '.8rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all .2s', border: 'none',
                    background: isActive
                      ? (m ? m.color : '#e63946')
                      : 'rgba(26,26,46,.06)',
                    color: isActive ? '#fff' : '#6b7280',
                    boxShadow: isActive
                      ? `0 4px 16px ${(m ? m.color : '#e63946')}55`
                      : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                  }}
                >
                  {m && <span>{m.icon}</span>}
                  {t}
                  <span style={{
                    fontSize: '.68rem',
                    padding: '.1rem .45rem',
                    borderRadius: 9999,
                    background: isActive ? 'rgba(255,255,255,.25)' : 'rgba(26,26,46,.08)',
                  }}>{counts[t] || 0}</span>
                </button>
              )
            })}
          </div>

          {/* Results count */}
          <div style={{
            textAlign: 'center', marginBottom: '2rem',
            fontFamily: "'Sora',sans-serif",
            fontSize: '.78rem', fontWeight: 700,
            letterSpacing: '.14em', textTransform: 'uppercase',
            color: '#9ca3af',
          }}>
            {filtered.length === 0
              ? 'No matches — try a different filter'
              : `Showing ${filtered.length} ${filtered.length === 1 ? 'outlet' : 'outlets'}`
            }
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.4rem',
          }}>
            {filtered.map((o, i) => (
              <OutletCard key={o.name} outlet={o} index={i} isMobile={isMobile} />
            ))}
          </div>

          {/* No results */}
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem',
              color: '#9ca3af', fontSize: '.9rem',
            }}>
              No outlets found. Try clearing your search or selecting a different category.
            </div>
          )}

          {/* Retailer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              marginTop: '4rem',
              padding: '2.5rem 2rem',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #fff5e6, #fff0f5)',
              border: '1px solid rgba(230,57,70,.12)',
              textAlign: 'center',
              maxWidth: 720, margin: '4rem auto 0',
            }}
          >
            <span className="label" style={{ justifyContent: 'center' }}>For Retailers</span>
            <h3 style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 'clamp(1.5rem, 3.2vw, 2rem)',
              fontWeight: 700,
              marginBottom: '.75rem',
              letterSpacing: '-0.02em',
            }}>
              Want IndiColas <span className="grad">In Your Store?</span>
            </h3>
            <p style={{
              color: '#4b5563', fontSize: '1rem',
              lineHeight: 1.7, marginBottom: '1.6rem',
              maxWidth: 520, margin: '0 auto 1.6rem',
            }}>
              Join our growing network of retail partners. Wholesale pricing, fast delivery, and POS support for stores across Texas and beyond.
            </p>
            <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to="/contact"
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
              >
                Become a Partner →
              </Link>
              <a
                href="https://heylink.me/indicola001/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
              >
                View Full Directory
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
