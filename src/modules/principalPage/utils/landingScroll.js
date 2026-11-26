// Instancia de Lenis compartida entre los componentes de la landing (null fuera de ella
// o cuando el usuario prefiere movimiento reducido).
let lenisInstance = null;

const NAV_OFFSET = 72;

export const setLenis = (instance) => {
  lenisInstance = instance;
};

export const getLenis = () => lenisInstance;

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
  return true;
};

export const scrollToTop = () => {
  if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};
