/**
 * Audio system using Web Audio API — no external sound files required.
 * Sounds are synthesized in real-time from oscillators + noise buffers.
 * Muted by default. State persisted in localStorage.
 */
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'indicolas-muted'
let audioCtx = null
let muted = true
const listeners = new Set()

if (typeof window !== 'undefined') {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'false') muted = false
}

const notify = () => listeners.forEach(fn => fn(muted))

const ensureCtx = () => {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    audioCtx = new AC()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
  return audioCtx
}

export function setMuted(m) {
  muted = m
  try { window.localStorage.setItem(STORAGE_KEY, String(m)) } catch {}
  notify()
}
export const getMuted = () => muted

/* ── POP: short noise burst with descending low-pass ── */
export function playPop() {
  if (muted) return
  const ctx = ensureCtx(); if (!ctx) return
  const now = ctx.currentTime
  const len = Math.floor(ctx.sampleRate * 0.18)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    const t = i / len
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.6)
  }
  const src = ctx.createBufferSource(); src.buffer = buf
  const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'
  flt.frequency.setValueAtTime(2400, now)
  flt.frequency.exponentialRampToValueAtTime(280, now + 0.16)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.55, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
  src.connect(flt); flt.connect(g); g.connect(ctx.destination)
  src.start(now); src.stop(now + 0.18)
}

/* ── FIZZ: longer band-passed noise ── */
export function playFizz() {
  if (muted) return
  const ctx = ensureCtx(); if (!ctx) return
  const now = ctx.currentTime
  const dur = 0.7
  const len = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5
  const src = ctx.createBufferSource(); src.buffer = buf
  const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'
  flt.frequency.value = 4200; flt.Q.value = 1.6
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.18, now + 0.06)
  g.gain.exponentialRampToValueAtTime(0.001, now + dur)
  src.connect(flt); flt.connect(g); g.connect(ctx.destination)
  src.start(now); src.stop(now + dur)
}

/* ── CLICK: short sine tap ── */
export function playClick() {
  if (muted) return
  const ctx = ensureCtx(); if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, now)
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.05)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.09, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
  osc.connect(g); g.connect(ctx.destination)
  osc.start(now); osc.stop(now + 0.06)
}

/* React hook for muted state */
export function useMutedState() {
  const [m, setM] = useState(muted)
  useEffect(() => {
    listeners.add(setM)
    return () => listeners.delete(setM)
  }, [])
  return [m, setMuted]
}
