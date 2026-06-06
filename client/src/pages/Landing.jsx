import React from 'react'
import Navbar from '../components/shared/Navbar'
import Hero from '../components/Landing/Hero'
import Testimonials from '../components/Landing/Testimonials'
import Features from '../components/Landing/Features'
import Stats from '../components/Landing/Stats'
import Footer from '../components/shared/Footer'

const Landing = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Landing
