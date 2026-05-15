import { useMutedState, playClick } from '../hooks/useAudio'

export default function AudioToggle() {
  const [muted, setMuted] = useMutedState()

  const toggle = () => {
    const next = !muted
    setMuted(next)
    if (!next) playClick()  // play once when unmuting
  }

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Sound is OFF' : 'Sound is ON'}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        zIndex: 9500,
        width: 50, height: 50,
        borderRadius: '50%',
        background: muted ? 'rgba(255,255,255,.92)' : 'linear-gradient(135deg,#e63946,#f77f00)',
        color: muted ? '#1a1a2e' : '#fff',
        border: '1px solid rgba(26,26,46,.08)',
        boxShadow: muted ? '0 8px 24px rgba(0,0,0,.1)' : '0 10px 32px rgba(230,57,70,.4)',
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
        transition: 'transform .2s, box-shadow .25s, background .3s, color .3s',
        padding: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4z" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
      )}
    </button>
  )
}
