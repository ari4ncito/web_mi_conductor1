import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

import { getLenis, setLenis } from "../utils/landingScroll";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const PRELOADER_FLAG = "mc-landing-preloader-seen";

export function readShouldShowPreloader() {
  try {
    return !window.sessionStorage.getItem(PRELOADER_FLAG);
  } catch (err) {
    // Sin acceso a sessionStorage (modo privado estricto): se muestra igual
    console.warn("[Landing] sessionStorage no disponible:", err?.message);
    return true;
  }
}

function markPreloaderSeen() {
  try {
    window.sessionStorage.setItem(PRELOADER_FLAG, "1");
  } catch (err) {
    console.warn("[Landing] No se pudo guardar el estado del preloader:", err?.message);
  }
}

/**
 * Scroll suave (Lenis) + animaciones de la landing (GSAP/ScrollTrigger).
 * Todo se limpia al desmontar para no afectar el resto de la SPA.
 */
export default function useLandingAnimations(scopeRef, { showPreloader }) {
  // useLayoutEffect para que la clase de html y Lenis existan antes de que useGSAP mida.
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add("mc-landing");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    const tick = (time) => lenis?.raf(time * 1000);

    if (!reduceMotion) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    setLenis(lenis);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch((err) => console.warn("[Landing] fonts.ready:", err?.message));

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      setLenis(null);
      html.classList.remove("mc-landing");
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scopeRef);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions;

          if (reduce) {
            gsap.set(q(".mc-preloader"), { display: "none" });
            return undefined;
          }

          // 1. Scroll horizontal (primero: los ScrollTrigger con pin deben crearse antes que los de abajo)
          const track = q(".mc-h-track")[0];
          if (desktop && track) {
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
            gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: q(".mc-h-section")[0],
                pin: true,
                scrub: 1,
                end: () => `+=${distance()}`,
                invalidateOnRefresh: true,
              },
            });
          }

          // 2. Preloader + entrada del hero
          const intro = gsap.timeline({ delay: 0.1 });
          const preloader = q(".mc-preloader")[0];

          // Se relee el flag: si matchMedia re-ejecuta este bloque (resize), el preloader no se repite
          const playPreloader = showPreloader && readShouldShowPreloader();
          if (playPreloader && preloader) {
            const countEl = q(".mc-preloader__count")[0];
            const counter = { v: 0 };
            getLenis()?.stop();
            intro
              .to(counter, {
                v: 100,
                duration: 1.4,
                ease: "power2.inOut",
                onUpdate: () => {
                  if (countEl) countEl.textContent = String(Math.round(counter.v));
                },
              })
              .to(q(".mc-preloader__brand"), { yPercent: -120, duration: 0.6, ease: "power3.in" }, "-=0.25")
              .to(preloader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.1")
              .set(preloader, { display: "none" })
              .call(() => {
                getLenis()?.start();
                markPreloaderSeen();
              });
          } else if (preloader) {
            gsap.set(preloader, { display: "none" });
          }

          const heroTitle = q(".mc-hero__title")[0];
          const introAt = playPreloader ? "-=0.75" : 0;
          intro.from(q(".mc-hero__media img"), { scale: 1.25, duration: 2.2, ease: "expo.out" }, introAt);
          if (heroTitle) {
            const split = SplitText.create(heroTitle, { type: "lines", mask: "lines" });
            intro.from(split.lines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.12 }, "<0.15");
          }
          intro
            .from(q(".mc-hero__fade"), { y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, "-=0.8")
            .from(q(".mc-hero__card"), { y: 60, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, "-=0.8");

          // 3. Hero con parallax al salir
          const hero = q(".mc-hero")[0];
          if (hero) {
            const heroScroll = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
            gsap.to(q(".mc-hero__media"), { yPercent: 18, ease: "none", scrollTrigger: heroScroll });
            gsap.to(q(".mc-hero__content"), { yPercent: -10, opacity: 0.15, ease: "none", scrollTrigger: { ...heroScroll } });
          }

          // 4. Capas con velocidad propia (data-speed)
          const factor = desktop ? 1 : 0.5;
          q("[data-speed]").forEach((el) => {
            const speed = parseFloat(el.dataset.speed) * factor;
            gsap.to(el, {
              yPercent: speed * 100,
              ease: "none",
              scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
            });
          });

          // 5. Imágenes que se mueven dentro de su marco
          q(".mc-parallax").forEach((wrap) => {
            const img = wrap.querySelector(".mc-parallax__img");
            if (!img) return;
            gsap.fromTo(
              img,
              { yPercent: -8 },
              { yPercent: 8, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } }
            );
          });

          // 6. Revelados al entrar en pantalla
          q("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              y: 48,
              autoAlpha: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

          q("[data-reveal-img]").forEach((el) => {
            gsap.from(el, {
              clipPath: "inset(100% 0% 0% 0%)",
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            });
          });

          q("[data-stagger]").forEach((el) => {
            gsap.from(el.children, {
              y: 36,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 86%" },
            });
          });

          q("[data-split]").forEach((el) => {
            const split = SplitText.create(el, { type: "words", mask: "words" });
            gsap.from(split.words, {
              yPercent: 110,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

          // 7. Texto que se "enciende" palabra por palabra con el scroll
          q("[data-scrub-words]").forEach((el) => {
            const split = SplitText.create(el, { type: "words" });
            gsap.fromTo(
              split.words,
              { opacity: 0.18 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.06,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
              }
            );
          });

          // 8. Contadores
          q("[data-count]").forEach((el) => {
            const target = Number(el.dataset.count) || 0;
            const counter = { v: 0 };
            el.textContent = "0";
            gsap.to(counter, {
              v: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.v).toLocaleString("es-CO");
              },
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });

          // 9. Línea de progreso de los pasos
          const steps = q(".mc-steps")[0];
          if (steps) {
            gsap.fromTo(
              q(".mc-steps__fill"),
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: steps, start: "top 65%", end: "bottom 65%", scrub: true },
              }
            );
          }

          // 10. Botones magnéticos (solo desktop con mouse)
          const cleanups = [];
          if (desktop && window.matchMedia("(pointer: fine)").matches) {
            q("[data-magnetic]").forEach((btn) => {
              const onMove = (e) => {
                const r = btn.getBoundingClientRect();
                gsap.to(btn, {
                  x: (e.clientX - r.left - r.width / 2) * 0.3,
                  y: (e.clientY - r.top - r.height / 2) * 0.3,
                  duration: 0.4,
                });
              };
              const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
              btn.addEventListener("pointermove", onMove);
              btn.addEventListener("pointerleave", onLeave);
              cleanups.push(() => {
                btn.removeEventListener("pointermove", onMove);
                btn.removeEventListener("pointerleave", onLeave);
              });
            });
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );
    },
    { scope: scopeRef }
  );
}
