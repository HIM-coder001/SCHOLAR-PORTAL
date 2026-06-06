import React from "react";
import heroImage from  '../../assets/images/hero_image.png'

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">

      <div>
        <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          ✨ New AI Study Assistant Released
        </span>

        <h1 className="text-5xl font-bold text-slate-900 mt-6 leading-tight">
          Your Digital Academic Library
        </h1>

        <p className="text-slate-600 mt-6 text-lg leading-relaxed">
          Access Past Papers, Notes, AI Study Tools, and Learning Resources
          Anytime, Anywhere. Elevate your scholarly journey with ScholarHub.
        </p>

        <div className="flex gap-4 mt-8">
          <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-medium transition">
            Get Started
          </button>

          <button className="border border-green-700 text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition">
            Explore Resources
          </button>
        </div>
      </div>

      <div className="relative">
        <img
          src={heroImage}
          alt="ScholarHub"
          className="rounded-3xl shadow-2xl"
        />

        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg">
          <p className="text-sm text-slate-500">
            Active Books
          </p>

          <h3 className="text-2xl font-bold text-green-700">
            12,482+
          </h3>
        </div>
      </div>

    </section>
  );
};

export default Hero;