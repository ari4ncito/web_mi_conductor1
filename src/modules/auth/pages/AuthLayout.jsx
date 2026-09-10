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
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">

        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">

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