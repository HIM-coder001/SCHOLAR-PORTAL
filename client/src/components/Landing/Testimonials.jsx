import testimonials from "../../assets/data/testimonials";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const StarRating = () => (
  <div className="flex gap-0.5 mb-5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialCard = ({ item, index }) => {
  const [ref, visible] = useScrollAnimation(0.1, index * 120);

  return (
    <div
      ref={ref}
      className={`bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } transition-all duration-600 ease-out`}
    >
      <StarRating />

      <p className="text-slate-600 leading-relaxed flex-1 text-sm">
        "{item.review}"
      </p>

      <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#004D40]/20"
        />
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{item.course}</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-bold bg-[#e6f0ed] text-[#004D40] px-2.5 py-1 rounded-full uppercase tracking-wide">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [headingRef, headingVisible] = useScrollAnimation(0.2);

  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${headingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="inline-block text-xs font-bold bg-[#e6f0ed] text-[#004D40] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Student Reviews
          </span>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Voices from our Scholars
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-base">
            Trusted by thousands of students and educators worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <TestimonialCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;