import React from "react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import heroImage from "../../assets/images/hero_image.png";

const Hero = () => {
  const [textRef, textVisible] = useScrollAnimation();
  const [imgRef, imgVisible] = useScrollAnimation(0.1, 200);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center overflow-hidden">

      {/* Text content */}
      <div
        ref={textRef}
        className={`transition-all duration-700 ease-out ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <span className="inline-flex items-center gap-2 bg-[#e6f0ed] text-[#004D40] px-4 py-2 rounded-full text-sm font-semibold">
          ✨ New AI Study Assistant Released
        </span>

        <h1 className="text-5xl font-bold text-slate-900 mt-6 leading-tight">
          Your Digital{" "}
          <span className="text-[#004D40]">Academic Library</span>
        </h1>

        <p className="text-slate-600 mt-6 text-lg leading-relaxed">
          Access Past Papers, Notes, AI Study Tools, and Learning Resources
          Anytime, Anywhere. Elevate your scholarly journey with ScholarHub.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            to="/login"
            className="bg-[#004D40] hover:bg-[#00382e] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 block text-center shadow-lg shadow-[#004D40]/25 hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started
          </Link>

          <Link
            to="/past-papers"
            className="border-2 border-[#004D40] text-[#004D40] px-8 py-3.5 rounded-xl font-semibold hover:bg-[#004D40] hover:text-white transition-all duration-200 block text-center"
          >
            Explore Resources
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#004D40]">25K+</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Past Papers</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#004D40]">50K+</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Active Students</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-[#004D40]">150K+</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Downloads</p>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div
        ref={imgRef}
        className={`relative transition-all duration-700 ease-out delay-200 ${imgVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
      >
        <img
          src={heroImage}
          alt="ScholarHub Academic Platform"
          className="rounded-3xl shadow-2xl w-full"
        />

        {/* Floating stat badge */}
        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float">
          <p className="text-xs text-slate-500 font-medium">Active Books</p>
          <h3 className="text-2xl font-bold text-[#004D40] mt-0.5">12,482+</h3>
        </div>

        {/* Floating badge top right */}
        <div className="absolute -top-4 -right-4 bg-[#004D40] text-white px-4 py-2 rounded-2xl shadow-lg text-sm font-semibold">
          🎓 AI Powered
        </div>
      </div>

    </section>
  );
};

export default Hero;