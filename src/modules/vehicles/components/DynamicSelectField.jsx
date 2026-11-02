import { useState, useRef, useEffect, useMemo } from 'react';

export default function DynamicSelectField({
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Selecciona o escribe...',
  customPlaceholder = 'Escribe el valor personalizado...',
  icon,
  readOnly = false,
  error,
  forceManual = false, // When true, behaves directly as a manual text input
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Check if current value is known in options
  const isKnown = useMemo(() => {
    if (!value) return true;
    return options.some((opt) => opt.toLowerCase() === String(value).toLowerCase());
  }, [value, options]);

  const [isManual, setIsManual] = useState(!isKnown || forceManual);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // If forceManual changes, sync isManual
  useEffect(() => {
    if (forceManual) {
      setIsManual(true);
    }
  }, [forceManual]);

  // If value changes from outside and is not known and not empty, go manual
  useEffect(() => {
    if (value && !options.some((opt) => opt.toLowerCase() === String(value).toLowerCase())) {
      setIsManual(true);
    }
  }, [value, options]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, searchTerm]);

  // ReadOnly mode
  if (readOnly) {
    return (
      <div className="mb-4">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <div
            className={`w-full ${
              icon ? 'pl-11' : 'pl-4'
            } pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 min-h-[46px] flex items-center`}
          >
            {value ? String(value) : <span className="text-slate-400 font-normal italic">No especificado</span>}
          </div>
          {label && (
            <label className="absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded text-slate-500">
              {label}
            </label>
          )}
        </div>
      </div>
    );
  }

  // Manual text input mode
  if (isManual || forceManual) {
    return (
      <div className="mb-4" ref={containerRef}>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={customPlaceholder || placeholder}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-24 py-3 rounded-xl border ${
              error ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-200 bg-white'
            } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm font-medium text-slate-700`}
          />

          {!forceManual && options.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsManual(false);
                setSearchTerm('');
                setIsOpen(true);
              }}
              title="Volver a seleccionar de la lista predefinida"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span>Lista</span>
            </button>
          )}

          {label && (
            <label
              className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                error ? 'text-red-500' : 'text-slate-500'
              }`}
            >
              {label} {forceManual ? '' : '(Personalizado)'} {required && <span className="text-red-500">*</span>}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
      </div>
    );
  }

  // Dynamic Combobox / Searchable Select mode
  return (
    <div className="mb-4 relative" ref={containerRef}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value || ''}
          placeholder={value ? value : placeholder}
          onFocus={() => {
            setSearchTerm('');
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-10 py-3 rounded-xl border ${
            error ? 'border-red-500 bg-red-50/30 ring-2 ring-red-100' : 'border-slate-200 bg-white'
          } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm font-medium text-slate-700 cursor-pointer`}
        />

        {/* Chevron icon */}
        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              setSearchTerm('');
              inputRef.current?.focus();
            }
            setIsOpen(!isOpen);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {label && (
          <label
            className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${
              error ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-64 flex flex-col">
          {/* Search indicator if typing */}
          {searchTerm && (
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Filtrando por: &quot;<strong>{searchTerm}</strong>&quot;</span>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Limpiar
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => {
                const isSelected = String(value).toLowerCase() === opt.toLowerCase();
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50 font-bold text-orange-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <span className="text-orange-500 text-xs">✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 italic text-center">
                No se encontraron opciones para &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {/* Option: OTRO (escribir manualmente) */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/80">
            <button
              type="button"
              onClick={() => {
                setIsManual(true);
                setIsOpen(false);
                // If user was searching for something, preserve it as the custom value
                if (searchTerm.trim() && !options.some(o => o.toLowerCase() === searchTerm.toLowerCase())) {
                  onChange(searchTerm.trim());
                } else {
                  onChange('');
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-xs font-bold text-orange-600 flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <span>➕</span>
              <span>
                {searchTerm.trim()
                  ? `Usar "${searchTerm.trim()}" (Personalizado)`
                  : 'Otro / Otra (Escribir manualmente)...'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
