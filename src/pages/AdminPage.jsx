import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { supabase, isSupabaseConfigured, REVIEWS_TABLE } from '../lib/supabase'
import { FLAVORS } from '../data/flavors'
import { StarIcon, MailIcon, ArrowIcon } from '../components/SocialIcons'

function timeAgo(date) {
  const d = new Date(date)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60)       return `${s}s ago`
  if (s < 3600)     return `${Math.floor(s/60)}m ago`
  if (s < 86400)    return `${Math.floor(s/3600)}h ago`
  if (s < 86400*7)  return `${Math.floor(s/86400)}d ago`
  return d.toLocaleDateString()
}
const flavorBySlug = (s) => FLAVORS.find(f => f.slug === s)

function Stars({ value }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: '#f5b500' }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ display: 'inline-flex', opacity: n <= value ? 1 : 0.18 }}>
          <StarIcon size={12} />
        </span>
      ))}
    </span>
  )
}

/* ─────────── LOGIN SCREEN ─────────── */
function LoginCard({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd]     = useState('')
  const [busy, setBusy]   = useState(false)
  const [err, setErr]     = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!supabase) { setErr('Supabase is not configured.'); return }
    setBusy(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd })
    setBusy(false)
    if (error) { setErr(error.message); return }
    onLogin?.(data.user)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: 420, margin: '0 auto',
        background: '#fff', borderRadius: 26,
        padding: 'clamp(1.8rem, 4vw, 2.6rem)',
        boxShadow: '0 24px 60px rgba(26,26,46,.12), 0 4px 12px rgba(26,26,46,.06)',
        border: '1px solid rgba(26,26,46,.06)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative top stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #e63946, #f77f00, #06d6a0, #9b5de5)',
      }} />

      <div style={{
        width: 54, height: 54, borderRadius: 16,
        background: 'linear-gradient(135deg,#1a1a2e,#3a3a5a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', marginBottom: '1.2rem',
        boxShadow: '0 10px 24px rgba(26,26,46,.18), inset 0 1px 0 rgba(255,255,255,.18)',
      }}>
        🔒
      </div>

      <h1 style={{
        fontFamily: "'Sora',sans-serif",
        fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em',
        marginBottom: '.4rem',
      }}>
        Admin Login
      </h1>
      <p style={{ fontSize: '.88rem', color: '#6b7280', marginBottom: '1.8rem' }}>
        Sign in to manage reviews. Only the registered admin can delete or feature.
      </p>

      <form onSubmit={submit}>
        <label style={labelCss}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          required autoComplete="email" placeholder="you@indicolas.com"
          style={{ ...inputStyle, marginBottom: '1rem' }}
        />
        <label style={labelCss}>Password</label>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
          required autoComplete="current-password" placeholder="••••••••"
          style={{ ...inputStyle, marginBottom: '1.4rem' }}
        />

        {err && (
          <div style={{
            padding: '.8rem 1rem', borderRadius: 10, marginBottom: '1rem',
            background: '#ffe4e6', border: '1px solid #e6394655',
            color: '#9f1239', fontSize: '.88rem', fontWeight: 600,
          }}>
            ⚠ {err}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem 2.2rem', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <p style={{
        marginTop: '1.6rem', fontSize: '.7rem', color: '#9ca3af',
        textAlign: 'center', lineHeight: 1.6,
      }}>
        Don't have an admin account yet? Create one in your Supabase Dashboard →
        Authentication → Users → "Add user".
      </p>
    </motion.div>
  )
}

