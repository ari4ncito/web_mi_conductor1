export default function Footer() {
  const socials = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M13.5 21v-7.5H16l.5-3H13.5V8.25c0-.87.24-1.46 1.49-1.46H16.6V3.6C16.32 3.56 15.36 3.48 14.24 3.48c-2.33 0-3.93 1.42-3.93 4.03V10.5H7.8v3h2.51V21h3.19z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ];

  const actions = [
    "Trabaja con nosotros",
    "PQRSF",
  ];

  const links = [
    "Términos y Condiciones de uso del sitio web",
    "Términos y Condiciones del servicio",
    "Política de Privacidad de datos",
    "Línea Ética",
  ];

  return (
    <footer id="faq" className="bg-primary-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10 grid md:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            Comunícate con nosotros
          </h3>

          <div className="text-white/90 text-sm space-y-1 mb-8">
            <p className="font-semibold">Cartagena y Medellín</p>
            <p className="font-semibold">Línea única: 604 - 444 22 44</p>
            <p>contacto@miconductor.com</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <a
                key={action}
                href="#"
                className="bg-accent hover:bg-accent/90 transition-colors text-white text-sm font-semibold text-center px-6 py-3 rounded-full"
              >
                {action}
              </a>
            ))}
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-2xl font-bold text-white mb-6">Mi Conductor</p>

          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm text-white/90 hover:text-accent underline underline-offset-2 transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-center">
          <p className="text-xs text-white/70 leading-relaxed">
            Mi Conductor S.A.S Nit 900000000-0 Cra 00 # 00-00, Cartagena, Colombia.
          </p>
          <p className="text-xs text-white/50 mt-4">Copyright 2026</p>
        </div>
      </div>
    </footer>
  );
}