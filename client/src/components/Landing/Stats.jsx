import { useState, useEffect, useRef } from "react";

const CountUp = ({ end, duration = 4, separator = "," }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Start animation only when element is visible
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
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count.toLocaleString(separator === "," ? "en-US" : undefined)}</span>;
};

const Stats = () => {
  return (
    <section className="bg-green-800 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-5xl font-bold text-white">
              <CountUp end={25000} duration={4} />+
            </h2>
            <p className="text-green-100 mt-2 uppercase tracking-widest text-sm">Total Past Papers</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-white">
              <CountUp end={12000} duration={4} />+
            </h2>
            <p className="text-green-100 mt-2 uppercase tracking-widest text-sm">Total Notes</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-white">
              <CountUp end={50000} duration={4} />+
            </h2>
            <p className="text-green-100 mt-2 uppercase tracking-widest text-sm">Active Students</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-white">
              <CountUp end={150000} duration={4} />+
            </h2>
            <p className="text-green-100 mt-2 uppercase tracking-widest text-sm">Downloads Count</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;