import { HandHeart, MousePointerClick } from 'lucide-react'
import React from 'react'

function Hero() {
  return (
    
    <section>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
        <img
          alt="imaage"
          src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=1983&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="absolute inset-0 h-full w-full object-cover rounded-lg"
        />
       
      </div>

      <div className="lg:py-24">
        <h2 className="text-3xl font-bold sm:text-4xl">Your Health, Our Priority</h2>

        <p className="mt-4 text-gray-600">
          Book apponitment with best doctors and get the best treatment with one-click.
        </p>

        <a
          href="/login"
          className="mt-8 inline-block rounded bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400">
          Explore Now
        </a>
      </div>
    </div>
  </div>
</section>

  )
}

export default Hero