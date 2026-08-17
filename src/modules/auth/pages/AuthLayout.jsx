export default function AuthLayout({ image, eyebrow, children }) {
  return (
    <section className="h-screen w-full overflow-hidden bg-[#012538] px-4 py-8 sm:px-6">

      <div className="mx-auto grid h-full w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#04141f] shadow-2xl shadow-black/40 md:grid-cols-2">

        {/* ================================= */}
        {/* PANEL VISUAL */}
        {/* ================================= */}

        <div className="relative hidden h-full md:block">

          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#012538] via-[#012538]/50 to-[#1B768E]/30" />

          {eyebrow && (
            <div className="absolute bottom-8 left-8 right-8">

              <span className="inline-block rounded-full bg-[#FB9833]/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#012538]">
                {eyebrow}
              </span>

            </div>
          )}

        </div>


        {/* ================================= */}
        {/* PANEL DEL FORMULARIO */}
        {/* ================================= */}

        <div className="flex min-h-0 h-full flex-col">

          {/* CONTENIDO CON SCROLL */}

          <div className="min-h-0 flex-1 overflow-y-auto">

            <div className="flex min-h-full flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">

              {children}

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}