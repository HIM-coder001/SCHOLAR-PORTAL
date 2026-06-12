import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Past Papers",
    description: "Extensive archive of previous examinations across all faculties and academic departments.",
    badge: "Most Used",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Lecture Notes",
    description: "Curated high-quality notes contributed by top students and verified by academic staff.",
    badge: null,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Study Assistant",
    description: "Personalized learning companion that explains complex concepts, summarizes text, and reads PDFs.",
    badge: "New ✨",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "Voice Search",
    description: "Effortless natural language search capability to find resources while on the move.",
    badge: null,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Resource Downloads",
    description: "Offline access to all your saved materials. Study anywhere without worrying about internet.",
    badge: null,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Smart Recommendations",
    description: "Intelligent discovery engine suggesting papers and notes based on your course of study.",
    badge: null,
  },
];

const FeatureCard = ({ feature, index }) => {
  const [ref, visible] = useScrollAnimation(0.1, index * 100);

  return (
    <div
      ref={ref}
      className={`group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } transition-all duration-600 ease-out`}
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#004D40] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 bg-[#e6f0ed] group-hover:bg-[#004D40]/10 rounded-xl flex items-center justify-center transition-colors duration-300">
          {feature.icon}
        </div>
        {feature.badge && (
          <span className="text-[10px] font-bold bg-[#004D40] text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
            {feature.badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#004D40] transition-colors duration-200">
        {feature.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {feature.description}
      </p>

      {/* Arrow on hover */}
      <div className="flex items-center gap-1 mt-4 text-[#004D40] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
        <span>Learn more</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );
};

const Features = () => {
  const [headingRef, headingVisible] = useScrollAnimation(0.2);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div
          ref={headingRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="inline-block text-xs font-bold bg-[#e6f0ed] text-[#004D40] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to excel
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            A comprehensive suite of tools designed for the modern researcher and student.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;