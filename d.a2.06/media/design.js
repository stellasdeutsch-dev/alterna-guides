/* Merdiven: дом проявляется, пролёты лестницы встают по одному, герой поднимается на третий этаж ступенька за ступенькой,
   Серкан-бей уже ждёт у двери, соседка выглядывает с балкона, а на потолке ванной проступает «тень».
   Выбор героя отзывается в сцене: пятно, соседка, ключи риелтора. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  const $ = (s) => document.querySelector(s);
  if (!$('.e06-hero')) return;

  gsap.timeline({ delay: 0.1 })
    .from('.e06-far', { y: 14, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.e06-flight', { y: 8, opacity: 0, duration: 0.45, stagger: 0.15, ease: 'power2.out' }, 0.15)
    .from('.e06-line', { y: -10, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.4)
    .from('.e06-serkan', { x: 8, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.5)
    .fromTo('.e06-hero', { x: 29, y: 130, scaleX: -1, opacity: 0 }, { x: -37, y: 50, opacity: 1, duration: 1.1, ease: 'steps(8)' }, 0.5)
    .set('.e06-hero', { scaleX: 1 })
    .to('.e06-hero', { x: 0, y: 0, duration: 0.7, ease: 'steps(5)' })
    .from('.e06-teyze', { y: 30, duration: 0.7, ease: 'back.out(1.6)' }, 1.4)
    .from('.e06-stain', { scale: 0.4, opacity: 0, transformOrigin: '50% 0%', duration: 1.2, ease: 'power2.out' }, 2.1);

  /* лёгкий параллакс: дальний план и облака отстают при прокрутке */
  const far = $('.e06-far');
  const clouds = $('.e06-clouds');
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const y = Math.min(scrollY, 500);
      gsap.set(far, { y: y * 0.08 });
      gsap.set(clouds, { x: y * -0.05 });
    });
  }, { passive: true });

  /* выбор героя: глава 2 — пятно, глава 3 — соседка, глава 4 — ключи */
  const boxes = [...document.querySelectorAll('[data-choice]')];
  const react = [
    (ok) => gsap.fromTo('.e06-stain', { scale: 1 }, { scale: ok ? 1.25 : 1.1, transformOrigin: '50% 0%', duration: 0.35, yoyo: true, repeat: ok ? 3 : 1, ease: 'sine.inOut' }),
    (ok) => gsap.fromTo('.e06-teyze', { y: 0 }, { y: -6, duration: 0.18, yoyo: true, repeat: ok ? 3 : 5, ease: 'power1.inOut' }),
    (ok) => gsap.fromTo('.e06-keys', { rotation: 0 }, { rotation: ok ? -35 : 25, transformOrigin: '50% 0%', duration: 0.2, yoyo: true, repeat: 3, ease: 'power1.inOut' }),
  ];
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.st-opt');
    if (!opt) return;
    const i = boxes.indexOf(opt.closest('[data-choice]'));
    if (react[i]) react[i](opt.dataset.ok === 'true');
  });
})();
