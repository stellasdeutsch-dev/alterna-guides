/* Şafak: солнце поднимается над холмами, автобус из Стамбула подъезжает под навес и проседает на рессорах,
   продавец гевреков выходит на перрон. Холмы чуть отстают при прокрутке. Верный ответ героя — поднос подпрыгивает. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const $ = (s) => document.querySelector(s);
  const scene = $('.lx-scene');
  if (!scene) return;

  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.e01-sun', { y: 34, opacity: 0.4, duration: 2.4, ease: 'power2.out' }, 0)
    .from('.e01-far, .e01-mid', { opacity: 0, duration: 1.4, stagger: 0.2, ease: 'power1.out' }, 0)
    .from('.e01-bus', { x: 560, duration: 2.2, ease: 'power3.out' }, 0.3)
    .fromTo('.e01-bus-bob', { y: 0 }, { y: 3, duration: 0.22, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.2)
    .from('.e01-seller', { x: -150, duration: 1.6, ease: 'power2.out' }, 0.8)
    .from('.e01-servis', { opacity: 0, x: 30, duration: 0.9, ease: 'power2.out' }, 1.2)
    .from('.e01-board', { opacity: 0, duration: 0.6 }, 1.6);

  /* параллакс: дальние холмы отстают, пока сцена на экране */
  const far = gsap.quickSetter('.e01-far', 'y', 'px');
  const mid = gsap.quickSetter('.e01-mid', 'y', 'px');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const r = scene.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const t = Math.min(600, Math.max(0, scrollY));
      far(t * 0.05);
      mid(t * 0.025);
    });
  }, { passive: true });

  /* верный выбор героя: поднос с гевреками подпрыгивает, автобус кивает */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.st-opt[data-ok="true"]');
    if (!b) return;
    gsap.timeline()
      .to('.e01-tray-hop', { y: -9, duration: 0.18, ease: 'power2.out' })
      .to('.e01-tray-hop', { y: 0, duration: 0.5, ease: 'bounce.out' });
    gsap.fromTo('.e01-bus-bob', { y: 0 }, { y: 2.5, duration: 0.16, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  });
})();