/* ─────────── MANAGEMENT TABLE ─────────── */
function ManageTable({ user, onLogout }) {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all') /* all | published | hidden | featured */
  const [err, setErr]         = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(REVIEWS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) { setErr(error.message); return }
    setRows(data || [])
    setErr('')
  }

  useEffect(() => {
    load()
    /* Live updates */
    const channel = supabase
      .channel('admin-reviews-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: REVIEWS_TABLE }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = rows.filter(r => {
    if (filter === 'all')       return true
    if (filter === 'published') return r.is_published
    if (filter === 'hidden')    return !r.is_published
    if (filter === 'featured')  return r.is_featured
    return true
  })

  const stats = {
    total:     rows.length,
    published: rows.filter(r => r.is_published).length,
    hidden:    rows.filter(r => !r.is_published).length,
    featured:  rows.filter(r => r.is_featured).length,
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete the review by "${name}"? This cannot be undone.`)) return
    const { error } = await supabase.from(REVIEWS_TABLE).delete().eq('id', id)
    if (error) alert('Delete failed: ' + error.message)
  }

  const togglePublished = async (r) => {
    const { error } = await supabase.from(REVIEWS_TABLE).update({ is_published: !r.is_published }).eq('id', r.id)
    if (error) alert('Update failed: ' + error.message)
  }

  const toggleFeatured = async (r) => {
    const { error } = await supabase.from(REVIEWS_TABLE).update({ is_featured: !r.is_featured }).eq('id', r.id)
    if (error) alert('Update failed: ' + error.message)
  }

  return (
    <>
      {/* Top toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        marginBottom: '1.6rem', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: '.2rem',
          }}>
            Reviews Admin
          </h1>
          <p style={{ fontSize: '.82rem', color: '#6b7280' }}>
            Signed in as <strong style={{ color: '#1a1a2e' }}>{user.email}</strong>
          </p>
        </div>
        <button onClick={onLogout} className="btn btn-outline" style={{ fontSize: '.85rem', padding: '.7rem 1.4rem' }}>
          Sign Out
        </button>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '.85rem', marginBottom: '1.6rem',
      }}>
        {[
          { id: 'all',       label: 'Total',     n: stats.total,     color: '#1a1a2e' },
          { id: 'published', label: 'Published', n: stats.published, color: '#06d6a0' },
          { id: 'hidden',    label: 'Hidden',    n: stats.hidden,    color: '#9ca3af' },
          { id: 'featured',  label: 'Featured',  n: stats.featured,  color: '#f5b500' },
        ].map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            style={{
              padding: '1rem 1.2rem', borderRadius: 16, border: 'none',
              background: filter === s.id ? s.color : '#fff',
              color: filter === s.id ? '#fff' : '#1a1a2e',
              boxShadow: filter === s.id ? `0 10px 24px ${s.color}40` : '0 4px 14px rgba(26,26,46,.06)',
              transition: 'transform .2s, box-shadow .25s, background .25s, color .25s',
              cursor: 'pointer', textAlign: 'left',
              transform: filter === s.id ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800,
              fontSize: '1.6rem', lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              {s.n}
            </div>
            <div style={{
              fontFamily: "'Sora',sans-serif", fontSize: '.7rem',
              fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
              marginTop: '.3rem', opacity: filter === s.id ? .95 : .6,
            }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Error */}
      {err && (
        <div style={{
          padding: '1rem 1.2rem', borderRadius: 12, marginBottom: '1.2rem',
          background: '#ffe4e6', border: '1px solid #e6394655',
          color: '#9f1239', fontSize: '.9rem',
        }}>
          ⚠ {err}
        </div>
      )}

      {/* Table */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          Loading reviews…
        </div>
      )}

      {!loading && !filtered.length && (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: '#fff', borderRadius: 18,
          boxShadow: '0 4px 14px rgba(26,26,46,.06)',
          color: '#9ca3af',
        }}>
          No reviews match this filter.
        </div>
      )}

      {!loading && !!filtered.length && (
        <div style={{
          background: '#fff', borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(26,26,46,.07), 0 1px 4px rgba(26,26,46,.04)',
          border: '1px solid rgba(26,26,46,.05)',
        }}>
          {filtered.map((r, i) => {
            const flavor = r.flavor_slug ? flavorBySlug(r.flavor_slug) : null
            return (
              <div key={r.id} style={{
                padding: '1.1rem 1.3rem',
                borderTop: i === 0 ? 'none' : '1px solid rgba(26,26,46,.05)',
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                flexWrap: 'wrap',
                opacity: r.is_published ? 1 : 0.55,
                background: r.is_featured ? 'linear-gradient(90deg, rgba(245,181,0,.04), transparent 60%)' : 'transparent',
              }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', marginBottom: '.35rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontFamily: "'Sora',sans-serif", color: '#1a1a2e', fontSize: '.95rem' }}>{r.name}</strong>
                    <Stars value={r.rating} />
                    <span style={{ fontSize: '.72rem', color: '#9ca3af' }}>· {timeAgo(r.created_at)}</span>
                    {!r.is_published && (
                      <span style={{
                        padding: '.18rem .55rem', borderRadius: 9999,
                        background: 'rgba(26,26,46,.08)', color: '#6b7280',
                        fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                      }}>Hidden</span>
                    )}
                    {r.is_featured && (
                      <span style={{
                        padding: '.18rem .55rem', borderRadius: 9999,
                        background: 'linear-gradient(135deg,#f5b500,#f77f00)', color: '#fff',
                        fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                      }}>★ Featured</span>
                    )}
                    {flavor && (
                      <span style={{
                        padding: '.18rem .55rem', borderRadius: 9999,
                        background: flavor.bg, color: flavor.color,
                        fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                      }}>{flavor.name}</span>
                    )}
                  </div>
                  {r.title && (
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.92rem', color: '#1a1a2e', marginBottom: '.2rem' }}>
                      {r.title}
                    </div>
                  )}
                  <p style={{ fontSize: '.86rem', color: '#4b5563', lineHeight: 1.55, margin: 0 }}>{r.body}</p>
                  {r.location && (
                    <div style={{ fontSize: '.7rem', color: '#9ca3af', marginTop: '.3rem' }}>📍 {r.location}</div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button onClick={() => toggleFeatured(r)} style={btnGhost(r.is_featured ? '#f5b500' : '#9ca3af')}>
                    {r.is_featured ? '★ Featured' : '☆ Feature'}
                  </button>
                  <button onClick={() => togglePublished(r)} style={btnGhost(r.is_published ? '#06d6a0' : '#9ca3af')}>
                    {r.is_published ? '👁 Hide' : '👁 Show'}
                  </button>
                  <button onClick={() => handleDelete(r.id, r.name)} style={btnGhost('#e63946', true)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

const btnGhost = (color, danger=false) => ({
  padding: '.45rem .85rem', borderRadius: 9999,
  fontFamily: "'Sora',sans-serif", fontSize: '.72rem', fontWeight: 700,
  letterSpacing: '.04em',
  border: `1px solid ${color}50`,
  background: danger ? `${color}10` : '#fff',
  color, cursor: 'pointer',
  transition: 'background .2s, transform .2s',
})

const labelCss = {
  display: 'block',
  fontFamily: "'Sora',sans-serif",
  fontSize: '.7rem', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase',
  color: '#6b7280', marginBottom: '.45rem',
}

const inputStyle = {
  width: '100%', padding: '.85rem 1.1rem', borderRadius: 12,
  border: '1.5px solid rgba(26,26,46,.1)', fontSize: '.95rem',
  fontFamily: "'Inter',sans-serif", color: '#1a1a2e',
  background: '#fff', outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
}

/* ─────────── ADMIN PAGE ─────────── */
export default function AdminPage() {
  const [user, setUser]       = useState(null)
  const [checking, setCheck]  = useState(true)

  useEffect(() => {
    if (!supabase) { setCheck(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      setCheck(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  const onLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!isSupabaseConfigured) {
    return (
      <section style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 'calc(var(--nav-h) + 3rem) 2rem 3rem' }}>
        <div style={{
          maxWidth: 500, padding: '2rem', borderRadius: 18,
          background: '#fff3e0', border: '1px solid #f7b86655',
          color: '#7a4500', lineHeight: 1.7,
        }}>
          <strong>⚠ Supabase not configured</strong>
          <p style={{ marginTop: '.5rem', fontSize: '.92rem' }}>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file, then restart the dev server.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{
      minHeight: '88vh',
      padding: 'calc(var(--nav-h) + 2.5rem) 0 3rem',
      background: 'linear-gradient(180deg, #fffdf5 0%, #fff 60%, #fff5e8 100%)',
    }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {checking ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Loading admin…</div>
        ) : !user ? (
          <LoginCard onLogin={setUser} />
        ) : (
          <ManageTable user={user} onLogout={onLogout} />
        )}
      </div>
    </section>
  )
}
