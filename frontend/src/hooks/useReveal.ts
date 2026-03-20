import { useEffect } from 'react';

export function useReveal(dep?: unknown) {
  useEffect(() => {
    let observer: IntersectionObserver;

    // React가 DOM을 커밋한 뒤에 실행되도록 소량 지연
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
