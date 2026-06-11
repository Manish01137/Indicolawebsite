import { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'

import { supabase, isSupabaseConfigured, REVIEWS_TABLE } from '../lib/supabase'
import { FLAVORS } from '../data/flavors'
import { StarIcon, ArrowIcon, QuoteIcon } from '../components/SocialIcons'
import { useDevice, useTilt } from '../hooks/useTilt'
import SplitText from '../components/SplitText'

/* ─────────── HELPERS ─────────── */
function timeAgo(date) {
  const d = new Date(date)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60)        return `${s}s ago`
  if (s < 3600)      return `${Math.floor(s/60)}m ago`
  if (s < 86400)     return `${Math.floor(s/3600)}h ago`
  if (s < 86400*7)   return `${Math.floor(s/86400)}d ago`
  if (s < 86400*30)  return `${Math.floor(s/(86400*7))}w ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
const initials = (n='') => n.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('')
const flavorByslug = (s) => FLAVORS.find(f => f.slug === s)
const stableColor = (key) => {
  const palette = ['#e63946','#f77f00','#06d6a0','#9b5de5','#ff70a6','#00b4d8','#ffb347','#7c3aed','#ff4d6d','#f4a261']
  let h = 0
  for (let i = 0; i < (key||'').length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0
  return palette[Math.abs(h) % palette.length]
}

/* ─────────── STAR PICKER ─────────── */
function StarPicker({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'inline-flex', gap: '.35rem' }} onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 4, color: n <= (hover || value) ? '#f5b500' : 'rgba(26,26,46,.16)',
            transition: 'transform .15s, color .15s',
            transform: hover === n ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-flex',
          }}
        >
          <StarIcon size={size} />
        </button>
      ))}
    </div>
  )
}

/* ─────────── STARS DISPLAY ─────────── */
function Stars({ value, size = 14 }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, color: '#f5b500' }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ display: 'inline-flex', opacity: n <= value ? 1 : 0.2 }}>
          <StarIcon size={size} />
        </span>
      ))}
    </div>
  )
}

/* ─────────── REVIEW CARD ─────────── */
function ReviewCard({ r, isMobile }) {
  const ref = useRef(null)
  const tiltRef = useTilt({ intensity: 8, scale: 1.015 })
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const flavor = r.flavor_slug ? flavorByslug(r.flavor_slug) : null
  const accent = flavor?.color || stableColor(r.name)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ perspective: 1100 }}
    >
      <div ref={isMobile ? null : tiltRef}
        style={{
          background: '#fff', borderRadius: 22,
          padding: '1.5rem 1.5rem 1.6rem',
          boxShadow: `0 10px 28px ${accent}1a, 0 2px 6px rgba(26,26,46,.04)`,
          border: `1px solid ${accent}1f`,
          position: 'relative', overflow: 'hidden',
          transformStyle: 'preserve-3d',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Featured ribbon */}
        {r.is_featured && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            padding: '.25rem .55rem', borderRadius: 9999,
            background: 'linear-gradient(135deg, #f5b500, #f77f00)',
            color: '#fff', fontSize: '.6rem', fontWeight: 800,
            letterSpacing: '.12em', textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(245,181,0,.4)',
          }}>
            ★ Featured
          </div>
        )}

        {/* Big watermark quote */}
        <span style={{
          position: 'absolute', bottom: -22, right: -10,
          color: accent, opacity: 0.07, pointerEvents: 'none',
        }}>
          <QuoteIcon size={120} />
        </span>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.85rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            color: '#fff', fontFamily: "'Sora',sans-serif",
            fontWeight: 800, fontSize: '.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 14px ${accent}40, inset 0 1px 0 rgba(255,255,255,.3)`,
            flexShrink: 0,
          }}>
            {initials(r.name) || '★'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 700,
              fontSize: '.95rem', color: '#1a1a2e',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{r.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: 2 }}>
              <Stars value={r.rating} size={12} />
              <span style={{ fontSize: '.7rem', color: '#9ca3af' }}>· {timeAgo(r.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        {r.title && (
          <h4 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: '1rem', fontWeight: 700,
            color: '#1a1a2e', marginBottom: '.4rem',
            lineHeight: 1.3,
          }}>{r.title}</h4>
        )}

        {/* Body */}
        <p style={{
          fontSize: '.92rem', color: '#4b5563',
          lineHeight: 1.65, flex: 1,
          margin: 0,
          /* clamp to 6 lines max — looks tidy in the wall */
          display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {r.body}
        </p>

        {/* Footer chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {flavor && (
            <Link to={`/flavor/${flavor.slug}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                padding: '.3rem .7rem', borderRadius: 9999,
                background: flavor.bg, color: flavor.color,
                fontFamily: "'Sora',sans-serif",
                fontSize: '.7rem', fontWeight: 700,
                letterSpacing: '.08em', textTransform: 'uppercase',
                textDecoration: 'none',
                border: `1px solid ${flavor.color}28`,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: flavor.color }} />
              {flavor.name}
            </Link>
          )}
          {!flavor && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '.35rem',
              padding: '.3rem .7rem', borderRadius: 9999,
              background: 'rgba(26,26,46,.06)', color: '#6b7280',
              fontFamily: "'Sora',sans-serif",
              fontSize: '.7rem', fontWeight: 700,
              letterSpacing: '.08em', textTransform: 'uppercase',
            }}>
              ★ Brand
            </span>
          )}
          {r.location && (
            <span style={{
              fontSize: '.7rem', color: '#9ca3af', fontWeight: 600,
              fontFamily: "'Sora',sans-serif",
              letterSpacing: '.04em',
            }}>
              📍 {r.location}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────── SUBMIT FORM ─────────── */
function ReviewForm({ onSubmitted }) {
  const [name, setName]       = useState('')
  const [location, setLoc]    = useState('')
  const [rating, setRating]   = useState(5)
  const [title, setTitle]     = useState('')
  const [body, setBody]       = useState('')
  const [flavor, setFlavor]   = useState('')
  const [honeypot, setHp]     = useState('')   /* anti-spam */
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState(null) /* null | 'ok' | 'error' */
  const [errMsg, setErrMsg]   = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (!isSupabaseConfigured || !supabase) {
      setStatus('error'); setErrMsg('Reviews backend is not connected yet. Run the SQL schema in Supabase first.'); return
    }
    if (!name.trim() || !body.trim() || body.trim().length < 4) {
      setStatus('error'); setErrMsg('Please add your name and a review (at least 4 characters).'); return
    }
    setLoading(true)
    const { error } = await supabase.from(REVIEWS_TABLE).insert({
      name: name.trim(),
      location: location.trim() || null,
      rating,
      title: title.trim() || null,
      body: body.trim(),
      flavor_slug: flavor || null,
      honeypot,
    })
    setLoading(false)
    if (error) {
      setStatus('error'); setErrMsg(error.message)
      return
    }
    setStatus('ok')
    setName(''); setLoc(''); setRating(5); setTitle(''); setBody(''); setFlavor(''); setHp('')
    onSubmitted?.()
    setTimeout(() => setStatus(null), 4500)
  }

  const inputStyle = {
    width: '100%', padding: '.85rem 1.1rem', borderRadius: 12,
    border: '1.5px solid rgba(26,26,46,.1)', fontSize: '.95rem',
    fontFamily: "'Inter',sans-serif", color: '#1a1a2e',
    background: '#fff', outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        background: '#fff', borderRadius: 26,
        padding: 'clamp(1.5rem, 3vw, 2.4rem)',
        boxShadow: '0 18px 50px rgba(26,26,46,.08), 0 2px 8px rgba(26,26,46,.04)',
        border: '1px solid rgba(26,26,46,.05)',
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: '1.6rem' }}>
        <span style={{
          display: 'inline-block',
          fontFamily: "'Sora',sans-serif",
          fontSize: '.7rem', fontWeight: 700,
          letterSpacing: '.16em', textTransform: 'uppercase',
          color: '#e63946',
          padding: '.35rem .85rem',
          background: '#ffe4e6', borderRadius: 9999,
          marginBottom: '.8rem',
        }}>
          ★ Write a Review
        </span>
        <h3 style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: 800, letterSpacing: '-0.02em',
          color: '#1a1a2e',
        }}>
          Share Your <span style={{ color: '#e63946' }}>Fizz Story</span>
        </h3>
        <p style={{ fontSize: '.9rem', color: '#6b7280', marginTop: '.4rem' }}>
          Real reviews from real sippers. Your words help others discover their next favourite flavour.
        </p>
      </div>

      {/* Star + Flavor row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end', marginBottom: '1.2rem' }}>
        <div>
          <label style={labelCss}>Your Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={labelCss}>About a flavor? (optional)</label>
          <select value={flavor} onChange={e => setFlavor(e.target.value)} style={inputStyle}>
            <option value="">Overall brand review</option>
            {FLAVORS.map(f => (
              <option key={f.slug} value={f.slug}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Name + Location */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }} className="form-row-2">
        <div>
          <label style={labelCss}>Your Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Sam K." maxLength={80} required style={inputStyle} />
        </div>
        <div>
          <label style={labelCss}>Location (optional)</label>
          <input value={location} onChange={e => setLoc(e.target.value)} placeholder="Beaumont, TX" maxLength={80} style={inputStyle} />
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={labelCss}>Headline (optional)</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="My new favorite cola!" maxLength={120} style={inputStyle} />
      </div>

      {/* Body */}
      <div style={{ marginBottom: '1.4rem' }}>
        <label style={labelCss}>Your Review *</label>
        <textarea value={body} onChange={e => setBody(e.target.value)}
          placeholder="What did you love? When did you try it? Would you recommend it?"
          rows={4} maxLength={2000} required
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.55 }}
        />
        <div style={{ fontSize: '.7rem', color: '#9ca3af', marginTop: '.35rem', textAlign: 'right' }}>
          {body.length}/2000
        </div>
      </div>

      {/* Honeypot — hidden from humans */}
      <div style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden' }} aria-hidden>
        <label>Don't fill this</label>
        <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHp(e.target.value)} />
      </div>

      {/* Status */}
      <AnimatePresence>
        {status === 'ok' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: '.85rem 1.1rem', borderRadius: 12, marginBottom: '1rem',
              background: '#d1fae5', color: '#065f46', fontWeight: 600, fontSize: '.92rem',
              border: '1px solid #06d6a055',
            }}
          >
            ✅ Thanks! Your review is live on the wall.
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: '.85rem 1.1rem', borderRadius: 12, marginBottom: '1rem',
              background: '#ffe4e6', color: '#9f1239', fontWeight: 600, fontSize: '.88rem',
              border: '1px solid #e6394655',
            }}
          >
            ⚠ {errMsg || 'Something went wrong. Please try again.'}
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={loading}
        className="btn btn-primary"
        style={{
          fontSize: '1rem', padding: '1rem 2.2rem',
          opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer',
          width: '100%', justifyContent: 'center',
        }}
      >
        {loading ? 'Submitting…' : 'Submit Review →'}
      </button>

      <style>{`
        @media(max-width: 600px){ .form-row-2{ grid-template-columns: 1fr !important; } }
      `}</style>
    </motion.form>
  )
}

