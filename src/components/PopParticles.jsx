import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Splash burst — 18 colorful particles radiating outward + a glass marble flying up + screen flash.
 * Triggered by `active` becoming truthy; resets when active becomes false.
 */
const COUNT = 18

export default function PopParticles({ active, color = '#e63946', onDone }) {
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    if (active) setSeed(s => s + 1)
  }, [active])

  const particles = useMemo(() => Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.45
    const distance = 110 + Math.random() * 160
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance - 30
    const isColored = i % 3 === 0
    return {
      tx, ty,
      size: 8 + Math.random() * 9,
      delay: Math.random() * 0.06,
      duration: 0.9 + Math.random() * 0.35,
      color: isColored ? color : 'rgba(255,255,255,.95)',
    }
  }), [seed, color])

  if (!active && seed === 0) return null

  return (
    <div
      key={seed}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: 0, height: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Flash overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.55, 0], scale: [0.4, 2.3, 2.6] }}
        transition={{ duration: 0.55, times: [0, 0.2, 1], ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: 280, height: 280,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}cc 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* Marble */}
      <motion.div
        initial={{ y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
        animate={{ y: -210, opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.85], rotate: 540 }}
        transition={{ duration: 1.1, times: [0, 0.2, 0.7, 1], ease: 'easeOut' }}
        onAnimationComplete={() => onDone?.()}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: 26, height: 26,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 28%, #fff 0%, #c8e6ff 45%, #5e9fd0 100%)',
          boxShadow: '0 6px 22px rgba(94,159,208,.55), inset -3px -3px 6px rgba(0,0,0,.18)',
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.tx, y: p.ty + 180, opacity: 0, scale: 0.2 }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            transform: 'translate(-50%,-50%)',
            boxShadow: `0 0 14px ${p.color === 'rgba(255,255,255,.95)' ? 'rgba(255,255,255,.7)' : color}`,
          }}
        />
      ))}
    </div>
  )
}
