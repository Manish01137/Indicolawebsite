import { motion } from 'framer-motion'

/**
 * Character-by-character text reveal — each letter flips up with rotateX.
 * Pass `className` to apply a wrapping style (e.g. "grad" for gradient text).
 *
 *   <SplitText text="Hello World" delay={0.2} className="grad" />
 */
export default function SplitText({
  text,
  delay      = 0,
  stagger    = 0.04,
  duration   = 0.7,
  className,
  style,
  as: Tag    = 'span',
}) {
  if (!text) return null
  const words = String(text).split(' ')

  return (
    <Tag className={className} style={{ display: 'inline-block', ...style }}>
      {words.map((word, w) => (
        <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.28em' }}>
          {word.split('').map((char, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={{ opacity: 0, y: '70%', rotateX: -55 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: delay + w * 0.07 + i * stagger,
                duration,
                ease: [0.2, 0.7, 0.3, 1.05],
              }}
              style={{
                display: 'inline-block',
                transformOrigin: '50% 100%',
                willChange: 'transform, opacity',
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
