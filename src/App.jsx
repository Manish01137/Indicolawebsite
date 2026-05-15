import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import Preloader       from './components/Preloader'
import CustomCursor    from './components/CustomCursor'
import PageWipe        from './components/PageWipe'
import AudioToggle     from './components/AudioToggle'

import HomePage    from './pages/HomePage'
import AboutPage   from './pages/AboutPage'
import HistoryPage from './pages/HistoryPage'
import FlavorsPage from './pages/FlavorsPage'
import ContactPage from './pages/ContactPage'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
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

  /* Mark loaded so preloader doesn't reappear on route changes */
  const handlePreloadComplete = () => {
    sessionStorage.setItem('indicolas-loaded', '1')
    setLoading(false)
  }

  return (
    <>
      {loading && <Preloader onComplete={handlePreloadComplete} />}
      <CustomCursor />
      <PageWipe />
      <AudioToggle />

      <ScrollToTop />
      <Navbar />
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity .4s ease' }}>
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/flavors" element={<FlavorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
