import { useState, useEffect } from 'react';

function CloseIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function VehicleImagesModal({ vehicle, open, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract all available photos (up to 3)
  const images = (() => {
    if (!vehicle) return [];
    const list = [];

    if (Array.isArray(vehicle.fotos)) {
      vehicle.fotos.forEach((f) => {
        if (f && typeof f === 'string' && !list.includes(f)) list.push(f);
      });
    }

    if (vehicle.foto1 && !list.includes(vehicle.foto1)) list.push(vehicle.foto1);
    if (vehicle.foto2 && !list.includes(vehicle.foto2)) list.push(vehicle.foto2);
    if (vehicle.foto3 && !list.includes(vehicle.foto3)) list.push(vehicle.foto3);
    if (vehicle.foto && !list.includes(vehicle.foto)) list.push(vehicle.foto);

    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop');
    }

    return list.slice(0, 3);
  })();

  const total = images.length;
  const isCarousel = total > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [vehicle]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (!isCarousel) return;
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isCarousel, total, onClose]);

  if (!open || !vehicle) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          width: '100%',
          maxWidth: 720,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                {vehicle.marca} {vehicle.modelo}
              </h2>
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 800,
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  letterSpacing: '0.04em',
                }}
              >
                {vehicle.placa || 'SIN PLACA'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b' }}>
              {isCarousel
                ? `Galería del vehículo • Imagen ${currentIndex + 1} de ${total}`
                : 'Fotografía del vehículo'}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            aria-label="Cerrar modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* IMAGE DISPLAY AREA */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#090d16',
            width: '100%',
            height: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`${vehicle.marca} ${vehicle.modelo} - Foto ${currentIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              transition: 'opacity 0.2s ease',
            }}
          />

          {/* CAROUSEL ARROWS */}
          {isCarousel && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.15s, background-color 0.15s',
                }}
                title="Foto anterior (Flecha izquierda)"
              >
                <ChevronLeftIcon />
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.15s, background-color 0.15s',
                }}
                title="Foto siguiente (Flecha derecha)"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}

          {/* DOTS / INDICATOR PILL */}
          {isCarousel && (
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: i === currentIndex ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: 'none',
                    backgroundColor: i === currentIndex ? '#ff9a2f' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: 0,
                  }}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* THUMBNAILS ROW (IF CAROUSEL) */}
        {isCarousel && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 64,
                  height: 48,
                  borderRadius: 10,
                  border: i === currentIndex ? '2px solid #ff9a2f' : '1px solid #cbd5e1',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: i === currentIndex ? 1 : 0.6,
                  transition: 'all 0.15s',
                  boxShadow: i === currentIndex ? '0 2px 8px rgba(255, 154, 47, 0.3)' : 'none',
                }}
              >
                <img
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {vehicle.color ? `Color: ${vehicle.color}` : ''} {vehicle.anio ? `• Año: ${vehicle.anio}` : ''}
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
