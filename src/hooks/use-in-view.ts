"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const {
    once = true,
    threshold = 0.1,
    rootMargin = "0px 0px -80px 0px",
    ...rest
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin, ...rest }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, isInView };
}
