import { Link } from 'react-router-dom'

export default function AuthLayout({
  image,
  eyebrow,
  children,
  imageSide = 'left'
}) {

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
      className={`flex h-full min-h-0 flex-col overflow-hidden bg-[#04141f] ${
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
          className="md:hidden absolute top-4 left-4 p-2 text-[#7a8d9a] hover:text-white transition-colors"
          aria-label="Volver al inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>

        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-6 py-12 sm:px-10 sm:py-10">

          {children}

        </div>

      </div>

    </div>
  )


  return (

    <section className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#012538]">

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
