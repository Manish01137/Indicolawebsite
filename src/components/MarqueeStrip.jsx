/**
 * Infinite scrolling tagline band — items triple-rendered so the
 * `translateX(-33.333%)` animation loops seamlessly.
 *
 *   <MarqueeStrip
 *     items={['POP THE FIZZ', 'BOLD FLAVORS']}
 *     speed={32}
 *     color="#e63946"
 *     textColor="#fff"
 *     tilt={-1.4}      // degrees rotation
 *     reverse={false}
 *   />
 */
export default function MarqueeStrip({
  items     = [],
  speed     = 32,
  reverse   = false,
  color     = '#e63946',
  textColor = '#fff',
  tilt      = -1.4,
  divider   = '★',
  marginY   = 'clamp(3rem, 6vw, 5rem)',
}) {
  return (
    <div style={{
      overflow: 'hidden',
      background: color,
      padding: 'clamp(1rem, 1.8vw, 1.4rem) 0',
      whiteSpace: 'nowrap',
      transform: `rotate(${tilt}deg)`,
      margin: `${marginY} 0`,
      boxShadow: '0 16px 40px rgba(26,26,46,.08)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
      }}>
        {[0, 1, 2].map(rep => items.map((item, i) => (
          <span key={`${rep}-${i}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '1.2rem', padding: '0 1.6rem',
            fontFamily: "'Sora',sans-serif",
            fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
            fontWeight: 800, color: textColor, letterSpacing: '-0.01em',
          }}>
            {item}
            <span style={{ fontSize: '.7em', opacity: .6 }}>{divider}</span>
          </span>
        )))}
      </div>
    </div>
  )
}
