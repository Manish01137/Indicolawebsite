import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar      from './components/Navbar'
import Footer      from './components/Footer'
import Preloader   from './components/Preloader'
import PageWipe    from './components/PageWipe'
import AudioToggle from './components/AudioToggle'

import HomePage from './pages/HomePage'

/* Lazy-loaded inner pages for faster initial load */
const AboutPage   = lazy(() => import('./pages/AboutPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const FlavorsPage = lazy(() => import('./pages/FlavorsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function RouteFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 'var(--nav-h)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        border: '3px solid rgba(230,57,70,.15)',
        borderTopColor: '#e63946',
        animation: 'spin .8s linear infinite',
      }} />
    </div>
  )
}

export default function App() {
  /* Preloader: show only on initial page load this session */
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('indicolas-loaded')
  })

  /* Lenis smooth scroll + GSAP integration */
  useEffect(() => {
    if (loading) return  // wait for preloader

    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    const rafFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(rafFn)
    }
  }, [loading])

  const handlePreloadComplete = () => {
    sessionStorage.setItem('indicolas-loaded', '1')
    setLoading(false)
  }

  return (
    <>
      {loading && <Preloader onComplete={handlePreloadComplete} />}
      <PageWipe />
      <AudioToggle />

      <ScrollToTop />
      <Navbar />
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity .4s ease' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about"   element={<Suspense fallback={<RouteFallback />}><AboutPage   /></Suspense>} />
          <Route path="/history" element={<Suspense fallback={<RouteFallback />}><HistoryPage /></Suspense>} />
          <Route path="/flavors" element={<Suspense fallback={<RouteFallback />}><FlavorsPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<RouteFallback />}><ContactPage /></Suspense>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
