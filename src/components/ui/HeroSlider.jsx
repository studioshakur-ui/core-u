import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const images = ['/ships/hero-1.jpg','/ships/hero-2.jpg','/ships/hero-3.jpg','/ships/hero-4.jpg','/ships/hero-5.jpg','/ships/hero-6.jpg']

export default function HeroSlider() {
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), 4000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-e2">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/50 to-transparent text-white">
        <div className="flex items-center gap-3">
          <img src="/logo-core.svg" alt="CORE" className="h-8" />
          <h2 className="text-xl md:text-2xl font-heading">CORE — Cable Operations Reporting & Engineering</h2>
        </div>
      </div>
    </div>
  )
}
