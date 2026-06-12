import { useEffect, useRef, useState } from "react";

/**
 * useScrollAnimation
 * Returns [ref, isVisible] where isVisible becomes true once the element
 * enters the viewport. Optional delay (ms) staggers multiple elements.
 */
export const useScrollAnimation = (threshold = 0.15, delay = 0) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          // Unobserve after first trigger so animation fires once
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const node = ref.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, delay]);

  return [ref, isVisible];
};

export default useScrollAnimation;
