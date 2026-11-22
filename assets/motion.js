(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const elements = document.querySelectorAll(
    '#home > header, #home section > h2, #home section > p, ' +
    '#home .project, #home > footer, article > *'
  );
  const animations = new Set();

  const observer = new IntersectionObserver((entries) => {
    let delay = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches) continue;

      const animation = entry.target.animate(
        [
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 680,
          delay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards'
        }
      );
      delay = Math.min(delay + 80, 320);
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  if (!preference.matches) elements.forEach((element) => observer.observe(element));

  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
  });
})();
