import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AuthLayout({
  image,
  eyebrow,
  children,
  imageSide = 'left'
}) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('mc_auth_theme') === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  const isLight = theme === 'light'

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('mc_auth_theme', next)
      } catch {
        // ignore storage errors
      }
      return next
    })
  }

  const imagePanel = (
    <div
      className={`relative hidden h-full min-h-0 overflow-hidden md:block ${
        imageSide === 'left'
          ? 'animate-auth-image-left'
          : 'animate-auth-image-right'
      }`}
    >

      <img
        src={image}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#012538] via-[#012538]/50 to-[#1B768E]/30" />

      {/* Volver al inicio button */}
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver al inicio
      </Link>

      {eyebrow && (
        <div className="absolute bottom-8 left-8 right-8">

          <span className="inline-block rounded-full bg-[#FB9833]/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#012538]">
            {eyebrow}
          </span>

        </div>
      )}

    </div>
  )


  const formPanel = (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#FCEFEF] text-[#012538]' : 'bg-[#04141f] text-[#FCEFEF]'
      } ${
        imageSide === 'left'
          ? 'animate-auth-form-right'
          : 'animate-auth-form-left'
      }`}
    >

      {/* SOLO ESTE CONTENEDOR PUEDE HACER SCROLL */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden relative">

        {/* Botón de volver al inicio solo visible en móvil (ya que la imagen se oculta) */}
        <Link 
          to="/"
          className={`md:hidden absolute top-4 left-4 p-2 transition-colors z-20 ${
            isLight
              ? 'text-[#4D555B] hover:text-[#012538]'
              : 'text-[#7a8d9a] hover:text-white'
          }`}
          aria-label="Volver al inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        {/* Switch compacto de tema (solo icono, sin texto) */}
        <button
          type="button"
          role="switch"
          aria-checked={isLight}
          onClick={toggleTheme}
          title={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          className={`absolute top-4 right-4 sm:top-5 sm:right-6 z-20 flex h-6 w-11 items-center rounded-full border p-0.5 transition-all duration-300 cursor-pointer ${
            isLight
              ? 'border-[#4D555B]/25 bg-white shadow-2xs hover:border-[#1B768E]'
              : 'border-white/15 bg-white/10 hover:border-[#FB9833]/50'
          }`}
        >
          <span
            className={`flex h-4.5 w-4.5 items-center justify-center rounded-full shadow-xs transition-transform duration-300 ${
              isLight
                ? 'translate-x-5 bg-[#FB9833] text-[#012538]'
                : 'translate-x-0 bg-[#012538] text-[#FB9833]'
            }`}
          >
            {isLight ? (
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </span>
        </button>

        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-6 py-12 sm:px-10 sm:py-10">

          {children}

        </div>

      </div>

    </div>
  )


  return (

    <section
      className={`fixed inset-0 h-screen w-screen overflow-hidden transition-colors duration-300 ${
        isLight ? 'auth-light bg-[#FCEFEF]' : 'bg-[#012538]'
      }`}
    >

      <div className="grid h-full w-full md:grid-cols-2">

        {imageSide === 'left' ? (
          <>
            {imagePanel}
            {formPanel}
          </>
        ) : (
          <>
            {formPanel}
            {imagePanel}
          </>
        )}

      </div>

    </section>

  )
}