const labelCss = {
  display: 'block',
  fontFamily: "'Sora',sans-serif",
  fontSize: '.7rem', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase',
  color: '#6b7280', marginBottom: '.45rem',
}

/* ─────────── REVIEWS PAGE ─────────── */
export default function ReviewsPage() {
  const { isMobile } = useDevice()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all') /* 'all' | 'featured' | flavor slug */
  const [error, setError]     = useState('')

  /* Fetch reviews */
  const fetchReviews = async () => {
    if (!supabase) {
      setLoading(false)
      setError('Reviews backend is not configured yet.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from(REVIEWS_TABLE)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(200)
    setLoading(false)
    if (error) { setError(error.message); return }
    setReviews(data || [])
    setError('')
  }

  useEffect(() => {
    fetchReviews()
    if (!supabase) return
    /* Real-time subscription — new reviews appear live */
    const channel = supabase
      .channel('reviews-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: REVIEWS_TABLE }, payload => {
        setReviews(prev => {
          if (!payload.new?.is_published) return prev
          if (prev.some(r => r.id === payload.new.id)) return prev
          return [payload.new, ...prev]
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: REVIEWS_TABLE }, payload => {
        setReviews(prev => payload.new?.is_published
          ? prev.map(r => r.id === payload.new.id ? payload.new : r)
          : prev.filter(r => r.id !== payload.new.id)
        )
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: REVIEWS_TABLE }, payload => {
        setReviews(prev => prev.filter(r => r.id !== payload.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  /* Stats */
  const stats = useMemo(() => {
    if (!reviews.length) return { count: 0, avg: 0, ratingBuckets: [0,0,0,0,0] }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const ratingBuckets = [1,2,3,4,5].map(n => reviews.filter(r => r.rating === n).length)
    return { count: reviews.length, avg: sum / reviews.length, ratingBuckets }
  }, [reviews])

  const filtered = useMemo(() => {
    if (filter === 'all')      return reviews
    if (filter === 'featured') return reviews.filter(r => r.is_featured)
    return reviews.filter(r => r.flavor_slug === filter)
  }, [reviews, filter])

  return (
    <>
      {/* ════════════════════ HERO ════════════════════ */}
      <section className="page-hero" style={{
        background: 'linear-gradient(140deg,#fff8f0 0%,#fff3f8 50%,#f0fffe 100%)',
      }}>
        <div className="blob" style={{ width: 420, height: 420, top: '-18%', right: '-7%', background: 'rgba(245,181,0,.18)' }} />
        <div className="blob" style={{ width: 280, height: 280, bottom: '-10%', left: '5%', background: 'rgba(230,57,70,.15)', animationDelay: '-3s' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ justifyContent: 'center', color: '#f5b500' }}>
            Real Reviews · Real People
          </span>

          <h1 style={{ color: '#1a1a2e' }}>
            <SplitText text="What People Are" delay={0.1} />
            <br />
            <SplitText text="Saying." delay={0.55} />
          </h1>

          {/* Aggregate rating pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '1rem',
              padding: '.85rem 1.4rem', marginTop: '1.4rem',
              borderRadius: 9999,
              background: 'rgba(255,255,255,.85)',
              WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)',
              boxShadow: '0 10px 32px rgba(26,26,46,.1)',
              border: '1px solid rgba(255,255,255,.5)',
              flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            <div style={{
              fontFamily: "'Sora',sans-serif", fontSize: '1.6rem', fontWeight: 800,
              color: '#1a1a2e', display: 'flex', alignItems: 'baseline', gap: '.3rem',
            }}>
              {stats.avg ? stats.avg.toFixed(1) : '—'}
              <span style={{ fontSize: '.7rem', color: '#9ca3af', fontWeight: 600 }}>/ 5</span>
            </div>
            <Stars value={Math.round(stats.avg)} size={18} />
            <div style={{ fontSize: '.78rem', color: '#6b7280', fontWeight: 600 }}>
              from <strong style={{ color: '#1a1a2e' }}>{stats.count}</strong> {stats.count === 1 ? 'review' : 'reviews'}
            </div>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', fill: '#fff', pointerEvents: 'none' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ════════════════════ SUBMIT FORM ════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <ReviewForm onSubmitted={fetchReviews} />
        </div>
      </section>

      {/* ════════════════════ WALL ════════════════════ */}
      <section style={{ background: '#fffdf5', padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 7vw, 6rem)' }}>
        <div className="container">

          {/* Filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {[
              { id: 'all',      label: `All (${reviews.length})` },
              { id: 'featured', label: `★ Featured (${reviews.filter(r=>r.is_featured).length})` },
              ...FLAVORS.map(f => ({ id: f.slug, label: f.name, color: f.color })),
            ].map(chip => (
              <button key={chip.id} onClick={() => setFilter(chip.id)}
                style={{
                  padding: '.5rem 1rem', borderRadius: 9999,
                  fontFamily: "'Sora',sans-serif", fontSize: '.78rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all .2s', border: 'none',
                  background: filter === chip.id ? (chip.color || '#1a1a2e') : 'rgba(26,26,46,.05)',
                  color: filter === chip.id ? '#fff' : '#6b7280',
                  boxShadow: filter === chip.id ? `0 4px 14px ${(chip.color || '#1a1a2e')}40` : 'none',
                  transform: filter === chip.id ? 'translateY(-1px)' : 'none',
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Loading / Empty / Error */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontFamily: "'Sora',sans-serif", fontSize: '.85rem', letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Loading reviews…
            </div>
          )}
          {!loading && error && (
            <div style={{
              maxWidth: 600, margin: '2rem auto',
              padding: '1.5rem 1.8rem', borderRadius: 16,
              background: '#fff3e0', border: '1px solid #f7b86655',
              color: '#7a4500', fontSize: '.92rem', lineHeight: 1.6,
            }}>
              <strong>⚠ Backend not ready</strong><br />
              {error}<br /><br />
              Open <code>supabase-schema.sql</code> in your project root and paste it into your Supabase Dashboard → SQL Editor → Run. Then refresh this page.
            </div>
          )}
          {!loading && !error && !filtered.length && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              {reviews.length ? 'No reviews match this filter yet.' : 'Be the first to share your fizz story above ↑'}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.4rem',
              alignItems: 'start',
            }}>
              {filtered.map(r => <ReviewCard key={r.id} r={r} isMobile={isMobile} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
