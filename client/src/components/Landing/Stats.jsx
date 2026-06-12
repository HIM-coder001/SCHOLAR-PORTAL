import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const CountUp = ({ end, duration = 3 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime = null;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3); // cubic ease-out
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(easeOut(progress) * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count.toLocaleString("en-US")}</span>;
};

const stats = [
  { value: 25000, label: "Total Past Papers", suffix: "+" },
  { value: 12000, label: "Lecture Notes", suffix: "+" },
  { value: 50000, label: "Active Students", suffix: "+" },
  { value: 150000, label: "Downloads", suffix: "+" },
];

const Stats = () => {
  const [ref, visible] = useScrollAnimation(0.2);

  return (
    <section className="bg-[#004D40] py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 75% 50%, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h2 className="text-5xl font-black text-white tracking-tight">
                <CountUp end={stat.value} duration={3} />
                {stat.suffix}
              </h2>
              <div className="w-8 h-0.5 bg-white/30 mx-auto my-3 group-hover:w-16 transition-all duration-300" />
              <p className="text-emerald-100 uppercase tracking-widest text-xs font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;